const docs = {
    about:
        'Generate a random password of the length you choose, using the character types you pick. Passwords are made in your browser and are never sent anywhere.',
    howItWorks: [
        'Choose a length and which types of characters to include: lowercase, uppercase, numbers, and symbols.',
        'Each character is picked at random using your browser’s cryptographic random number generator (crypto.getRandomValues), the same source used for security features. It is not the ordinary Math.random.',
        'The choice is made so that every possible character is equally likely, and every type you selected is guaranteed to appear at least once.',
        'Copy the password into a password manager or the account you are setting up.',
    ],
    notes: [
        'The strength shown is an estimate of how many guesses it would take: the length multiplied by the number of bits each character adds. It assumes the password is random and unique. It says nothing about a password being reused, phished, or leaked.',
        'Use a different password for every account, and keep them in a password manager. A strong password that is reused is only as safe as the weakest site that stores it.',
        '“Avoid look-alike characters” removes l, 1, I, O, 0, and o. This makes passwords easier to read and type, and slightly smaller to guess, so add a few characters if you turn it on.',
        'Copying a password leaves it on your clipboard until you copy something else. Clipboard history tools may also keep it.',
        'The shortest password you can make is 4 characters and the longest is 128. Very short passwords are weak even when they are random.',
        'Symbols are limited to ones that are accepted almost everywhere. Some websites restrict which symbols or how long a password may be, so you may need to adjust.',
    ],
    privacy:
        'Passwords are generated in your browser with the Web Crypto random number generator. They are not sent to a server, not saved or logged by Devora, and never placed in the page address. The password disappears when you clear it or leave the page.',
}

export default docs