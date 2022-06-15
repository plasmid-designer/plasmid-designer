import React from 'react'
import { useLayoutEffect } from 'react'
import { RecoilRoot } from 'recoil'
import styled from 'styled-components'
import Modal from 'react-modal'

import Header from './components/header/Header'
import Workspace from './components/workspace/Workspace'

type ErrorState = {
    hasError: boolean,
    error?: any,
}

class ErrorBoundary extends React.Component<any, ErrorState> {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    // eslint-disable-next-line no-unused-vars
    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    // eslint-disable-next-line no-unused-vars
    componentDidCatch(error, errorInfo) {
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
                    <div className='error'>
                        <code>
                            <pre>{this.state.error.stack}</pre>
                        </code>
                    </div>
                </main>
            )
        }

        return this.props.children;
    }
}

const StyledErrorBoundary = styled(ErrorBoundary)`
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

type Props = {
    className?: string,
}

const App = ({ className }: Props) => {
    useLayoutEffect(() => {
        Modal.setAppElement('#root')
    }, [])

    return (
        <StyledErrorBoundary>
            <RecoilRoot>
                <div className={className}>
                    <Header />
                    <Workspace />
                </div>
            </RecoilRoot>
        </StyledErrorBoundary>
    );
}

export default styled(App)`
    display: flex;
    flex-direction: column;
    height: 100vh;
`
