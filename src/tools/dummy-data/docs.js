const docs = {
    about:
        'Make as many fake records as you need for testing: people, addresses, contact details, company details, and technical values such as IDs and timestamps. Choose the fields, then copy or download the result in the format your project uses.',
    howItWorks: [
        'Pick the fields you want in step 1, or start from a ready-made set. Fields are grouped, and each group can be opened and closed.',
        'Step 2 lists your fields as columns. Move them up or down, rename the column, or set limits such as the smallest and largest number, a date range, or the email domain.',
        'Step 3 sets how many records to make (up to 5,000), the country and language, and an optional seed. With the same seed and settings you always get the same data, and adding or removing a field never changes the values of the others. With no seed, every run is new.',
        'Step 4 picks the format: JSON (formatted, compact, or one record per line), CSV, HTML table, SQL INSERT statements, XML, YAML, Markdown table, TypeScript, or JavaScript. Numbers and true/false values stay numbers and true/false in the formats that support them.',
        'The result can be shown as a table or as the exact text. Copy and Download use the full text, even when the preview only shows the first rows. Files are named dummy-data with the right ending, such as .json, .csv, or .sql.',
        'Names, phone numbers, streets and companies come from the Faker library, which runs inside your browser. Only the country you choose is loaded.',
    ],
    notes: [
        'Everything is made up. Email addresses and websites use example.com, which is reserved for examples. United States phone numbers use the 555-0100 to 555-0199 range kept for fiction. Phone numbers for other countries have a realistic shape, but a number could by chance belong to a real person, so do not call them.',
        'For the United States, United Kingdom, India, Germany, France, Spain, and Brazil, the city, region, postal code, and coordinates of a record match each other. For Australia, Canada, Italy, the Netherlands, and Poland they come from Faker and may not belong together; the coordinates only stay inside a rough box around the country. No address is checked against real maps or postal databases.',
        'The date of birth and age always match each other on the date shown under “Counted as of”, which is today when the page opens.',
        'Empty values are written as null in JSON and YAML, as an empty cell in CSV, HTML, and Markdown, as NULL in SQL, and as an element marked xsi:nil="true" in XML. ID and UUID are never left empty.',
        'SQL output has INSERT statements only, with up to 500 rows each. Names are put in quotes for the database you choose, text is escaped, and true/false becomes TRUE/FALSE (1/0 for SQLite). It does not create the table for you.',
        'XML element names are made valid: spaces and symbols become underscores, and a name that starts with a digit gets an underscore in front.',
        'Link sharing keeps only simple choices (fields, number of records, country, format, and options). The seed, column names, table name, and limits you typed are not included.',
        'The table preview shows the first 100 records and the text preview the first 400 lines, so big results stay fast.',
    ],
    privacy:
        'Everything is made in your browser from data that ships with the page. Nothing is sent to a server, no accounts or API keys are used, and Devora does not save your settings or the generated data.',
}

export default docs