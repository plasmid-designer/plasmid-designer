import { v4 as uuid } from 'uuid'

export default class ProjectModel {
    /**
     * @param {{
     * id: string,
     * name?: string,
     * sequence?: string,
     * createdAt?: Date,
     * updatedAt?: Date,
     * }} params
     */
    constructor(params) {
        const defaultParams = {
            id: uuid(),
            name: null,
            sequence: '',
            createdAt: new Date(),
            updatedAt: null,
        }
        const mergedParams = {
            ...defaultParams,
            ...params,
        }
        this.$v = 1
        this.id = mergedParams.id
        this.name = mergedParams.name
        this.sequence = mergedParams.sequence
        this.createdAt = mergedParams.createdAt
        this.updatedAt = mergedParams.updatedAt
    }

    get basePairCount() {
        return this.sequence.length
    }

    get isValid() {
        return (
            this.name !== null
            && this.name.length > 0
        )
    }

    get json() {
        return JSON.stringify(this)
    }

    updateImmutable(params) {
        return new ProjectModel({
            ...this,
            ...params,
        })
    }

    static fromJSON(json) {
        switch (json.$v) {
            case 1: return new ProjectModel({
                ...json,
                createdAt: new Date(json.createdAt),
                updatedAt: json.updatedAt ? new Date(json.updatedAt) : null,
            })
            default:
                console.error('Unsupported model version:', json.$v)
                return null
        }
    }
}
