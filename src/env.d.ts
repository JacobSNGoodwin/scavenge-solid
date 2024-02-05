/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly NEON_CONNECTION_STRING: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
