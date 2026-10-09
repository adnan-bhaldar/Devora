import { useContext } from 'react'
import { ToolPrefsContext } from '../context/toolPrefsContext.js'

export default function useToolPrefs() {
    const context = useContext(ToolPrefsContext)
    if (!context) throw new Error('useToolPrefs must be used inside <ToolPrefsProvider>')
    return context
}