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

export const editorRendererState = atom({
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
