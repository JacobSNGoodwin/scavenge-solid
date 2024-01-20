import { defineConfig } from '@solidjs/start/config';
import UnoCSS from 'unocss/vite';
import { presetIcons, presetWebFonts, presetUno } from 'unocss';

export default defineConfig({
	plugins: [
		UnoCSS({
			presets: [
				presetUno(),
				presetIcons(),
				presetWebFonts({
					provider: 'none',
					fonts: {
						sans: 'Lato',
					},
				}),
			],
		}),
	],
});
