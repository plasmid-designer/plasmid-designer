import { useEffect, useMemo, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import YAPV from '@yapv/core'
import SVG from '@yapv/svg'
import { activeProjectSelector } from '../../state/selectors'
import { useElementSize } from '../../hooks/useElementSize'
import { VectorMap } from '@yapv/core/lib/models/types'

const getNucleotideColor = (nucleotide: string) => {
    switch (nucleotide.toUpperCase()) {
        case 'A': return 'hsl(0,75%,60%)';
        case 'T': return 'hsl(50,85%,60%)';
        case 'G': return 'hsl(100,50%,60%)';
        case 'C': return 'hsl(200,50%,60%)';
        default: return 'hsl(0,0%,75%)';
    }
}

type Props = {
    className?: string,
    name?: string,
}

const PlasmidViewer = ({ className, name = "Foo" }: Props) => {
    const ref = useRef<HTMLDivElement>(null)
    const activeProject = useRecoilValue(activeProjectSelector)
    const sequence = useMemo(() => {
        if (!activeProject?.id) { return [] }
        return [...activeProject.sequence]
    }, [activeProject?.id, activeProject?.sequence])
    const [parentRef, size] = useElementSize<HTMLDivElement>()

    const markers = useMemo(() => {
        return sequence.map((nucleotide, i) => {
            return {
                displayConfig: {
                    width: 10,
                    distance: 100,
                    style: `stroke: transparent; fill: ${getNucleotideColor(nucleotide)}; stroke-width: 1;`,
                    anchor: {
                        width: 20,
                        height: 20,
                    },
                },
                location: {
                    start: i + 1,
                    end: i + 2
                },
            }
        })
    }, [sequence])

    const sequenceConfig = useMemo(() => {
        const interval =
            sequence.length < 3 ? 1 :
            sequence.length < 10 ? 2 :
            sequence.length < 50 ? 2 :
            sequence.length < 100 ? 10 :
            sequence.length < 500 ? 25 :
            sequence.length < 1000 ? 50 :
            sequence.length < 2000 ? 100 :
            sequence.length < 5000 ? 200 : 500
        return {
            sequenceConfig: {
                length: sequence.length,
            },
            displayConfig: {
                width: size.width,
                height: size.width,
                // viewBox: {
                //     width: 256,
                //     height: 256,
                // },
            },
            labels: [
                {
                    text: name,
                    displayConfig: {
                        type: 'text',
                        style: 'text-anchor: middle; font: 16pt "Arial", sans-serif; fill: black;',
                        vOffset: 0,
                    },
                },
                {
                    text: `${sequence.length} bp`,
                    displayConfig: {
                        type: 'text',
                        style: 'text-anchor: middle; font: 12pt "Arial", sans-serif; fill: black;',
                        vOffset: 20,
                    },
                },
            ],
            tracks: [
                {
                    displayConfig: {
                        distance: 100,
                        width: 0,
                        style: 'stroke: transparent; fill: transparent;',
                    },
                    axes: [{
                        displayConfig: {
                          distance: 5,
                          width: 5,
                          style: 'fill: black;',
                          scales: [{
                            width: 10,
                            distance: 5,
                            interval,
                            style: 'stroke: black; stroke-width: 2;',
                            label: {
                                type: 'text',
                                style: 'text-anchor: start; font: 12pt sans-serif; fill: black;',
                                distance: 30,
                            }
                          }]
                        }
                    }],
                    markers,
                },
            ],
        }
    }, [name, sequence, markers, size?.width])

    useEffect(() => {
        if (
            !ref.current
            || size.width === 0
            || size.height === 0
        ) return

        const el = document.createElement('div')
        const renderer = YAPV.create(el)
        renderer.use(SVG.circular)
        renderer.draw(sequenceConfig as VectorMap)
        ref.current.replaceChildren(el)
    }, [size, sequence, sequenceConfig])

    return (
        <div ref={parentRef} className={className}>
            {sequence.length > 0 && (
                <div className="inner" ref={ref} />
            )}
        </div>
    )
}

export default styled(PlasmidViewer)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    user-select: none;

    & .inner {
        width: 100%;
        height: 100%;
    }

    & .inner > div {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        height: 100%;

        & svg {
            width: 100%;
            height: auto;
        }
    }
`
