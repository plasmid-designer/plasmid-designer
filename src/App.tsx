import React from 'react'
import { useLayoutEffect } from 'react'
import { RecoilRoot } from 'recoil'
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
            <RecoilRoot>
                <div className={className}>
                    <Header />
                    <Workspace />
                </div>
            </RecoilRoot>
        </ErrorBoundary>
    );
}

export default styled(App)`
    display: flex;
    flex-direction: column;
    height: 100vh;
`
