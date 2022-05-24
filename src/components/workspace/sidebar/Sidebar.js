import styled from 'styled-components'
import { FolderPlus } from 'react-feather'
import { useRecoilValue } from 'recoil'

import Toolbar from '../Toolbar'
import { projectsState } from '../../../state/atoms'

const Sidebar = ({ className }) => {
    const projects = useRecoilValue(projectsState)

    const createNewFile = () => {
    }

    return (
        <div className={className}>
            <Toolbar className="header">
                <div className="icon" onClick={createNewFile}>
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
        display: flex;
        flex-flow: column;
        width: 100%;
    }
`
