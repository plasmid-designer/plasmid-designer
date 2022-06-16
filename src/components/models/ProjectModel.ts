import { v4 as uuid } from 'uuid'

interface ProjectModelParams {
    id: string,
    name?: string,
    sequence?: string,
    createdAt?: Date,
    updatedAt?: Date
}

interface ProjectModelParamsV1 {
    $v: number;
    id: string,
    name: string,
    sequence: string,
    createdAt: Date,
    updatedAt?: Date
}

export default class ProjectModel {
    $v: number
    id: string
    name?: string
    sequence: string
    createdAt: Date
    updatedAt?: Date

    constructor(params: Partial<ProjectModelParams>) {
        const defaultParams = {
            id: uuid(),
            name: undefined,
            sequence: '',
            createdAt: new Date(),
            updatedAt: undefined,
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
            && (this.name?.length ?? 0) > 0
        )
    }

    get json() {
        return JSON.stringify(this)
    }

    updateImmutable(params: Partial<ProjectModelParams>) {
        return new ProjectModel({
            ...this,
            ...params,
        })
    }

    static fromJSON(json: { $v: number }) {
        if (json.$v === 1) {
            const v1 = json as ProjectModelParamsV1;
            return new ProjectModel({
                ...v1,
                createdAt: new Date(v1.createdAt),
                updatedAt: v1.updatedAt ? new Date(v1.updatedAt) : undefined,
            })
        }

        console.error('Unsupported model version:', json.$v)
        return null
    }
}
