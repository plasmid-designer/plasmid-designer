import { FolderPlus } from 'react-feather'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import styled from 'styled-components'

import { NewProjectModalIsOpenSelector } from '../../../state/selectors'
import { projectsState } from '../../../state/atoms'
import Toolbar from '../Toolbar'
import NewProjectModal from '../../modals/NewProjectModal'

const Sidebar = ({ className }) => {
    const projects = useRecoilValue(projectsState)

    const setNewProjectModalIsOpen = useSetRecoilState(NewProjectModalIsOpenSelector)

    const openNewProjectModal = () => {
        setNewProjectModalIsOpen(true)
    }

    return (
        <div className={className}>
            <NewProjectModal />
            <Toolbar className="header">
                <div className="icon" onClick={openNewProjectModal}>
                    <FolderPlus size={18} />
                </div>
            </Toolbar>
            <div className="project-list">
                {projects.map(project => (
                    <div className="project" key={project.id}>
                        {project?.name}
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

    & .header {
        padding: 0 calc(2.5rem / 4);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: .5rem;

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
    }

    & .project-list {
        padding: .25rem;
        display: flex;
        flex-flow: column;
        width: 100%;

        & .project {
            cursor: pointer;
            border-radius: .25rem;
            padding: .25rem .5rem;

            &:hover {
                background: hsl(0,0%,90%);
            }
        }
    }
`
