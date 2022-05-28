export const withTimer = name => fn => (...params) => {
    const start = Date.now()
    const result = fn(...params)
    console.log(`[${name}] ${Date.now() - start}ms`)
    return result
}
