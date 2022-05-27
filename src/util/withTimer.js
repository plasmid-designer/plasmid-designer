export const withTimer = name => fn => (...params) => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        const start = Date.now()
        const result = fn(...params)
        console.log(`[${name}] ${Date.now() - start}ms`)
        return result
    } else {
        return fn(...params)
    }
}
