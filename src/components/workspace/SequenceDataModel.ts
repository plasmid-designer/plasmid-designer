import { EditorCursorData, EditorSelectionData, EditorSequenceData, EditorSequenceItem } from "../../Bridge"

class Range {
    start: number
    end: number
    length: number

    constructor(start: number, end: number) {
        this.start = start
        this.end = end
        this.length = end - start
    }
}

export class SequenceDataSelectionModel {
    _data: EditorSelectionData | undefined
    start: number | undefined
    end: number | undefined
    length: number
    isActive: boolean

    constructor(data?: EditorSelectionData) {
        this._data = data

        this.start = this._data?.start
        this.end = this._data?.end
        this.length = Math.max(0, (this.end ?? 0) - (this.start ?? 0))
        this.isActive = data !== undefined && data !== null
    }

    contains(index: number) {
        if (!this.isActive) return false
        return index >= (this.start ?? 0) && index < (this.end ?? 0)
    }

    overlapCount(index: number, nucleotideCount: number) {
        if (!this.isActive || !this.start || !this.end) return 0
        if (this.start > index + nucleotideCount) return 0
        const selectionRange = new Range(this.start, this.end)
        const codonRange = new Range(index, index + nucleotideCount)
        const minRange = selectionRange.start < codonRange.start ? selectionRange : codonRange
        const maxRange = minRange === selectionRange ? codonRange : selectionRange
        if (minRange.end < maxRange.start) return 0
        const overlapRange = new Range(maxRange.start, minRange.end < maxRange.end ? minRange.end : maxRange.end)
        return overlapRange.length
    }
}

export class SequenceDataCursorModel {
    _data: EditorCursorData
    cursorPosition: number

    constructor(data?: EditorCursorData) {
        this._data = data ?? { position: 0, is_at_end: true }

        this.cursorPosition = this._data.position
    }

    isCursorAtEnd() {
        return this._data.is_at_end
    }

    isItemSelected(item: SequenceDataItemModel) {
        const cursorPos = this.cursorPosition
        const startIndex = item.startIndex
        return cursorPos >= startIndex && cursorPos < startIndex + item.codonLetters.length
    }
}

export class SequenceDataItemModel {
    data: EditorSequenceItem

    constructor(item: EditorSequenceItem) {
        this.data = item
    }

    /**
     * @returns {string[]}
     */
    get codonLetters() {
        return this.data.codon
    }

    /**
     * @returns {string[]}
     */
    get anticodonLetters() {
        return this.data.anticodon
    }

    /**
     * @returns {string}
     */
    get peptideLetter() {
        return this.data.peptide ?? ''
    }

    /**
     * @returns {number}
     */
    get startIndex() {
        return this.data.start_index
    }
}

export default class SequenceDataModel {
    _data: { sequence: EditorSequenceItem[], bp_count: number }
    _items: SequenceDataItemModel[]
    _selection: SequenceDataSelectionModel

    constructor(data?: EditorSequenceData) {
        const patchedData = {
            sequence: data?.sequence ?? [],
            bp_count: data?.bp_count ?? 0,
        }
        this._data = patchedData
        this._items = this._data.sequence.map(item => new SequenceDataItemModel(item))
        this._selection = new SequenceDataSelectionModel(data?.selection)
    }

    /**
     * @returns {number}
     */
    get bpCount() {
        return this._data.bp_count
    }

    /**
     * @returns {SequenceDataItemModel[]}
     */
    get items() {
        return this._items
    }

    /**
     * @returns {string[]}
     */
    get nucleotideSequence() {
        return this.items.flatMap(item => item.codonLetters)
    }

    /**
     * @returns {string}
     */
    get nucleotideString() {
        return this.nucleotideSequence.join('')
    }

    /**
     * @returns {string[]}
     */
     get antinucleotideSequence() {
        return this.items.flatMap(item => item.anticodonLetters)
    }
}
