const docs = {
    about:
        'Decode a JSON Web Token (JWT) to read its header, its payload (the claims), and its signature. JWTs are used to carry information such as who a user is and when a login expires.',
    howItWorks: [
        'A JWT has three parts separated by dots: header.payload.signature.',
        'The header and payload are JSON that has been encoded as Base64URL, a URL-safe form of Base64. Devora reverses that encoding and shows the JSON.',
        'The signature is a value created with a secret or private key. A server uses it to check that the header and payload have not been changed.',
        'Devora also reads standard claims such as exp (expiry), nbf (not valid before), and iat (issued at) and shows them as dates.',
    ],
    example: {
        input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 (the header part of a token)',
        output: '{\n  "alg": "HS256",\n  "typ": "JWT"\n}',
    },
    notes: [
        'Decoding is not verifying. Anyone can create a JWT with any contents, so decoded claims prove nothing on their own. Only a server that checks the signature with the right key can trust a token.',
        'Devora does not verify signatures. Do not use it to decide whether a token is valid.',
        'The expiry status compares the token’s own exp, nbf, and iat claims with your device’s clock. A token that is not expired is not necessarily valid, and the claims themselves could be false.',
        'The payload of a standard JWT can be read by anyone who has the token. Do not put secrets in it.',
        'A token with "alg": "none", or with an empty signature, has no signature at all and can be created by anyone.',
        'Encrypted tokens (JWE, which have five parts) cannot be read without the key and are not supported.',
        'Very large numbers in the JSON may lose precision when they are displayed.',
    ],
    privacy:
        'The token is decoded in your browser using built-in browser functions. It is not sent to a server, not saved by Devora, and not placed in the page address. Real tokens can still give access to an account until they expire, so prefer example or expired tokens when you can.',
}

export default docs