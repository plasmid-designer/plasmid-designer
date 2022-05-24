import styled from 'styled-components'
import { Allotment, setSashSize } from 'allotment'

import PlasmidViewer from '../yapv/PlasmidViewer'

import Editor from './Editor'
import Sidebar from './Sidebar'

setSashSize(20)

const Workspace = ({className}) => {
    return (
        <div className={className}>
            <Allotment proportionalLayout vertical={false}>
                <Allotment.Pane minSize={250} preferredSize={250} maxSize={250}>
                    <Sidebar />
                </Allotment.Pane>
                <Allotment.Pane minSize={300}>
                    <Editor />
                </Allotment.Pane>
                <Allotment.Pane snap preferredSize={350} maxSize={500}>
                    <PlasmidViewer />
                </Allotment.Pane>
            </Allotment>
        </div>
    )
}

export default styled(Workspace)`
    display: flex;
    height: 100%;
    width: 100%;
    overflow: hidden;

    & > * {
        width: 100%;
    }
`
