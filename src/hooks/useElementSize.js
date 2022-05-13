import { useState, useLayoutEffect, useMemo } from 'react'

export const useElementSize = () => {
    const [ref, setRef] = useState(null)
    const [size, setSize] = useState({width: 0, height: 0})

    const handleObservedResize = useMemo(() => entries => {
        console.log('resize')
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
