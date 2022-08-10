import { Note } from "@geist-ui/core"
import React from "react"
import { useRecoilValue } from "recoil"
import { sidebarViewState, SIDEBAR_VIEW } from "state/atoms"
import styled from "styled-components"
import ProjectView from "./ProjectView"
import SidebarIconBar from "./SidebarIconBar"

type Props = {
    className?: string,
}

const UnimplementedView = () => {
    return (
        <div>
            <Note>Unimplemented</Note>
        </div>
    )
}

const SidebarViewLookup: Record<SIDEBAR_VIEW, React.FunctionComponent> = {
    'project': ProjectView,
    'search': UnimplementedView,
    'settings': UnimplementedView,
}

const Sidebar = ({ className }: Props) => {
    const sidebarView = useRecoilValue(sidebarViewState)
    const View = SidebarViewLookup[sidebarView]

    return (
        <div className={className}>
            <SidebarIconBar />
            <View />
        </div>
    )
}

export default styled(Sidebar)`
    display: flex;
    height: 100%;
    background: hsl(0,0%,99%);

    /* Sidebar Content View */
    & >:nth-child(2) {
        flex-grow: 1;
        padding: .5rem;
    }
`
