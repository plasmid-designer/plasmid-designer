import { selector, selectorFamily } from 'recoil'

import { projectsState, activeProjectIdState, currentProjectTreeState } from './atoms'
import ProjectModel from '../components/models/ProjectModel'
import { TFileNode, TFileTree } from 'components/workspace/sidebar/FileTree'

export const projectListSelector = selector<ProjectModel[]>({
    key: 'projectListSelector',
    get: ({ get }) => {
        const state = get(projectsState)
        const models = Object.values(state)
            .map(jsonProject => ProjectModel.fromJSON(jsonProject as { $v: number }))
            .filter(Boolean)
        return models as ProjectModel[]
    }
})

export const activeProjectSelector = selector({
    key: 'activeProjectSelector',
    get: ({ get }) => {
        const activeProjectId = get(activeProjectIdState)
        const projects = get(projectsState)
        return activeProjectId ? ProjectModel.fromJSON(projects[activeProjectId]) : null
    },
    set: ({ set }, newValue: ProjectModel) => {
        const activeProjectId = newValue?.id
        if (!activeProjectId || !newValue.isValid) return
        newValue.updatedAt = new Date()
        set(projectsState, state => ({...state, [activeProjectId]: newValue}))
    }
})

export const projectSelector = selectorFamily({
    key: 'projectSelector',
    get: (projectId: string) => ({ get }) => {
        return get(projectListSelector).find(project => project.id === projectId) ?? null
    },
    set: (projectId: string) => ({ set }, newValue: ProjectModel | null) => {
        if (newValue === null) {
            set(projectsState, state => {
                const copy = window.structuredClone(state)
                delete copy[projectId]
                return copy
            })
            return
        }
        newValue.updatedAt = new Date()
        set(projectsState, state => ({...state, [projectId]: newValue}))
    }
})

export const currentProjectFileTree = selector<TFileTree>({
    key: 'currentProjectFileTreeSelector',
    get: ({ get }) => {
        const tree = get(currentProjectTreeState)
        if (tree === null) {
            return []
        }
        const transformTree = (nodes: TFileNode[]): TFileTree => {
            const tree: TFileNode[] = []
            for (const node of nodes) {
                const treeFile: TFileNode = {
                    name: node.name,
                    path: node.path,
                    type: node.type,
                }
                if (node.files) {
                    const files = transformTree(node.files)
                    treeFile.files = files
                    treeFile.extra = `${files.length} ${files.length === 1 ? 'file' : 'files'}`
                }
                tree.push(treeFile)
            }
            return tree
        }
        return transformTree(tree)
    }
})
