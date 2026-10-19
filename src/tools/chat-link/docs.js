const docs = {
    about:
        'Make a link that opens a WhatsApp or Telegram chat, with a message already typed in, and turn it into a QR code you can print or share. It is handy for contact buttons on a website, business cards, posters, and email signatures.',
    howItWorks: [
        'Choose WhatsApp or Telegram, then the link type: a chat by phone number, a chat by username, or (for Telegram) a shared web address.',
        'For a phone number, search or pick the country code (you can type a country name or a code such as +91) and type the local number as you would dial it at home. Choose “Other” to type the whole international number yourself.',
        'Add an optional message. For a username, enter it with or without the @.',
        'The link and its QR code update as you type. Copy the link, open it to test it, or download the QR code as PNG or SVG.',
        'Anyone who clicks the link or scans the code gets a chat with your message ready to send. They still have to press send.',
    ],
    example: {
        input: '+44 7700 900123 with the message “Hi! I have a question.”',
        output: 'https://wa.me/447700900123?text=Hi!%20I%20have%20a%20question.',
    },
    notes: [
        'WhatsApp links use the wa.me format. The country code you pick is put in front of your number, and the 0 that local numbers start with is removed (07700 900123 in the UK becomes 447700900123). In Italy, San Marino, and Vatican City that 0 is part of the number, so it is kept. If you type a number that starts with +, it is used as the whole number and the country list is ignored.',
        'WhatsApp usernames are new and are still being rolled out country by country. A username link is wa.me followed by the username. It may not open for people whose WhatsApp does not have usernames yet, and a ready-typed message may not be carried over for usernames. The username rules used here (3 to 30 letters, digits, underscores, or periods, with at least one letter) follow what has been published so far and may change.',
        'A WhatsApp link with a message but no number opens WhatsApp and lets the person pick who to send it to.',
        'Telegram links to a username (t.me/username) work for any public username, including short collectible ones. Links to a phone number only work when that person has Telegram and lets others find them by number.',
        'The message you add is typed into the chat box for the person. It is not sent automatically.',
        'Telegram’s “Share a link” type needs a web address. Telegram asks the person to choose a chat, then enters your address followed by your message.',
        'The message is limited to 1,000 characters so the QR code stays easy to scan. Line breaks and emoji are kept.',
        'A phone number or username inside a link or QR code can be read by anyone who has it. Only use contact details you are happy to make public.',
        'Test the link and scan the code with a real phone before you print or publish it.',
    ],
    privacy:
        'The link and QR code are made in your browser. The phone number, username, and message you type are not sent to a server, not saved by Devora, and not placed in the page address.',
}

export default docs