import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { projectsState, activeProjectIdState } from './atoms'
import ProjectModel from '../components/models/ProjectModel'

export const projectListSelector = atom<ProjectModel[]>(
    get => {
        const state = get(projectsState)
        const models = Object.values(state)
            .map(jsonProject => ProjectModel.fromJSON(jsonProject as { $v: number }))
            .flatMap(model => model ? [model] : [])
        return models
    }
)

export const activeProjectSelector = atom(
    get => {
        const activeProjectId = get(activeProjectIdState)
        const projects = get(projectsState)
        return activeProjectId ? ProjectModel.fromJSON(projects[activeProjectId]) : null
    },
    (get, set, newValue: ProjectModel | null) => {
        const activeProjectId = newValue?.id
        if (!activeProjectId || !newValue.isValid) return
        newValue.updatedAt = new Date()
        set(projectsState, state => ({...state, [activeProjectId]: newValue}))
    }
)

export const projectSelector = atomFamily(
    (projectId: string) => atom(
        get => (
            get(projectListSelector).find(project => project.id === projectId) ?? null
        ),
        (get, set, newValue: ProjectModel | null) => {
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
    )
)
