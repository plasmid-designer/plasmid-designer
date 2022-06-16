import React, { useState, useEffect, useCallback } from 'react'
import { useRecoilState } from 'recoil'

import Bridge from '../../Bridge'
import { activeProjectSelector } from '../../state/selectors'

import SequenceDataModel, { SequenceDataCursorModel, SequenceDataSelectionModel } from './SequenceDataModel'
import useSelection from './useSelection'

const iupacChars = "ACGTWSMKRYBVDHN-"

const findIndex = (currentTarget: HTMLElement) => {
    if (currentTarget.dataset.index) return parseInt(currentTarget.dataset.index)
    if (currentTarget.parentElement?.dataset.index) return parseInt(currentTarget.parentElement.dataset.index)
    return null
}

type useEditorReturnTypes = {
    isLoading: boolean,
    cursor: SequenceDataCursorModel,
    sequence: SequenceDataModel,
    selection: SequenceDataSelectionModel,
    handlers: {
        handleKeyDown: (e: React.KeyboardEvent) => void,
        handleMouseEvent: (e: React.MouseEvent) => void,
    }
}

const useEditor = (): useEditorReturnTypes => {
    const [isLoading, setIsLoading] = useState(false)
    const [sequenceModel, setSequenceModel] = useState(new SequenceDataModel())
    const [cursorModel, setCursorModel] = useState(new SequenceDataCursorModel())
    const [selectionModel, setSelectionModel] = useState(new SequenceDataSelectionModel())

    const [activeProject, setActiveProject] = useRecoilState(activeProjectSelector)

    const {
        isSelecting,
        selection,
        startSelection,
        updateSelection,
        endSelection,
    } = useSelection()

    useEffect(() => {
        const initialize = async () => {
            setIsLoading(true)
            await Bridge.Editor.initializeEditor(activeProject?.sequence ?? '')
            await updateSequence(true)
            setIsLoading(false)
        }
        initialize()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeProject?.id])

    useEffect(() => {
        if (!activeProject?.id) return
        setActiveProject(project => project?.updateImmutable({ sequence: sequenceModel.nucleotideString }) ?? null)
    }, [activeProject?.id, setActiveProject, sequenceModel])

    useEffect(() => {
        const updateBackendSelection = async () => {
            if (selection.start === 0 && selection.end === 0) {
                return
            } else if (selection.start === selection.end) {
                await Bridge.Editor.resetSelection()
            } else {
                await Bridge.Editor.setSelection(selection.start, selection.end)
            }
            await updateSequence()
        }
        updateBackendSelection()
    }, [selection])

    /**
     * @param {KeyboardEvent} e
     */
    const handleKeyDown = useCallback(async (e: React.KeyboardEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const upperKey = e.key.toUpperCase()
        const ctrl = e.ctrlKey
        const shift = e.shiftKey

        switch (e.code) {
            case 'Backspace':
                await Bridge.Editor.delete()
                break
            case 'Delete':
                await Bridge.Editor.deleteNext()
                break
            case 'ArrowLeft':
                if (ctrl) await Bridge.Editor.moveCursorToCodonStart()
                else if (shift) await Bridge.Editor.expandSelectionLeft()
                else await Bridge.Editor.moveCursorLeft()
                break
            case 'ArrowRight':
                if (ctrl) await Bridge.Editor.moveCursorToCodonEnd()
                else if (shift) await Bridge.Editor.expandSelectionRight()
                else await Bridge.Editor.moveCursorRight()
                break
            default:
                if (ctrl) {
                    let should_return = true
                    switch (upperKey) {
                        case 'C':
                            await navigator.clipboard.writeText(await Bridge.Editor.getSelectedSequence())
                            break
                        case 'V':
                            await (async () => {
                                const text = await navigator.clipboard.readText()
                                await Bridge.Editor.insertAll(text)
                            })()
                            break
                        case 'A':
                            await Bridge.Editor.selectAll()
                            break
                        case 'X':
                            await navigator.clipboard.writeText(await Bridge.Editor.getSelectedSequence())
                            await Bridge.Editor.delete()
                            break
                        case 'Z':
                            await Bridge.Editor.undo()
                            break
                        case 'Y':
                            await Bridge.Editor.redo()
                            break
                        default:
                            should_return = false
                            break
                    }
                    if (should_return) return true
                }
                if (iupacChars.includes(upperKey)) {
                    await Bridge.Editor.insert(upperKey)
                }
                return true
        }

        return true
    }, [])

    const handleMouseEvent = useCallback(async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()

        const index = findIndex(e.target as HTMLElement)

        switch (e.type) {
            case 'mousedown':
                if (index !== null) {
                    startSelection(index)
                    await Bridge.Editor.moveCursorTo(index)
                } else {
                    await Bridge.Editor.moveCursorToEnd()
                }
                return true
            case 'mousemove':
                if (isSelecting && index !== null) {
                    updateSelection(index)
                }
                return false
            case 'mouseup':
                endSelection(index ?? selection.end)
                return false
            default:
                return false
        }
    }, [isSelecting, startSelection, updateSelection, endSelection, selection])

    const updateSequence = async (force = false) => {
        const data = await Bridge.Editor.calculateSequenceData(force)
        if (data.sequence) {
            setSequenceModel(new SequenceDataModel(data))
        }
        setCursorModel(new SequenceDataCursorModel(data?.cursor))
        setSelectionModel(new SequenceDataSelectionModel(data?.selection))
    }

    type RelayAsyncFn<T, R> = (...data: T[]) => Promise<R>
    const wrapUpdatingAsync = <T>(fn: RelayAsyncFn<T, boolean>) => async (...data: T[]) => {
        if (await fn(...data)) {
            await updateSequence()
        }
    }

    return {
        isLoading,
        cursor: cursorModel,
        sequence: sequenceModel,
        selection: selectionModel,
        handlers: {
            handleKeyDown: wrapUpdatingAsync(handleKeyDown),
            handleMouseEvent: wrapUpdatingAsync(handleMouseEvent),
        },
    }
}

export default useEditor
