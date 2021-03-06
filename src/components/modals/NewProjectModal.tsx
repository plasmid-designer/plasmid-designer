import { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import styled from 'styled-components'

import Modal from './Modal'
import ModalButton from './ModalButton'
import { activeProjectIdState, projectsState } from '../../state/atoms'
import ProjectModel from '../models/ProjectModel'

type Props = {
    className?: string,
    isOpen: boolean,
    onClose: () => void,
}

const NewProjectModal = ({ className, isOpen, onClose }: Props) => {
    const setProjects = useSetRecoilState(projectsState)
    const setActiveProjectId = useSetRecoilState(activeProjectIdState)

    const [name, setName] = useState('')

    const reset = () => {
        setName('')
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    const handleCreateProject = () => {
        const project = new ProjectModel({ name })
        if (project.isValid) {
            setProjects(projects => ({...projects, [project.id]: project}))
            setActiveProjectId(project.id)
            handleClose()
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create a new Project"
            footer={(
                <>
                    <ModalButton onClick={handleClose}>Cancel</ModalButton>
                    <div style={{ flexGrow: 1 }} />
                    <ModalButton $primary onClick={handleCreateProject}>Create Project</ModalButton>
                </>
            )}
            contentClassName={className}
        >
            <input type="text" placeholder="Project Title" value={name} onChange={e => setName(e.target.value)} />
        </Modal>
    )
}

export default styled(NewProjectModal)`
    display: flex;
    justify-content: center;

    & input {
        appearance: none;
        outline: none;
        border: 1px solid hsl(0,0%,50%);
        border-radius: .25rem;
        height: 2.5rem;
        padding: .25rem .5rem;
        flex-grow: 1;

        &:focus {
            outline: 1px solid hsl(0,0%,50%);
        }
    }
`
