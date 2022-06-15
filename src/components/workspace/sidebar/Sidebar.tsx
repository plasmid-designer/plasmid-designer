import { FilePlus, Edit } from 'react-feather'
import { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import styled, { StyledProps } from 'styled-components'

import { activeProjectIdState } from '../../../state/atoms'
import { projectListSelector } from '../../../state/selectors'
import NewProjectModal from '../../modals/NewProjectModal'
import Toolbar from '../Toolbar'
import EditProjectModal from '../../modals/EditProjectModal'

type Props = {
    className?: string,
}

const Sidebar = ({ className }: Props) => {
    const projects = useRecoilValue(projectListSelector)
    const [activeProjectId, setActiveProjectId] = useRecoilState(activeProjectIdState)

    const [showNewProjectModal, setShowNewProjectModal] = useState(false)
    const [showEditProjectModal, setShowEditProjectModal] = useState(false)
    const [editProjectId, setEditProjectId] = useState(null)

    const openNewProjectModal = () => {
        setShowNewProjectModal(true)
    }

    const closeNewProjectModal = () => {
        setShowNewProjectModal(false)
    }

    const openEditProjectModal = (e, id) => {
        e.preventDefault()
        e.stopPropagation()

        setEditProjectId(id)
        setShowEditProjectModal(true)
    }

    const closeEditProjectModal = () => {
        setEditProjectId(null)
        setShowEditProjectModal(false)
    }

    return (
        <div className={className}>
            <NewProjectModal isOpen={showNewProjectModal} onClose={closeNewProjectModal} />
            <EditProjectModal isOpen={showEditProjectModal} onClose={closeEditProjectModal} projectId={editProjectId} />
            <Toolbar className="header">
                <div className="icon" onClick={openNewProjectModal}>
                    <FilePlus size={18} />
                </div>
            </Toolbar>
            <div className="project-list">
                {projects.map(project => (
                    <div
                        key={project.id}
                        onClick={() => setActiveProjectId(project.id)}
                        className={
                            [
                                'project',
                                project.id === activeProjectId && 'project--active'
                            ].filter(x => !!x).join(' ')
                        }
                    >
                        <div className="row">
                            <div className="name">{project.name}</div>
                            <div className="spacer" />
                            <div className="icon" onClick={e => openEditProjectModal(e, project.id)}>
                                <Edit size={16} />
                            </div>
                        </div>
                        <div className="row">
                            {project.updatedAt === null && (
                                <div className="project__created">Created {project.createdAt.toLocaleDateString()}</div>
                            )}
                            {project.updatedAt !== null && (
                                <div className="project__updated">Last modified {project.updatedAt.toLocaleDateString()}</div>
                            )}
                            <div className="spacer" />
                            <div className="project__bp_count">{project.basePairCount}bp</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default styled(Sidebar)`
    display: flex;
    flex-flow: column;
    width: 100%;
    user-select: none;

    & .icon {
        display: flex;
        align-items: center;
        padding: 0 .5rem;
        margin: 0 -.5rem;
        height: 100%;
        cursor: pointer;

        &:hover {
            color: hsl(0,0%,35%);
        }
    }

    & .header {
        padding: 0 calc(2.5rem / 4);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: .5rem;

    }

    & .project-list {
        padding: .25rem;
        display: flex;
        flex-flow: column;
        width: 100%;
        gap: .2rem;

        & .project {
            display: flex;
            flex-flow: column;
            justify-content: center;
            cursor: pointer;
            border-radius: .25rem;
            padding: .25rem .5rem;

            &:hover {
                background: hsl(0,0%,95%);
            }

            &--active {
                background: hsl(220, 10%, 90%) !important;
            }

            & .row {
                display: flex;
                align-items: center;
                gap: .5rem;

                &:last-child {
                    font-size: .75rem;
                    color: hsl(0,0%,50%);
                }

                & .spacer {
                    flex-grow: 1;
                }
            }
        }
    }
`
