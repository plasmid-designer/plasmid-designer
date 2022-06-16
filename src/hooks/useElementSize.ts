import { useState, useLayoutEffect, useMemo } from 'react'

type Size = { width: number, height: number }

export const useElementSize = <E extends HTMLElement = HTMLDivElement>(): [(node: E  | null) => void, Size] => {
    const [ref, setRef] = useState<E | null>(null)
    const [size, setSize] = useState<Size>({ width: 0, height: 0 })

    const handleObservedResize = useMemo(() => (entries: ResizeObserverEntry[]) => {
        const entry = entries[0]
        const { width, height } = entry.contentRect
        setSize({ width, height })
    }, [])

    const resizeObserver = useMemo(() => new ResizeObserver(entries => handleObservedResize(entries)), [handleObservedResize])

    useLayoutEffect(() => {
        if (!ref) return
        const current = ref
        resizeObserver.observe(current)
        return () => resizeObserver.unobserve(current)
    }, [ref, resizeObserver])

    return [setRef, size]
}
