/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly NEON_CONNECTION_STRING: string;
	readonly GOOGLE_CLIENT_ID: string;
	readonly GOOGLE_CLIENT_SECRET: string;
	readonly FACEBOOK_CLIENT_ID: string;
	readonly FACEBOOK_CLIENT_SECRET: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
