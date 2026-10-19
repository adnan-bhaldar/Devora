const docs = {
    about:
        'Make a link that opens a WhatsApp or Telegram chat, with a message already typed in, and turn it into a QR code you can print or share. It is handy for contact buttons on a website, business cards, posters, and email signatures.',
    howItWorks: [
        'Choose WhatsApp or Telegram. For Telegram, choose whether the link opens a chat by username, a chat by phone number, or shares a web address.',
        'Enter the phone number (with its country code) or the username, and an optional message.',
        'The link and its QR code update as you type. Copy the link, open it to test it, or download the QR code as PNG or SVG.',
        'Anyone who clicks the link or scans the code gets a chat with your message ready to send. They still have to press send.',
    ],
    example: {
        input: '+44 7700 900123 with the message “Hi! I have a question.”',
        output: 'https://wa.me/447700900123?text=Hi!%20I%20have%20a%20question.',
    },
    notes: [
        'WhatsApp links use the wa.me format. Write the phone number with the country code and no 0 or 00 in front of it: 44 7700 900123 for a UK number, not 0044 or 07700. Spaces, dashes, brackets, and a + sign you type are removed for you.',
        'A WhatsApp link with a message but no number opens WhatsApp and lets the person pick who to send it to.',
        'Telegram links to a username (t.me/username) work for any public username. Links to a phone number only work when that person has Telegram and lets others find them by number.',
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