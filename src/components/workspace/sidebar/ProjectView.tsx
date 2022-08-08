import { Button, Tree } from "@geist-ui/core"
import styled from "styled-components"
import { open } from '@tauri-apps/api/dialog'
import { fs } from "@tauri-apps/api"
import { currentProjectTreeState, TFileNode, TFileTree } from "state/atoms"
import { useRecoilState, useRecoilValue } from "recoil"
import { currentProjectFileTree } from "state/selectors"

type Props = {
    className?: string,
}

const ProjectView = ({ className }: Props) => {
    const [fileTree, setFileTree] = useRecoilState(currentProjectTreeState)
    const geistFileTree = useRecoilValue(currentProjectFileTree)

    const openFolder = async () => {
        const folder = await open({
            multiple: false,
            directory: true,
        }) as string

        const files = await fs.readDir(folder, {
            recursive: true,
        })

        const buildTree = (entries: fs.FileEntry[]) => {
            const tree: TFileTree = []
            for (const entry of entries) {
                if (entry.name?.startsWith('.')) continue
                const node: TFileNode = {
                    name: entry.name ?? '',
                    path: entry.path ?? '',
                    type: entry.children ? 'directory' : 'file',
                }
                if (entry.children) {
                    node.files = buildTree(entry.children)
                }
                tree.push(node)
            }
            return tree.sort((a, b) => {
                if (a.type === 'directory' && b.type !== 'directory') {
                    return -1
                } else {
                    return a.name.localeCompare(b.name) ?? 0
                }
            })
        }

        setFileTree(buildTree(files))
    }

    return (
        <div className={className}>
            {fileTree === null && (
                <Button type='default' width='100%' height={0.75} onClick={openFolder}>Open folder</Button>
            )}
            {fileTree && (
                <Tree value={structuredClone(geistFileTree)} />
            )}
        </div>
    )
}

export default styled(ProjectView)`
    width: 100%;
    height: 100%;
`
