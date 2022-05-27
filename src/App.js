import React from 'react'
import { useLayoutEffect } from 'react'
import { RecoilRoot } from 'recoil'
import styled from 'styled-components'
import Modal from 'react-modal'

import Header from './components/header/Header'
import Workspace from './components/workspace/Workspace'

class ErrorBoundary extends React.Component {
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
                    <div>
                        Please report this on GitHub:<br/>
                        https://github.com/plasmid-designer/plasmid-designer/issues/new
                    </div>
                    <div className='error'>
                        <pre>{this.state.error.stack}</pre>
                    </div>
                </main>
            )
        }

        return this.props.children;
    }
}

const StyledErrorBoundary = styled(ErrorBoundary)`
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
`

const App = ({ className }) => {
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
