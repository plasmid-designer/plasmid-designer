import styled from 'styled-components'
import { useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { v4 as uuid } from 'uuid'

import { NewProjectModalIsOpenSelector } from '../../state/selectors'

import Modal from './Modal'
import ModalButton from './ModalButton'
import { projectsState } from '../../state/atoms'

const NewProjectModal = ({ className }) => {
    const setProjects = useSetRecoilState(projectsState)
    const [isOpen, setIsOpen] = useRecoilState(NewProjectModalIsOpenSelector)

    const [id, setId] = useState(uuid())
    const [name, setName] = useState('')

    const reset = () => {
        setId(uuid())
        setName('')
    }

    const handleClose = () => {
        setIsOpen(false)
        reset()
    }

    const handleCreateProject = () => {
        const project = {
            id,
            name,
            sequence: [],
        }
        setProjects(projects => ([...projects, project]))
        handleClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create a new Project"
            footer={(
                <>
                    <ModalButton onClick={handleClose}>Cancel</ModalButton>
                    <ModalButton ok onClick={handleCreateProject}>Create Project</ModalButton>
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
