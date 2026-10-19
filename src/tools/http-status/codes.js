/*
 * The reference data. Each entry is [code, name, summary, usage, source, flag]:
 *  - source: where it is defined, like "RFC 9110 §15.5.5", or who uses it for unofficial codes.
 *  - flag: "deprecated" (do not use in new work), "reserved" (not for general use), or
 *          "unofficial" (not part of the standard, used by one product).
 */
const ROWS = [
    // 1xx: the request was received and the process continues.
    [100, 'Continue', 'The server has received the request headers and the client should send the body.',
        'A reply to a request with “Expect: 100-continue”. It lets a client avoid uploading a large body that would be rejected. Rarely handled by hand.', 'RFC 9110 §15.2.1'],
    [101, 'Switching Protocols', 'The server agrees to switch to the protocol the client asked for.',
        'Sent when upgrading a connection, most often to WebSocket. It follows a request with an Upgrade header.', 'RFC 9110 §15.2.2'],
    [102, 'Processing', 'The server has accepted the request and is still working on it (WebDAV).',
        'Stops the client from timing out during long WebDAV operations. It was later removed from the specification, so avoid it in new work.', 'RFC 2518', 'deprecated'],
    [103, 'Early Hints', 'The server sends some headers early so the browser can start loading resources.',
        'Typically Link headers with rel=preload, sent while the server is still preparing the full response.', 'RFC 8297'],

    // 2xx: success.
    [200, 'OK', 'The request succeeded.',
        'The standard success response. For GET the body is the resource, and for POST it describes the result.', 'RFC 9110 §15.3.1'],
    [201, 'Created', 'The request succeeded and a new resource was created.',
        'Return it after a POST (or PUT) that creates something, with a Location header pointing to the new resource.', 'RFC 9110 §15.3.2'],
    [202, 'Accepted', 'The request was accepted for processing, but the work is not finished.',
        'Use it for asynchronous work such as background jobs. Tell the client where to check on the progress.', 'RFC 9110 §15.3.3'],
    [203, 'Non-Authoritative Information', 'The content comes from a copy or has been changed by a proxy.',
        'Rare. It tells the client that a transforming proxy modified the origin server’s response.', 'RFC 9110 §15.3.4'],
    [204, 'No Content', 'The request succeeded and there is nothing to send back.',
        'Common for DELETE, or for a PUT or PATCH that needs no body. The response must not have a body.', 'RFC 9110 §15.3.5'],
    [205, 'Reset Content', 'The request succeeded and the client should reset the view that sent it.',
        'For example, clearing a form after it was submitted. Rarely used.', 'RFC 9110 §15.3.6'],
    [206, 'Partial Content', 'The server is sending only part of the resource, as requested.',
        'The reply to a Range request, used for resumable downloads and video seeking. It comes with a Content-Range header.', 'RFC 9110 §15.3.7'],
    [207, 'Multi-Status', 'Several operations were done and each has its own status (WebDAV).',
        'The XML body lists a separate status for each part of the request.', 'RFC 4918'],
    [208, 'Already Reported', 'The members of a WebDAV binding were already listed earlier in the response.',
        'Avoids repeating the same items several times in one WebDAV reply.', 'RFC 5842'],
    [226, 'IM Used', 'The response is the result of instance manipulations applied to the resource (delta encoding).',
        'Very rare. It is used when a server sends only the difference from a version the client already has.', 'RFC 3229'],

    // 3xx: redirection.
    [300, 'Multiple Choices', 'There are several possible responses and the client should choose one.',
        'Rarely used in practice, because there is no standard way to make the choice.', 'RFC 9110 §15.4.1'],
    [301, 'Moved Permanently', 'The resource has a new permanent address.',
        'Use it when an address changes for good. Browsers and search engines move to the new address. Clients may change a POST into a GET when following it, so use 308 to keep the method.', 'RFC 9110 §15.4.2'],
    [302, 'Found', 'The resource is temporarily at another address.',
        'A temporary redirect. Many clients change a POST into a GET when following it. Use 307 to keep the method.', 'RFC 9110 §15.4.3'],
    [303, 'See Other', 'The result is at another address and should be fetched with GET.',
        'Common after a POST: send the browser to a result page so that reloading it does not submit the form again.', 'RFC 9110 §15.4.4'],
    [304, 'Not Modified', 'The saved copy is still valid, so no body is sent.',
        'The reply to a conditional request (If-None-Match or If-Modified-Since). It saves bandwidth when caching.', 'RFC 9110 §15.4.5'],
    [305, 'Use Proxy', 'The resource must be reached through a proxy.',
        'Deprecated for security reasons. Do not use it.', 'RFC 9110 §15.4.6', 'deprecated'],
    [306, '(Unused)', 'Was used in an old draft of the specification.',
        'The number is reserved and must not be used.', 'RFC 9110 §15.4.7', 'reserved'],
    [307, 'Temporary Redirect', 'A temporary redirect that keeps the request method and body.',
        'Use it instead of 302 when a POST must stay a POST.', 'RFC 9110 §15.4.8'],
    [308, 'Permanent Redirect', 'A permanent redirect that keeps the request method and body.',
        'Use it instead of 301 when a POST must stay a POST.', 'RFC 9110 §15.4.9'],

    // 4xx: the client made a mistake.
    [400, 'Bad Request', 'The server cannot understand the request because it is malformed.',
        'Invalid syntax, missing or broken parameters, or bad JSON. Say what is wrong in the response body.', 'RFC 9110 §15.5.1'],
    [401, 'Unauthorized', 'Authentication is missing or not valid.',
        'Despite the name, it means “not authenticated”. Include a WWW-Authenticate header. The client can try again with credentials.', 'RFC 9110 §15.5.2'],
    [402, 'Payment Required', 'Reserved for future use.',
        'Not defined by the standard. Some services use it for billing or quota problems.', 'RFC 9110 §15.5.3', 'reserved'],
    [403, 'Forbidden', 'The server understood the request but refuses to allow it.',
        'The client is known (or does not need to be) but is not permitted. Trying again with the same credentials will not help.', 'RFC 9110 §15.5.4'],
    [404, 'Not Found', 'The server cannot find the requested resource.',
        'The address may be wrong or the resource may have been removed. It is also used to hide that a resource exists.', 'RFC 9110 §15.5.5'],
    [405, 'Method Not Allowed', 'The method is not supported for this resource.',
        'The response must include an Allow header listing the methods that are supported, for example a POST sent to a read-only address.', 'RFC 9110 §15.5.6'],
    [406, 'Not Acceptable', 'The server cannot produce a response that matches the Accept headers.',
        'The client asked for a format, language, or encoding that the server cannot provide.', 'RFC 9110 §15.5.7'],
    [407, 'Proxy Authentication Required', 'The client must authenticate with the proxy first.',
        'Like 401, but for a proxy. It includes a Proxy-Authenticate header.', 'RFC 9110 §15.5.8'],
    [408, 'Request Timeout', 'The server gave up waiting for the request.',
        'The client was too slow to finish sending it. The client may try again.', 'RFC 9110 §15.5.9'],
    [409, 'Conflict', 'The request conflicts with the current state of the resource.',
        'For example an edit conflict, a duplicate username, or a version mismatch. Explain how to resolve it.', 'RFC 9110 §15.5.10'],
    [410, 'Gone', 'The resource existed once and has been removed for good.',
        'Stronger than 404: it tells clients and search engines to forget the address.', 'RFC 9110 §15.5.11'],
    [411, 'Length Required', 'The server requires a Content-Length header.',
        'The request has a body but did not say how long it is.', 'RFC 9110 §15.5.12'],
    [412, 'Precondition Failed', 'A condition in the request headers was not met.',
        'For example, If-Match did not match the current ETag. It protects against overwriting someone else’s change.', 'RFC 9110 §15.5.13'],
    [413, 'Content Too Large', 'The request body is larger than the server allows.',
        'Formerly called Payload Too Large. Upload size limits trigger it, and the server may close the connection.', 'RFC 9110 §15.5.14'],
    [414, 'URI Too Long', 'The address is longer than the server will accept.',
        'Often caused by a very long query string. Move the data into a POST body instead.', 'RFC 9110 §15.5.15'],
    [415, 'Unsupported Media Type', 'The server does not support the type of the request’s content.',
        'For example, sending XML to an endpoint that only accepts JSON. Check the Content-Type header.', 'RFC 9110 §15.5.16'],
    [416, 'Range Not Satisfiable', 'The requested range is outside the resource.',
        'The Range header asked for bytes that do not exist.', 'RFC 9110 §15.5.17'],
    [417, 'Expectation Failed', 'The server cannot meet the requirement in the Expect header.',
        'Sent when the Expect header asks for something the server cannot do.', 'RFC 9110 §15.5.18'],
    [418, 'I’m a teapot', 'A joke: the server is a teapot and refuses to make coffee.',
        'From the April Fools’ RFC 2324. HTTP reserves the number. Some services use it playfully or to turn away unwanted clients.', 'RFC 2324', 'reserved'],
    [421, 'Misdirected Request', 'The request was sent to a server that cannot answer for that address.',
        'Seen with HTTP/2 when a connection is reused for a host it does not serve.', 'RFC 9110 §15.5.20'],
    [422, 'Unprocessable Content', 'The request is well formed but its content is not valid.',
        'Widely used by APIs for validation errors, for example a field has a wrong value. Formerly called Unprocessable Entity.', 'RFC 9110 §15.5.21'],
    [423, 'Locked', 'The resource is locked (WebDAV).',
        'Another client holds a lock on the resource.', 'RFC 4918'],
    [424, 'Failed Dependency', 'The request failed because an earlier request it depended on failed (WebDAV).',
        'Used in WebDAV batch operations.', 'RFC 4918'],
    [425, 'Too Early', 'The server will not process a request that might be replayed.',
        'Relates to TLS early data (0-RTT), where a request can be sent twice by an attacker.', 'RFC 8470'],
    [426, 'Upgrade Required', 'The client must switch to a different protocol.',
        'The response includes an Upgrade header that names the protocol, for example TLS.', 'RFC 9110 §15.5.22'],
    [428, 'Precondition Required', 'The server requires the request to be conditional.',
        'Used to stop lost updates: the client must send If-Match, so a change cannot overwrite a newer one.', 'RFC 6585'],
    [429, 'Too Many Requests', 'The client has sent too many requests in a given time.',
        'Rate limiting. It may include a Retry-After header. Clients should slow down and try again later.', 'RFC 6585'],
    [431, 'Request Header Fields Too Large', 'The request headers, or one header, are too big.',
        'Often caused by oversized cookies. Removing some of them usually fixes it.', 'RFC 6585'],
    [451, 'Unavailable For Legal Reasons', 'The resource cannot be shown because of a legal demand.',
        'The number is a reference to the novel Fahrenheit 451.', 'RFC 7725'],

    // 5xx: the server failed.
    [500, 'Internal Server Error', 'The server hit an unexpected problem.',
        'A generic catch-all for server bugs. Check the server logs: the client did nothing wrong.', 'RFC 9110 §15.6.1'],
    [501, 'Not Implemented', 'The server does not support the feature needed to handle the request.',
        'For example, an unknown request method.', 'RFC 9110 §15.6.2'],
    [502, 'Bad Gateway', 'A gateway or proxy got an invalid response from the server behind it.',
        'Common when the application server is down or has crashed behind a proxy such as nginx.', 'RFC 9110 §15.6.3'],
    [503, 'Service Unavailable', 'The server cannot handle the request right now.',
        'Usually overload or maintenance. It may include a Retry-After header, and clients can try again later.', 'RFC 9110 §15.6.4'],
    [504, 'Gateway Timeout', 'A gateway or proxy did not get a response in time.',
        'The server behind the proxy is too slow. Look for slow queries or long-running tasks.', 'RFC 9110 §15.6.5'],
    [505, 'HTTP Version Not Supported', 'The server does not support the HTTP version used in the request.',
        'Rare in practice.', 'RFC 9110 §15.6.6'],
    [506, 'Variant Also Negotiates', 'A server configuration error in content negotiation.',
        'The chosen variant is itself set up to negotiate, which creates a circular reference.', 'RFC 2295'],
    [507, 'Insufficient Storage', 'The server cannot store what is needed to finish the request (WebDAV).',
        'The server ran out of space for the operation.', 'RFC 4918'],
    [508, 'Loop Detected', 'The server found an infinite loop while processing the request (WebDAV).',
        'Stops an operation that would never finish.', 'RFC 5842'],
    [510, 'Not Extended', 'The request needs further extensions for the server to handle it.',
        'Rarely used and not recommended.', 'RFC 2774', 'deprecated'],
    [511, 'Network Authentication Required', 'The client must log in to the network first.',
        'For example, a Wi-Fi captive portal that appears before you can reach the internet.', 'RFC 6585'],

    // Not part of the standard, but common enough to meet in real projects.
    [419, 'Page Expired', 'The session or security token has expired.',
        'Used by the Laravel framework when a CSRF token is missing or out of date. Reload the page and try again.', 'Laravel', 'unofficial'],
    [444, 'No Response', 'The server closed the connection without sending a response.',
        'Used by nginx to drop unwanted requests quietly. The client never sees this code.', 'nginx', 'unofficial'],
    [499, 'Client Closed Request', 'The client closed the connection before the server replied.',
        'Recorded by nginx in its logs when a browser or app gives up waiting.', 'nginx', 'unofficial'],
    [520, 'Web Server Returned an Unknown Error', 'The origin server sent something Cloudflare could not understand.',
        'A catch-all Cloudflare error. Check the origin server’s logs.', 'Cloudflare', 'unofficial'],
    [521, 'Web Server Is Down', 'Cloudflare could not connect to the origin server.',
        'The origin refused the connection or is switched off. Check that it is running and not blocking Cloudflare.', 'Cloudflare', 'unofficial'],
    [522, 'Connection Timed Out', 'Cloudflare could not complete a connection to the origin in time.',
        'The origin is too slow to answer or is blocking Cloudflare’s addresses.', 'Cloudflare', 'unofficial'],
    [523, 'Origin Is Unreachable', 'Cloudflare cannot reach the origin server.',
        'Usually a wrong address in the DNS settings or a network problem.', 'Cloudflare', 'unofficial'],
    [524, 'A Timeout Occurred', 'The origin accepted the connection but did not reply in time.',
        'A request that runs for too long. Move slow work to the background.', 'Cloudflare', 'unofficial'],
    [525, 'SSL Handshake Failed', 'Cloudflare could not set up a secure connection with the origin.',
        'Check that the origin supports TLS and offers compatible settings.', 'Cloudflare', 'unofficial'],
    [526, 'Invalid SSL Certificate', 'The origin’s security certificate is not valid.',
        'It may be expired, self-signed, or issued for another name.', 'Cloudflare', 'unofficial'],
]

