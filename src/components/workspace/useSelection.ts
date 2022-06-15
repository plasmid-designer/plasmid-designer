import { useState, useCallback, useMemo } from 'react'

type SelectionRange = { start: number, end: number }

const useSelection = () => {
    const [isSelecting, setIsSelecting] = useState(false)
    const [selection, setSelection] = useState<SelectionRange>({ start: 0, end: 0 })

    const startSelection = useCallback((start: number) => {
        if (start === selection.start) return
        setIsSelecting(true)
        setSelection({ start, end: start })
    }, [selection.start])

    const updateSelection = useCallback((end: number) => {
        if (!isSelecting || end === selection.end) return
        setSelection({ start: selection.start, end })
    }, [selection, isSelecting])

    const endSelection = useCallback((end: number) => {
        if (!isSelecting) return
        setSelection({ start: selection.start, end })
        setIsSelecting(false)
    }, [selection.start, isSelecting])

    const resetSelection = useMemo(() => () => {
        setIsSelecting(false)
    }, [])

    return {
        isSelecting,
        selection,
        startSelection,
        updateSelection,
        endSelection,
        resetSelection,
    }
}

export default useSelection
