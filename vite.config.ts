import { defineConfig } from '@solidjs/start/config';
import UnoCSS from 'unocss/vite';
import { presetIcons, presetWebFonts, presetUno } from 'unocss';

export default defineConfig({
	plugins: [
		UnoCSS({
			shortcuts: [
				{
					btn: 'py-2 px-4 font-semibold rounded-lg shadow-md hover:shadow-lg hover:opacity-90',
				},
			],
			presets: [
				presetUno(),
				presetIcons(),
				presetWebFonts({
					provider: 'bunny',
					fonts: {
						sans: 'Lato',
						mono: 'Fira Code',
					},
				}),
			],
		}),
	],
});
