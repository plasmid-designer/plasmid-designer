import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'

import Modal from './Modal'
import ModalButton from './ModalButton'
import { projectSelector } from '../../state/selectors'

type Props = {
    className?: string,
    isOpen: boolean,
    onClose: () => void,
    projectId: string,
}

const EditProjectModal = ({ className, isOpen, onClose, projectId }: Props) => {
    const [project, setProject] = useRecoilState(projectSelector(projectId))
    const [name, setName] = useState(project?.name ?? '')

    useEffect(() => {
        if (!projectId) return
        setName(project?.name ?? '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId])

    const handleClose = () => {
        onClose()
    }

    const handleUpdateProject = () => {
        const newProject = project?.updateImmutable({ name })
        if (newProject?.isValid) {
            setProject(newProject)
            handleClose()
        }
    }

    const handleDeleteProject = () => {
        setProject(null)
        handleClose()
    }

    if (projectId === null) return null

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={`Edit ${project?.name}`}
            footer={(
                <>
                    <ModalButton onClick={handleClose}>Cancel</ModalButton>
                    <div style={{ flexGrow: 1 }} />
                    <ModalButton $destructive onClick={handleDeleteProject}>Delete</ModalButton>
                    <ModalButton $primary onClick={handleUpdateProject}>Apply changes</ModalButton>
                </>
            )}
            contentClassName={className ?? ''}
        >
            <input type="text" placeholder="Project Title" value={name} onChange={e => setName(e.target.value)} />
        </Modal>
    )
}

export default styled(EditProjectModal)`
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
