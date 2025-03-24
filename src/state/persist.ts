// import type { AtomEffect, DefaultValue, WrappedValue } from "recoil"

// const PERSIST_KEY = 'plasmid'

// type StorageBackend = {
// 		getData: <T>() => T,
// 		setData: <T>(data: T) => void,
// }

// const sessionStorageBackend: StorageBackend = {
// 	getData: <T>() => JSON.parse(sessionStorage.getItem(PERSIST_KEY) ?? '{}') as T,
// 	setData: <T>(data: T) => sessionStorage.setItem(PERSIST_KEY, JSON.stringify(data))
// }

// const localStorageBackend: StorageBackend = {
// 	getData: <T>() => JSON.parse(localStorage.getItem(PERSIST_KEY) ?? '{}') as T,
// 	setData: <T>(data: T) => localStorage.setItem(PERSIST_KEY, JSON.stringify(data))
// }

// type AtomEffectArgs<T> = {
//     trigger: 'get' | 'set'
//     setSelf: (param:
//         | T
//         | DefaultValue
//         | Promise<T | DefaultValue>
//         | WrappedValue<T>
//         | ((param: T | DefaultValue) => T | DefaultValue | WrappedValue<T>),
//     ) => void,
//     onSet: (
//         param: (newValue: T, oldValue: T | DefaultValue, isReset: boolean) => void,
//     ) => void,
// }

// const persistSession = <T>(backend: StorageBackend, key: string, { trigger, setSelf, onSet }: AtomEffectArgs<T>) => {
// 	if (trigger === 'get') {
// 		const sessionData: Record<string, T> = backend.getData()
// 		if (key in sessionData) {
// 			setSelf(sessionData[key])
// 		}
// 	}
// 	onSet((newValue: T, _oldValue: T, isReset: boolean) => {
// 		const sessionData: Record<string, T> = backend.getData()
// 		if (isReset && key in sessionData) {
// 			delete sessionData[key]
// 		} else {
// 			sessionData[key] = newValue
// 		}
// 		backend.setData(sessionData)
// 	})
// }

// export function persistSessionEffect<T>(key: string): AtomEffect<T> {
// 		return args => persistSession(sessionStorageBackend, key, args)
// }

// export function persistLocalEffect<T>(key: string): AtomEffect<T> {
// 		return args => persistSession(localStorageBackend, key, args)
// }
