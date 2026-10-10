import {
    Palette,
    FileText,
    Image,
    Binary,
    ShieldCheck,
    QrCode,
    ScanLine,
    Hash,
    Type,
    KeyRound,
    Fingerprint,
    Braces,
    Wand2,
    Lock,
    ImageIcon,
} from 'lucide-react'

export const categories = [
    {
        id: 'encoders-decoders',
        name: 'Encoders & Decoders',
        description: 'Convert data between different representations.',
        icon: Braces,
    },
    {
        id: 'generators',
        name: 'Generators',
        description: 'Create gradients, codes, identifiers, and placeholder content.',
        icon: Wand2,
    },
    {
        id: 'security',
        name: 'Security & Hashing',
        description: 'Inspect tokens, hash data, and create strong passwords.',
        icon: Lock,
    },
    {
        id: 'images',
        name: 'Images',
        description: 'Work with image data in the browser.',
        icon: ImageIcon,
    },
    {
        id: 'text',
        name: 'Text',
        description: 'Transform and generate text.',
        icon: Type,
    },
]

/*
 * Single source of truth for every tool.
 * - `categories`: the first entry is the tool's primary category.
 * - `status`: 'live' once the tool is implemented, otherwise 'coming-soon'.
 * - `route`: stable, human-readable URL. Never put sensitive data in URLs.
 */
export const tools = [
    {
        id: 'gradient',
        name: 'CSS Gradient Generator',
        description: 'Build linear, radial, reflected, and diamond gradients and copy the CSS.',
        categories: ['generators'],
        route: '/gradient-generator',
        icon: Palette,
        keywords: ['css', 'gradient', 'linear', 'radial', 'reflected', 'diamond', 'color', 'background'],
        status: 'live',
        seo: {
            title: 'CSS Gradient Generator',
            description:
                'Create linear, radial, reflected, and diamond CSS gradients with a live preview and copy the code.',
        },
    },
    {
        id: 'base64',
        name: 'Base64 Encoder & Decoder',
        description: 'Encode and decode Base64 text.',
        categories: ['encoders-decoders', 'text'],
        route: '/base64',
        icon: FileText,
        keywords: ['base64', 'encode', 'decode', 'text', 'string'],
        status: 'coming-soon',
        seo: {
            title: 'Base64 Encoder & Decoder',
            description: 'Encode and decode Base64 text directly in your browser.',
        },
    },
    {
        id: 'base64-image',
        name: 'Base64 Image Converter',
        description: 'Convert images to Base64 and Base64 back to images.',
        categories: ['images', 'encoders-decoders'],
        route: '/base64-image',
        icon: Image,
        keywords: ['base64', 'image', 'data uri', 'encode', 'decode', 'png', 'jpg'],
        status: 'coming-soon',
        seo: {
            title: 'Base64 Image Encoder & Decoder',
            description: 'Convert images to Base64 data and decode Base64 back into images.',
        },
    },
    {
        id: 'binary',
        name: 'Binary ↔ Text Converter',
        description: 'Convert text to binary and binary back to text.',
        categories: ['encoders-decoders', 'text'],
        route: '/binary-text',
        icon: Binary,
        keywords: ['binary', 'text', 'convert', 'encode', 'decode', 'bits'],
        status: 'coming-soon',
        seo: {
            title: 'Binary to Text Converter',
            description: 'Convert text to binary and binary to text.',
        },
    },
    {
        id: 'jwt',
        name: 'JWT Decoder',
        description: 'Decode and inspect JSON Web Tokens.',
        categories: ['encoders-decoders', 'security'],
        route: '/jwt',
        icon: ShieldCheck,
        keywords: ['jwt', 'json web token', 'token', 'decode', 'header', 'payload'],
        status: 'coming-soon',
        seo: {
            title: 'JWT Decoder',
            description: 'Decode a JSON Web Token to inspect its header and payload.',
        },
    },
    {
        id: 'qr-generator',
        name: 'QR Code Generator',
        description: 'Turn text or a URL into a downloadable QR code.',
        categories: ['generators'],
        route: '/qr-generator',
        icon: QrCode,
        keywords: ['qr', 'qr code', 'generate', 'url', 'barcode'],
        status: 'coming-soon',
        seo: {
            title: 'QR Code Generator',
            description: 'Generate a QR code from text or a URL and download it.',
        },
    },
    {
        id: 'qr-decoder',
        name: 'QR Code Decoder',
        description: 'Read the contents of a QR code from an image.',
        categories: ['images'],
        route: '/qr-decoder',
        icon: ScanLine,
        keywords: ['qr', 'qr code', 'decode', 'scan', 'read', 'image'],
        status: 'coming-soon',
        seo: {
            title: 'QR Code Decoder',
            description: 'Upload an image of a QR code to read its contents.',
        },
    },
    {
        id: 'hash',
        name: 'Hash Generator',
        description: 'Generate SHA hashes and checksums for text.',
        categories: ['security'],
        route: '/hash',
        icon: Hash,
        keywords: ['hash', 'checksum', 'sha', 'sha256', 'digest'],
        status: 'coming-soon',
        seo: {
            title: 'Hash & Checksum Generator',
            description: 'Generate SHA-256, SHA-384, and SHA-512 hashes for text.',
        },
    },
    {
        id: 'lorem-ipsum',
        name: 'Lorem Ipsum Generator',
        description: 'Generate placeholder words, sentences, or paragraphs.',
        categories: ['generators', 'text'],
        route: '/lorem-ipsum',
        icon: Type,
        keywords: ['lorem', 'ipsum', 'placeholder', 'dummy', 'text', 'filler'],
        status: 'coming-soon',
        seo: {
            title: 'Lorem Ipsum Generator',
            description: 'Generate lorem ipsum words, sentences, and paragraphs.',
        },
    },
    {
        id: 'password',
        name: 'Password Generator',
        description: 'Create strong random passwords.',
        categories: ['generators', 'security'],
        route: '/password-generator',
        icon: KeyRound,
        keywords: ['password', 'random', 'secure', 'generate', 'strong'],
        status: 'coming-soon',
        seo: {
            title: 'Password Generator',
            description: 'Generate random passwords using your browser’s cryptographic random number generator.',
        },
    },
    {
        id: 'uuid',
        name: 'UUID Generator',
        description: 'Generate one or many random UUIDs.',
        categories: ['generators'],
        route: '/uuid',
        icon: Fingerprint,
        keywords: ['uuid', 'guid', 'identifier', 'id', 'random', 'v4'],
        status: 'coming-soon',
        seo: {
            title: 'UUID Generator',
            description: 'Generate random version 4 UUIDs in your browser.',
        },
    },
]

export const getToolById = (id) => tools.find((tool) => tool.id === id)

export const getToolsByCategory = (categoryId) =>
    tools.filter((tool) => tool.categories.includes(categoryId))