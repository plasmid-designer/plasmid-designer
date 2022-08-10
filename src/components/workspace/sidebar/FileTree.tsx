import { ChevronDown, ChevronRight, File } from "@geist-ui/icons"
import Bridge from "Bridge"
import { useState } from "react"
import { useRecoilState } from "recoil"
import { openProjectsState } from "state/atoms"
import styled from "styled-components"

export type TFileNode = {
    type: 'directory' | 'file',
    name: string,
    path: string,
    extra?: string,
    files?: TFileNode[],
}

export type TFileTree = Array<TFileNode>

type NodeProps = {
    className?: string,
    node: TFileNode,
}

type Props = {
    className?: string,
    values: TFileTree,
}

const _Node = ({ className, node }: NodeProps) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [_openProjects, setOpenProjects] = useRecoilState(openProjectsState)
    const Icon = node.type === 'directory' ? isExpanded ? ChevronDown : ChevronRight : File

    const handleFileClick = async () => {
        const projects = await Bridge.Project.openFile(node.path)
        setOpenProjects(projects)
    }

    const handleDirectoryClick = () => {
        setIsExpanded(val => !val)
    }

    const handleNodeClick = () => {
        (node.type === 'directory' ? handleDirectoryClick : handleFileClick)()
    }

    return (
        <div className={className}>
            <div className="header" onClick={handleNodeClick}>
                <div className="icon"><Icon size={16} /></div>
                <div className="name">{node.name}</div>
                {node.extra && (
                    <div className="extra">{node.extra}</div>
                )}
            </div>
            {node.files && isExpanded && (
                <div className="content">
                    {node.files.map(node => (<Node key={node.name} node={node} />))}
                </div>
            )}
        </div>
    )
}

const Node = styled(_Node)`
    display: flex;
    flex-direction: column;

    & .header {
        display: flex;
        align-items: center;
        gap: .25rem;
        cursor: pointer;
        padding: .1rem .2rem;

        &:hover {
            background: hsl(0,0%,95%);
            border-radius: .25rem;
        }

        & .icon {
            display: flex;
            align-items: center;
            height: 100%;
        }

        & .extra {
            opacity: .5;
        }
    }

    & .content {
        border-left: 2px solid hsl(0,0%,75%);
        padding-left: .5rem;
        margin-left: .5rem;
        margin-bottom: .25rem;
    }
`

const FileTree = ({ className, values }: Props) => {
    return (
        <div className={className}>
            {values.map(node => (<Node key={node.name} node={node} />))}
        </div>
    )
}

export default styled(FileTree)`
    display: flex;
    flex-direction: column;
    user-select: none;
    font-size: 0.825rem;
`
