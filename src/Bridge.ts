import { invoke as tauriInvoke, InvokeArgs } from '@tauri-apps/api/tauri'

import { SequenceData, ProjectInfo } from './bindings'

const invoke = <T>(cmd: string, args?: InvokeArgs | undefined) => tauriInvoke(cmd, args) as Promise<T>

class EditorBridge {
    static calculateSequenceData = (force: boolean) => invoke<SequenceData>('calculate_sequence_data', { force })
    static insert = (letter: string) => invoke('sequence_insert', { letter })
    static insertAll = (text: string) => invoke('sequence_insert_all', { text })
    static delete = () => invoke('sequence_delete')
    static deleteNext = () => invoke('sequence_delete_next')
    static moveCursorTo = (index: number) => invoke('move_cursor', { index })
    static moveCursorLeft = () => invoke('move_cursor_left')
    static moveCursorRight = () => invoke('move_cursor_right')
    static moveCursorToCodonStart = () => invoke('move_cursor_to_codon_start')
    static moveCursorToCodonEnd = () => invoke('move_cursor_to_codon_end')
    static moveCursorToStart = () => invoke('move_cursor_to_start')
    static moveCursorToEnd = () => invoke('move_cursor_to_end')
    static setSelection = (start: number, end: number) => invoke('set_selection', { start, end })
    static selectAll = () => invoke('set_selection_all')
    static resetSelection = () => invoke('reset_selection')
    static expandSelectionLeft = () => invoke('expand_selection_left')
    static expandSelectionRight = () => invoke('expand_selection_right')
    static getSelectedSequence = (): Promise<string> => invoke('get_selected_sequence')
    static undo = () => invoke('undo')
    static redo = () => invoke('redo')
    static initializeEditor = (sequence: string) => invoke('initialize_editor', { sequence })
}

class ProjectBridge {
    static openFile = (path: string): Promise<Array<ProjectInfo>> => invoke('project_open_file', { path })
    static setCurrentProject = (id: string) => invoke('project_set_current', { id })
}

class Bridge {
    static Editor = EditorBridge
    static Project = ProjectBridge
}

export default Bridge
