import { useLayoutEffect } from 'react'
import { Provider as JotaiProvider } from 'jotai'
import styled from 'styled-components'
import Modal from 'react-modal'

import Header from './components/header/Header'
import Workspace from './components/workspace/Workspace'
import ErrorBoundary from './ErrorBoundary'

type Props = {
    className?: string,
}

const App = ({ className }: Props) => {
    useLayoutEffect(() => {
        Modal.setAppElement('#root')
    }, [])

    return (
        <ErrorBoundary>
            <JotaiProvider>
                <div className={className}>
                    <Header />
                    <Workspace />
                </div>
            </JotaiProvider>
        </ErrorBoundary>
    );
}

export default styled(App)`
    display: flex;
    flex-direction: column;
    height: 100vh;
`
