import { Star } from 'lucide-react'
import Button from '../ui/Button.jsx'
import useToolPrefs from '../../hooks/useToolPrefs.js'

// variant "icon" is the compact star on cards; "button" is the labelled one on tool pages.
export default function FavoriteButton({ toolId, toolName, variant = 'icon' }) {
    const { isFavorite, toggleFavorite } = useToolPrefs()
    const active = isFavorite(toolId)
    const star = <Star className="fav-star" size={16} fill={active ? 'currentColor' : 'none'} aria-hidden="true" />

    if (variant === 'button') {
        return (
            <Button onClick={() => toggleFavorite(toolId)} aria-pressed={active}>
                {star}
                {active ? 'Favorited' : 'Favorite'}
            </Button>
        )
    }

    return (
        <button
            type="button"
            className="fav-btn"
            onClick={() => toggleFavorite(toolId)}
            aria-pressed={active}
            aria-label={`Favorite ${toolName}`}
            title={active ? 'Remove from favorites' : 'Add to favorites'}
        >
            {star}
        </button>
    )
}