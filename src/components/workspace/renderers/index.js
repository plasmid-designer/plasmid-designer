import NextRenderer from './NextRenderer'

const createRenderer = (key, name, component) => ({ key, name, component })

export const rendererList = [
    createRenderer('next', 'Next Renderer (Default)', NextRenderer),
]

export {
    NextRenderer,
}
