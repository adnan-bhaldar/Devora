const docs = {
    about:
        'A searchable reference of HTTP status codes: the three-digit numbers a server sends to say how a request went, such as 200 OK or 404 Not Found.',
    howItWorks: [
        'The first digit is the family: 1xx means information, 2xx success, 3xx redirection, 4xx a mistake by the client, and 5xx a failure on the server.',
        'Search by number (404, or just 40 or 4), by family (4xx), or by word (redirect, timeout, rate limit). Every word you type must match.',
        'Use the filter to show only one family, or the codes that are not part of the standard.',
        'Each card shows the code, its family, and a short meaning. Open “Details” on a card to see when the code is used and where it is defined. The “Defined in” links open the official specification.',
    ],
    notes: [
        'The standard codes come from RFC 9110 and the other RFCs shown beside each code. Codes marked Deprecated should not be used in new work, and codes marked Reserved are not meant for general use.',
        'The Unofficial group lists a few codes from nginx, Cloudflare, and Laravel that you may meet in real projects. They are not part of the HTTP standard.',
        'Choose the most specific code that is correct. For example, use 401 when someone is not logged in, 403 when they are logged in but not allowed, and 404 when the resource does not exist.',
        'Redirects differ in whether the method is kept: 301 and 302 may turn a POST into a GET, while 307 and 308 never do.',
        'This page is a general reference. Servers and frameworks sometimes use a code in their own way, so check the documentation of the service you are working with.',
    ],
    privacy:
        'This tool only shows built-in information and works completely offline. Nothing you type in the search box is sent anywhere or saved.',
}

export default docs