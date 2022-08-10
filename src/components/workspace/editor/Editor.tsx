import { useMemo, useRef, useEffect, useCallback, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Loader } from 'react-feather'
import styled from 'styled-components'

import useEditor from '../useEditor'
import EditorToolbar from './EditorToolbar'

import { activeProjectIdState, editorRendererState } from '../../../state/atoms'
import { rendererList, NextRenderer } from '../renderers'

type Props = {
    className?: string,
    projectId: string,
}

const Editor = ({ className, projectId }: Props) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const [renderCursor, setRenderCursor] = useState(false)

    const rendererName = useRecoilValue(editorRendererState)
    const activeProjectId = useRecoilValue(activeProjectIdState)

    const {
        cursor,
        sequence,
        selection,
        handlers: {
            handleKeyDown,
            handleMouseEvent,
        },
        isLoading,
        reloadEditor,
    } = useEditor(projectId)

    useEffect(() => {
        editorRef.current?.focus()
    }, [])

    useEffect(() => {
        reloadEditor()
    }, [projectId])

    const handleFocusChange = useCallback((showCursor: boolean, refocus = false) => () => {
        setRenderCursor(showCursor)
        if (refocus) { editorRef.current?.focus() }
    }, [])

    const RendererComponent = useMemo(() => {
        return rendererList.find(({ key }) => key === rendererName)?.component ?? NextRenderer
    }, [rendererName])

    return (
        <div className={className}>
            {isLoading && <div className="loader-overlay"><Loader size={64} /></div>}
            {activeProjectId === null && (
                <div className="no-project">
                    Please create or select a project from the sidebar.
                </div>
            )}
            {activeProjectId !== null && (
                <>
                    <div
                        ref={editorRef}
                        className="editor"
                        onKeyDown={handleKeyDown}
                        onMouseDown={handleMouseEvent}
                        onMouseMove={handleMouseEvent}
                        onMouseUp={handleMouseEvent}
                        onFocus={handleFocusChange(true)}
                        onClick={handleFocusChange(true, true)}
                        onBlur={handleFocusChange(false)}
                        tabIndex={0}
                    >
                        <RendererComponent sequence={sequence} cursor={cursor} selection={selection} showCursor={renderCursor} />
                    </div>
                </>
            )}
        </div>
    )
}

export default styled(Editor)`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    flex-grow: 1;

    .editor {
        width: 100%;
        height: 100%;
        overflow: auto;

        &:focus {
            outline: none;
        }
    }

    .no-project {
        user-select: none;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    @keyframes spin {
        from { opacity: 1; transform: rotate(0deg); }
        50% { opacity: 0.5; }
        to { opacity: 1; transform: rotate(360deg); }
    }

    .loader-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: hsla(0,0%,100%,.5);
        z-index: 100;

        & > * {
            animation: spin 1s linear infinite;
        }
    }
`
