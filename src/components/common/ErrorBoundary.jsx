import { Component } from 'react'

export default class ErrorBoundary extends Component {
    state = { hasError: false }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error, info) {
        console.error('Devora caught an unexpected error:', error, info.componentStack)
    }

    render() {
        if (!this.state.hasError) return this.props.children

        // Plain <a> and <button> on purpose: the router itself may be what failed.
        return (
            <main className="container-page flex min-h-screen items-center justify-center py-16">
                <div role="alert" className="max-w-md text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
                    <p className="mt-3 text-fg-muted">
                        An unexpected error occurred. Reloading the page usually fixes it.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
                            Reload page
                        </button>
                        <a href="/" className="btn btn-secondary">
                            Back to Devora
                        </a>
                    </div>
                </div>
            </main>
        )
    }
}