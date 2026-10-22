import Papa from 'papaparse'
import { stringify as stringifyYaml } from 'yaml'

/*
 * Turns the generated records into text. Each writer receives the columns and the rows
 * (rows[i][j] belongs to columns[j]; a value is a string, number, boolean, or null for "empty").
 * CSV uses papaparse and YAML uses the yaml package. The rest are written here because they are
 * short and need our own rules (SQL dialects, XML names, and so on).
 */

export const FORMAT_META = {
    json: { extension: 'json', mime: 'application/json' },
    csv: { extension: 'csv', mime: 'text/csv' },
    html: { extension: 'html', mime: 'text/html' },
    sql: { extension: 'sql', mime: 'application/sql' },
    xml: { extension: 'xml', mime: 'application/xml' },
    yaml: { extension: 'yaml', mime: 'application/yaml' },
    markdown: { extension: 'md', mime: 'text/markdown' },
    typescript: { extension: 'ts', mime: 'application/typescript' },
    javascript: { extension: 'js', mime: 'text/javascript' },
}

const toObjects = (columns, rows) =>
    rows.map((row) => Object.fromEntries(columns.map((column, position) => [column.key, row[position]])))

// ---- JSON ----

function writeJson(columns, rows, settings) {
    const records = toObjects(columns, rows)
    if (settings.jsonLines) return records.map((record) => JSON.stringify(record)).join('\n')
    return JSON.stringify(records, null, settings.jsonPretty ? 2 : undefined)
}

// ---- CSV ----

function writeCsv(columns, rows) {
    return Papa.unparse(
        { fields: columns.map((column) => column.key), data: rows.map((row) => row.map((value) => value ?? '')) },
        { newline: '\n' },
    )
}

// ---- HTML ----

const escapeHtml = (text) =>
    String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])

function writeHtml(columns, rows) {
    const head = columns.map((column) => `        <th scope="col">${escapeHtml(column.key)}</th>`).join('\n')
    const body = rows
        .map((row) => `      <tr>\n${row.map((value) => `        <td>${value === null ? '' : escapeHtml(value)}</td>`).join('\n')}\n      </tr>`)
        .join('\n')
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Dummy data</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 1.5rem; }
      table { border-collapse: collapse; }
      th, td { border: 1px solid #ccc; padding: 0.35rem 0.6rem; text-align: left; }
      thead th { background: #f3f3f3; }
    </style>
  </head>
  <body>
    <h1>Dummy data</h1>
    <p>${rows.length} fictional records.</p>
    <table>
      <thead>
      <tr>
${head}
      </tr>
      </thead>
      <tbody>
${body}
      </tbody>
    </table>
  </body>
</html>`
}

// ---- SQL ----

export const SQL_DEFAULT_TABLE = 'dummy_data'

// The name of a table or column, wrapped for the chosen database. Quotes inside the name are doubled.
export function quoteIdentifier(name, dialect) {
    if (dialect === 'mysql') return `\`${name.replace(/`/g, '``')}\``
    return `"${name.replace(/"/g, '""')}"`
}

function sqlValue(value, dialect) {
    if (value === null) return 'NULL'
    if (typeof value === 'number') return String(value)
    if (typeof value === 'boolean') return dialect === 'sqlite' ? (value ? '1' : '0') : value ? 'TRUE' : 'FALSE'
    let text = String(value)
    if (dialect === 'mysql') text = text.replace(/\\/g, '\\\\') // MySQL treats a backslash as an escape inside text
    return `'${text.replace(/'/g, "''")}'`
}

const SQL_BATCH = 500 // rows per INSERT, so very large outputs stay readable and within common limits

function writeSql(columns, rows, settings) {
    const dialect = settings.dialect
    const table = quoteIdentifier(settings.sqlTable.trim() || SQL_DEFAULT_TABLE, dialect)
    const names = columns.map((column) => quoteIdentifier(column.key, dialect)).join(', ')
    const statements = []
    for (let start = 0; start < rows.length; start += SQL_BATCH) {
        const lines = rows
            .slice(start, start + SQL_BATCH)
            .map((row) => `  (${row.map((value) => sqlValue(value, dialect)).join(', ')})`)
        statements.push(`INSERT INTO ${table} (${names}) VALUES\n${lines.join(',\n')};`)
    }
    return statements.join('\n\n')
}

// ---- XML ----

// Anything XML does not allow in text (most control characters) is dropped.
// eslint-disable-next-line no-control-regex
const XML_INVALID = /[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g

const escapeXml = (text) =>
    String(text)
        .replace(XML_INVALID, '')
        .replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char])