export const STATUS_CODES = ROWS.map(([code, name, summary, usage, source, flag = null]) => ({
    code,
    name,
    summary,
    usage,
    source,
    flag,
    // The first digit: 1 informational, 2 success, 3 redirection, 4 client error, 5 server error.
    family: Math.floor(code / 100),
}))

export const FAMILIES = [
    { value: 'all', label: 'All' },
    { value: '1', label: '1xx Info' },
    { value: '2', label: '2xx Success' },
    { value: '3', label: '3xx Redirect' },
    { value: '4', label: '4xx Client error' },
    { value: '5', label: '5xx Server error' },
    { value: 'unofficial', label: 'Unofficial' },
]

// Words for each family, so a search such as "redirect" or "client error" finds the whole family.
const FAMILY_WORDS = {
    1: 'informational information',
    2: 'success successful',
    3: 'redirect redirection',
    4: 'client error',
    5: 'server error',
}

// The name of each family, shown on every card in words so the colour is never the only clue.
export const FAMILY_NAMES = {
    1: 'Informational',
    2: 'Success',
    3: 'Redirection',
    4: 'Client error',
    5: 'Server error',
    unofficial: 'Unofficial',
}

export const FLAG_LABELS = { deprecated: 'Deprecated', reserved: 'Reserved', unofficial: 'Unofficial' }

