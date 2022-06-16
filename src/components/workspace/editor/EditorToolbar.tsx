import styled from 'styled-components'
import { useRecoilState } from 'recoil'

import { editorHintState, editorRendererState } from '../../../state/atoms'

import { rendererList } from '../renderers'
import MenuButton from '../../MenuButton'
import Toolbar from '../Toolbar'

type Props = {
    className?: string,
}

const EditorToolbar = ({ className }: Props) => {
    const [editorHints, setEditorHints] = useRecoilState(editorHintState)
    const [renderer, setRenderer] = useRecoilState(editorRendererState)

    return (
        <Toolbar className={className}>
            <div className="input_container">
                <MenuButton title="View">
                    <div className="input_wrapper">
                        <input
                            type="checkbox"
                            id="show-complement"
                            checked={editorHints.showComplementStrand}
                            onChange={e => setEditorHints(hints => ({...hints, showComplementStrand: e.target.checked}))}
                        />
                        <label htmlFor="show-complement">Show Antistrand</label>
                    </div>
                    <div className="input_wrapper">
                        <input
                            type="checkbox"
                            id="show-codon-numbers"
                            checked={editorHints.showCodonNumbers}
                            onChange={e => setEditorHints(hints => ({...hints, showCodonNumbers: e.target.checked}))}
                        />
                        <label htmlFor="show-codon-numbers">Show Codon Indices</label>
                    </div>
                    <div className="input_wrapper">
                        <input
                            type="checkbox"
                            id="show-peptides"
                            checked={editorHints.showPeptides}
                            onChange={e => setEditorHints(hints => ({...hints, showPeptides: e.target.checked}))}
                        />
                        <label htmlFor="show-peptides">Show Peptides</label>
                    </div>
                    <div className="input_wrapper">
                        <input
                            type="checkbox"
                            id="highlight-active-codon"
                            checked={editorHints.highlightCurrentCodon}
                            onChange={e => setEditorHints(hints => ({...hints, highlightCurrentCodon: e.target.checked}))}
                        />
                        <label htmlFor="highlight-active-codon">Highlight Active Codon</label>
                    </div>
                </MenuButton>
            </div>
            <div className="input_container" style={{flexGrow: 1}}></div>
            { rendererList.length > 1 && (
                <div className="input_container">
                    <div className="input_wrapper">
                        <select id="renderer-input" value={renderer} onChange={e => setRenderer(e.target.value)} placeholder="Renderer">
                            {rendererList.map(info => (
                                <option key={info.key} value={info.key}>{info.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </Toolbar>
    )
}

export default styled(EditorToolbar)`
    & .input_container {
        display: flex;
        align-items: center;
        gap: .25rem;
        height: 100%;
        border-radius: .25rem;

        .input_wrapper {
            display: flex;
            align-items: center;
            border-radius: .25rem;
            /* background: hsl(0,0%,95%); */
            padding: 0 .25rem;
            /* border: 1px solid hsl(0,0%,75%); */
            height: 100%;

            label {
                user-select: none;
            }

            &:last-child {
                margin-right: .5rem;
            }
        }

        input[list] {
            margin-left: .25rem;
        }
    }
`
