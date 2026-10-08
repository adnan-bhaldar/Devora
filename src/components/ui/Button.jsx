import { Link } from 'react-router-dom'

const VARIANTS = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
}

export default function Button({ to, variant = 'secondary', className = '', children, ...props }) {
    const classes = `btn ${VARIANTS[variant]} ${className}`.trim()

    if (to) {
        return (
            <Link to={to} className={classes} {...props}>
                {children}
            </Link>
        )
    }

    return (
        <button type="button" className={classes} {...props}>
            {children}
        </button>
    )
}