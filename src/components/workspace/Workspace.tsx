import styled from 'styled-components'
import { Allotment, setSashSize } from 'allotment'

import PlasmidViewer from '../yapv/PlasmidViewer'

import Editor from './editor/Editor'
import Sidebar from './sidebar/Sidebar'
import { Note, Tabs } from '@geist-ui/core'
import EditorToolbar from './editor/EditorToolbar'
import { useRecoilValue } from 'recoil'
import { openProjectsState } from 'state/atoms'
import { useState } from 'react'
import Bridge from 'Bridge'

setSashSize(20)

type Props = {
    className?: string,
}

const Workspace = ({ className }: Props) => {
    const [activeTab, setActiveTab] = useState('')
    const openProjects = useRecoilValue(openProjectsState)

    const handleTabChange = async (val: string) => {
        setActiveTab(val)
        await Bridge.Project.setCurrentProject(val)
    }

    return (
        <div className={className}>
            <Allotment proportionalLayout vertical={false}>
                <Allotment.Pane snap minSize={250} preferredSize={250}>
                    <Sidebar />
                </Allotment.Pane>
                <Allotment.Pane minSize={300}>
                    <div className="tabs">
                        <EditorToolbar />
                        <Tabs value={activeTab} onChange={handleTabChange}>
                            {openProjects.map(project => (
                                <Tabs.Item key={project.uuid} label={project.name} value={project.uuid} />
                            ))}
                        </Tabs>
                        {activeTab !== '' && (
                            <Editor projectId={activeTab} />
                        )}
                        <Note style={{ marginTop: 'auto' }}>
                            This is a <b>beta</b> version. Many features don&apos;t work.
                        </Note>
                    </div>
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

    & .tabs {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
`