// An element name must start with a letter or underscore, and may then use letters, digits, - _ and .
export function xmlName(text, fallback) {
    let name = String(text).trim().replace(/[^\p{L}\p{N}_.-]/gu, '_')
    if (!name) name = fallback
    if (!/^[\p{L}_]/u.test(name)) name = `_${name}`
    if (/^xml/i.test(name)) name = `_${name}` // names starting with "xml" are reserved
    return name
}

function writeXml(columns, rows, settings) {
    const root = xmlName(settings.xmlRoot, 'records')
    const record = xmlName(settings.xmlRecord, 'record')
    const used = new Set()
    const names = columns.map((column) => {
        const base = xmlName(column.key, 'field')
        let name = base
        let counter = 2
        while (used.has(name)) {
            name = `${base}_${counter}`
            counter += 1
        }
        used.add(name)
        return name
    })
    const hasEmpty = rows.some((row) => row.includes(null))
    // An empty value is written as an element marked xsi:nil="true", the standard XML way to say "no value".
    const namespace = hasEmpty ? ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' : ''
    const body = rows
        .map((row) => {
            const fields = row
                .map((value, position) =>
                    value === null
                        ? `    <${names[position]} xsi:nil="true"/>`
                        : `    <${names[position]}>${escapeXml(value)}</${names[position]}>`,
                )
                .join('\n')
            return `  <${record}>\n${fields}\n  </${record}>`
        })
        .join('\n')
    return `<?xml version="1.0" encoding="UTF-8"?>\n<${root}${namespace}>${body ? `\n${body}\n` : ''}</${root}>`
}

// ---- YAML ----

function writeYaml(columns, rows) {
    return stringifyYaml(toObjects(columns, rows), { lineWidth: 0 }).trimEnd()
}

// ---- Markdown table ----

const escapeCell = (text) => String(text).replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')

function writeMarkdown(columns, rows) {
    const header = `| ${columns.map((column) => escapeCell(column.key)).join(' | ')} |`
    const divider = `| ${columns.map(() => '---').join(' | ')} |`
    const body = rows.map((row) => `| ${row.map((value) => (value === null ? '' : escapeCell(value))).join(' | ')} |`)
    return [header, divider, ...body].join('\n')
}

// ---- TypeScript and JavaScript ----

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/

const SCRIPT_ESCAPES = { '\\': '\\\\', "'": "\\'", '\n': '\\n', '\r': '\\r', '\u2028': '\\u2028', '\u2029': '\\u2029' }

const literal = (value) => {
    if (value === null) return 'null'
    if (typeof value === 'string') return `'${value.replace(/[\\'\n\r\u2028\u2029]/g, (char) => SCRIPT_ESCAPES[char])}'`
    return String(value)
}

function writeScript(columns, rows, typed) {
    const keyOf = (column) => (IDENTIFIER.test(column.key) ? column.key : literal(column.key))
    const records = rows
        .map((row) => `  {\n${columns.map((column, position) => `    ${keyOf(column)}: ${literal(row[position])},`).join('\n')}\n  },`)
        .join('\n')
    const list = rows.length ? `[\n${records}\n]` : '[]'
    if (!typed) return `export const records = ${list};`
    const fields = columns
        .map((column, position) => {
            const nullable = rows.some((row) => row[position] === null)
            return `  ${keyOf(column)}: ${column.type}${nullable ? ' | null' : ''};`
        })
        .join('\n')
    return `export interface DummyRecord {\n${fields}\n}\n\nexport const records: DummyRecord[] = ${list};`
}

// ---- entry point ----

/** Writes the records in the chosen format. Returns the text plus the file type to use for a download. */
export function formatOutput(columns, rows, settings) {
    const format = FORMAT_META[settings.format] ? settings.format : 'json'
    const text = {
        json: () => writeJson(columns, rows, settings),
        csv: () => writeCsv(columns, rows),
        html: () => writeHtml(columns, rows),
        sql: () => writeSql(columns, rows, settings),
        xml: () => writeXml(columns, rows, settings),
        yaml: () => writeYaml(columns, rows),
        markdown: () => writeMarkdown(columns, rows),
        typescript: () => writeScript(columns, rows, true),
        javascript: () => writeScript(columns, rows, false),
    }[format]()
    const meta = FORMAT_META[format]
    const isLines = format === 'json' && settings.jsonLines
    return {
        text,
        extension: isLines ? 'jsonl' : meta.extension,
        mime: isLines ? 'application/x-ndjson' : meta.mime,
    }
}