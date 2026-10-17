const repoUrl = 'https://github.com/adnan-bhaldar/Devora'

export const siteConfig = {
    name: 'Devora',
    tagline: 'Developer tools in your browser',
    description:
        'Devora is a collection of fast, focused developer utilities you can use directly in your browser.',
    repo: {
        url: repoUrl,
        issues: `${repoUrl}/issues`,
        newIssue: `${repoUrl}/issues/new/choose`,
        contributing: `${repoUrl}/blob/main/CONTRIBUTING.md`,
        changelog: `${repoUrl}/blob/main/CHANGELOG.md`,
    },
    // Shown on the About page. Edit these to change the developer card.
    author: {
        name: 'Adnan Bhaldar',
        role: 'Creator & maintainer',
        bio: 'A solo developer building small, fast, privacy-friendly tools. Devora is built and maintained in the open, one tool at a time.',
        github: 'https://github.com/adnan-bhaldar',
        githubHandle: 'adnan-bhaldar',
    },
}