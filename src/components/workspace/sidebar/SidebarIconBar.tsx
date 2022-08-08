import styled from "styled-components"
import { Folder, Search } from '@geist-ui/icons'
import { useRecoilState, useSetRecoilState } from "recoil";
import { sidebarViewState } from "state/atoms";

type Props = {
    className?: string,
}

const ICON_SIZE = 24;

const SidebarIconBar = ({ className }: Props) => {
    const [sidebarView, setSidebarView] = useRecoilState(sidebarViewState)

    return (
        <div className={className}>
            <div className="icon" data-active={sidebarView === 'project'}>
                <Folder size={ICON_SIZE} onClick={() => setSidebarView('project')} />
            </div>
            <div className="icon" data-active={sidebarView === 'search'}>
                <Search size={ICON_SIZE} onClick={() => setSidebarView('search')} />
            </div>
        </div>
    )
}

export default styled(SidebarIconBar)`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: hsl(0,0%,95%);
    border-right: 1px solid hsl(0,0%,90%);
    padding: .75rem 0;
    min-width: calc(1.5rem + 24px);
    width: calc(1.5rem + 24px);
    height: 100%;

    & .icon {
        width: 100%;
        height: calc(24px + 0.75rem);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:first-child {
            margin-top: -.75rem;
        }

        &:hover {
            border-left: 3px solid hsl(0,0%,80%);

            & svg {
                margin-left: -3px;
            }
        }

        &[data-active=true] {
            border-left: 3px solid hsl(0,0%,50%);

            & svg {
                margin-left: -3px;
            }
        }

        & svg {
            stroke: hsl(0,0%,25%);
        }

        &:hover svg {
            stroke: hsl(0,0%,0%);
        }
    }
`
