import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/*
 * Returns the settings that were in the address when the page opened, then removes them from
 * the address bar (the "load, then clean" behavior). The value is captured once, so cleaning
 * the address does not change it, and later edits never rewrite the address.
 */
export default function useInitialParams() {
    const location = useLocation()
    const navigate = useNavigate()
    const [params] = useState(() => new URLSearchParams(location.search))

    useEffect(() => {
        if (location.search) navigate(location.pathname, { replace: true })
    }, [location.pathname, location.search, navigate])

    return params
}