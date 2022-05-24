import { selector } from 'recoil'
import { modalState } from './atoms'

const createModalSelector = key => {
    return selector({
        key: `${key}Selector`,
        get: ({ get }) => get(modalState)?.[key] ?? false,
        set: ({ set }, value) => set(modalState, state => ({ ...state, [key]: value })),
    })
}

export const NewProjectModalIsOpenSelector = createModalSelector('newProjectModal')