// "RFC 9110 §15.5.5" -> a link to that section. Other sources have no link.
export function getSourceUrl(source) {
    const match = /^RFC (\d+)(?: §(.+))?$/.exec(source)
    if (!match) return null
    const [, number, section] = match
    return `https://www.rfc-editor.org/rfc/rfc${number}${section ? `#section-${section}` : ''}`
}

/*
 * Filters the list. Every word in the query must match, so "not found" and "404" both work.
 *  - "404", "40" and "4": codes that start with those digits
 *  - "4xx": every code in that family
 *  - anything else: the name, summary, usage text, or family words such as "redirect"
 * Codes whose name contains the whole phrase are listed first. The family filter is applied first.
 */
export function filterStatusCodes(query, family) {
    const pool = STATUS_CODES.filter((entry) => {
        if (family === 'all') return true
        if (family === 'unofficial') return entry.flag === 'unofficial'
        return entry.family === Number(family) && entry.flag !== 'unofficial'
    })

    const phrase = query.trim().toLowerCase()
    const tokens = phrase.split(/\s+/).filter(Boolean)
    if (tokens.length === 0) return pool

    const matches = pool.filter((entry) => {
        const text =
            `${entry.name} ${entry.summary} ${entry.usage} ${entry.source} ${FAMILY_WORDS[entry.family]}`.toLowerCase()
        return tokens.every((token) => {
            if (/^[1-5]xx$/.test(token)) return entry.family === Number(token[0])
            if (/^\d+$/.test(token)) return String(entry.code).startsWith(token)
            return text.includes(token)
        })
    })

    // A code whose name contains the whole phrase comes first ("not found" puts 404 on top).
    // The sort keeps the original order for entries that tie.
    const nameMatches = (entry) => entry.name.toLowerCase().includes(phrase)
    return [...matches].sort((a, b) => Number(nameMatches(b)) - Number(nameMatches(a)))
}