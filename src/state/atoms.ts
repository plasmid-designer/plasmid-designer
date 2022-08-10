import { ProjectInfo } from 'Bridge'
import { atom } from 'recoil'
import ProjectModel from '../components/models/ProjectModel'
import { persistLocalEffect } from './persist'

export const editorHintState = atom({
    key: 'editorHintState',
    default: {
        showComplementStrand: true,
        showCodonNumbers: true,
        showPeptides: true,
        highlightCurrentCodon: true,
    },
    effects: [persistLocalEffect('editorHints')],
})

export const editorRendererState = atom<string>({
    key: 'editorRendererState',
    default: 'next',
    effects: [persistLocalEffect('preferredRenderer')],
})

export const projectsState = atom<Record<string, ProjectModel>>({
    key: 'projectsState',
    default: {},
    effects: [persistLocalEffect('projects')],
})

export const activeProjectIdState = atom<string | null>({
    key: 'activeProjectIdState',
    default: null,
    effects: [persistLocalEffect('activeProjectId')],
})

export type SIDEBAR_VIEW = 'project' | 'search'

export const sidebarViewState = atom<SIDEBAR_VIEW>({
    key: 'sidebarViewState',
    default: 'project',
})

export type TFileNode = {
    name: string,
    path: string,
    type: 'directory' | 'file',
    files?: TFileNode[],
}

export type TFileTree = TFileNode[]

export const currentProjectTreeState = atom<TFileTree | null>({
    key: 'currentProjectTreeState',
    default: null,
})

export const openProjectsState = atom<Array<ProjectInfo>>({
    key: 'openProjectsState',
    default: [],
})
