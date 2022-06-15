import { selector, selectorFamily } from 'recoil'

import { projectsState, activeProjectIdState } from './atoms'
import ProjectModel from '../components/models/ProjectModel'

export const projectListSelector = selector({
    key: 'projectListSelector',
    get: ({ get }) => {
        return Object.values(get(projectsState)).map(jsonProject => ProjectModel.fromJSON(jsonProject as { $v: number }))
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
        return get(projectListSelector).find(project => project.id === projectId)
    },
    set: (projectId: string) => ({ set }, newValue: ProjectModel) => {
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
