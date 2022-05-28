import { selector, selectorFamily } from 'recoil'
import ProjectModel from '../components/models/ProjectModel'
import { projectsState, activeProjectIdState } from './atoms'

export const projectListSelector = selector({
    key: 'projectListSelector',
    get: ({ get }) => {
        return Object.values(get(projectsState)).map(jsonProject => ProjectModel.fromJSON(jsonProject))
    }
})

export const activeProjectSelector = selector({
    key: 'activeProjectSelector',
    get: ({ get }) => {
        const activeProjectId = get(activeProjectIdState)
        const projects = get(projectsState)
        return activeProjectId ? ProjectModel.fromJSON(projects[activeProjectId]) : null
    },
    set: ({ set }, newValue) => {
        const activeProjectId = newValue?.id
        if (!activeProjectId || !newValue.isValid) return
        newValue.updatedAt = new Date()
        set(projectsState, state => ({...state, [activeProjectId]: newValue}))
    }
})

export const projectSelector = selectorFamily({
    key: 'projectSelector',
    get: projectId => ({ get }) => {
        return get(projectListSelector).find(project => project.id === projectId)
    },
    set: projectId => ({ set }, newValue) => {
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
