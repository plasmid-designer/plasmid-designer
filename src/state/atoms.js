import { atom } from 'recoil'
import { persistLocalEffect } from './persist'

export const sequenceState = atom({
    key: 'sequenceState',
    default: [],
})

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

export const projectsState = atom({
    key: 'projectsState',
    default: [],
    effects: [persistLocalEffect('projects')],
})
