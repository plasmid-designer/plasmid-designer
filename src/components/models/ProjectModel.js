import { v4 as uuid } from 'uuid'

export default class ProjectModel {
    constructor(id = uuid(), name = null, sequence = []) {
        this.$v = 1
        this.id = id
        this.name = name
        this.sequence = sequence
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

    static fromJSON(json) {
        switch (json.$v) {
            case 1: return new ProjectModel(json.id, json.name, json.sequence)
            default:
                console.error('Unsupported model version:', json.$v)
                return null
        }
    }
}
