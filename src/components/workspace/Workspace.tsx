import styled from 'styled-components'
import { Allotment, setSashSize } from 'allotment'

import PlasmidViewer from '../yapv/PlasmidViewer'

import Editor from './editor/Editor'
import Sidebar from './sidebar/Sidebar'
import { Tabs, useTabs } from '@geist-ui/core'
import EditorToolbar from './editor/EditorToolbar'
import { useRecoilValue } from 'recoil'
import { openProjectsState } from 'state/atoms'

setSashSize(20)

type Props = {
    className?: string,
}

const Workspace = ({ className }: Props) => {
    const { setState, bindings } = useTabs('')
    const openProjects = useRecoilValue(openProjectsState)

    return (
        <div className={className}>
            <Allotment proportionalLayout vertical={false}>
                <Allotment.Pane snap minSize={250} preferredSize={250}>
                    <Sidebar />
                </Allotment.Pane>
                <Allotment.Pane minSize={300}>
                    <EditorToolbar />
                    <Tabs {...bindings} hideDivider>
                        {openProjects.map(project => (
                            <Tabs.Item key={project.uuid} label={project.name} value={project.uuid}>
                                <Editor projectId={project.uuid} />
                            </Tabs.Item>
                        ))}
                    </Tabs>
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
