import { useState, useLayoutEffect, useMemo } from 'react'

type Size = { width: number, height: number }

export const useElementSize = (): [React.Dispatch<React.SetStateAction<Element>>, Size] => {
    const [ref, setRef] = useState<Element | null>(null)
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
