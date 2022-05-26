import { selector } from 'recoil'
import ProjectModel from '../components/models/ProjectModel'
import { projectsState } from './atoms'

export const projectListSelector = selector({
    key: 'projectListSelector',
    get: ({ get }) => {
        return Object.values(get(projectsState)).map(jsonProject => ProjectModel.fromJSON(jsonProject))
    }
})
