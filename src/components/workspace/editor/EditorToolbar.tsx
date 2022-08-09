import styled from 'styled-components'
import { useRecoilState } from 'recoil'

import { editorHintState, editorRendererState } from '../../../state/atoms'

import { rendererList } from '../renderers'
import MenuButton from '../../MenuButton'
import Toolbar from '../Toolbar'
import { Checkbox } from '@geist-ui/core'

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
                    <Checkbox
                        checked={editorHints.showComplementStrand}
                        onChange={e => setEditorHints(hints => ({...hints, showComplementStrand: e.target.checked}))}
                    >Show Antistrand</Checkbox>
                    <Checkbox
                        checked={editorHints.showCodonNumbers}
                        onChange={e => setEditorHints(hints => ({...hints, showCodonNumbers: e.target.checked}))}
                    >Show Codon Indices</Checkbox>
                    <Checkbox
                        checked={editorHints.showPeptides}
                        onChange={e => setEditorHints(hints => ({...hints, showPeptides: e.target.checked}))}
                    >Show Peptides</Checkbox>
                    <Checkbox
                        checked={editorHints.highlightCurrentCodon}
                        onChange={e => setEditorHints(hints => ({...hints, highlightCurrentCodon: e.target.checked}))}
                    >Highlight Active Codon</Checkbox>
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
