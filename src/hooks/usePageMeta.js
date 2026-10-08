import { useEffect } from 'react'
import { siteConfig } from '../data/site.js'

export default function usePageMeta({ title, description } = {}) {
    useEffect(() => {
        document.title = title
            ? `${title} | ${siteConfig.name}`
            : `${siteConfig.name} – ${siteConfig.tagline}`

        const meta = document.querySelector('meta[name="description"]')
        if (meta) meta.setAttribute('content', description ?? siteConfig.description)
    }, [title, description])
}