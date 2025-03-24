import { atomWithStorage } from 'jotai/utils'
import type ProjectModel from '../components/models/ProjectModel'

export type EditorHintState = {
    showComplementStrand: boolean
    showCodonNumbers: boolean
    showPeptides: boolean
    highlightCurrentCodon: boolean
}

export const editorHintState = atomWithStorage<EditorHintState>('editorHints', {
    showComplementStrand: true,
    showCodonNumbers: true,
    showPeptides: true,
    highlightCurrentCodon: true,
})

export type EditorRenderer = 'next'

export const editorRendererState = atomWithStorage<EditorRenderer>('preferredRenderer', 'next')
export const projectsState = atomWithStorage<Record<string, ProjectModel>>('projects', {})
export const activeProjectIdState = atomWithStorage<string | null>('activeProjectId', null)
