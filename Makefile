.PHONY: ts-generate-bindings ts-integrate-bindings ts dev release

TS_SOURCES := $(wildcard src-tauri/src/shared/*.rs)

ts-generate-bindings: ${TS_SOURCES}
	pushd src-tauri; \
	cargo test; \
	popd

ts-integrate-bindings: ts-generate-bindings
	cp -f src-tauri/bindings/*.ts src/bindings/
	ls -1 src-tauri/bindings \
	| cut -f1 -d'.' \
	| sed 's/^\(.*\)$$/export * from ".\/\1"/' > src/bindings/index.ts

ts-clean-bindings:
	rm -r src-tauri/bindings

ts: ts-integrate-bindings ts-clean-bindings

dev: ts
	cargo tauri dev

release: ts
	cargo tauri build
