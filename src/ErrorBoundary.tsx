import React, { ErrorInfo } from "react"
import styled from "styled-components"

type Props = {
    className?: string,
    children?: React.ReactNode,
}

type State = {
    hasError: boolean,
    error?: Error,
}

class ErrorBoundary extends React.Component<Props, State> {
    public state: State = {
        hasError: false,
    }

    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // TODO: Log error somehow
    }

    render() {
        if (this.state.hasError) {
            return (
                <main className={this.props.className}>
                    <h1>Something went wrong.</h1>
                    <div style={{ textAlign: 'center' }}>
                        Please report this on GitHub:<br/>
                        <a href="https://github.com/plasmid-designer/plasmid-designer/issues" target="_blank" rel="noreferrer">Report Issue</a>
                    </div>
                    {this.state.error && (
                        <div className='error'>
                            <code>
                                <pre>{this.state.error.stack}</pre>
                            </code>
                        </div>
                    )}
                </main>
            )
        }

        return this.props.children;
    }
}

export default styled(ErrorBoundary)`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;

    & .error {
        code {
            width: 100%;
            display: block;
            background: hsl(0,0%,90%);
            padding: 1rem;
            white-space: pre-wrap;
            border-radius: .25rem;
        }
    }
`
