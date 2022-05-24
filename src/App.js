import { useLayoutEffect } from 'react'
import { RecoilRoot } from 'recoil'
import styled from 'styled-components'
import Modal from 'react-modal'

import Header from './components/header/Header'
import Workspace from './components/workspace/Workspace'

const App = ({ className }) => {
    useLayoutEffect(() => {
        Modal.setAppElement('#root')
    }, [])

    return (
        <RecoilRoot>
            <div className={className}>
                <Header />
                <Workspace />
            </div>
        </RecoilRoot>
    );
}

export default styled(App)`
    display: flex;
    flex-direction: column;
    height: 100vh;
`
