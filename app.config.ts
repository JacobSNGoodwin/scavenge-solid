import { defineConfig } from '@solidjs/start/config';
import UnoCSS from 'unocss/vite';
import { presetIcons, presetWebFonts, presetUno } from 'unocss';

export default defineConfig({
	server: {
		preset: 'bun',
	},
	vite: {
		plugins: [
			UnoCSS({
				shortcuts: [
					{
						'text-input':
							'border-1 border-gray focus:border-2 rounded-md p-2 block focus:outline-none',
						btn: 'py-2 px-4 font-normal rounded-lg shadow-md hover:shadow-lg hover:opacity-90 disabled:bg-gray-300 disabled:pointer-events-none',
					},
				],
				presets: [
					presetUno(),
					presetIcons(),
					presetWebFonts({
						provider: 'google',
						fonts: {
							sans: [
								{
									name: 'Lato',
									weights: ['400', '600', '700'],
									italic: true,
								},
							],
							mono: [
								{
									name: 'Fira Code',
									weights: ['400', '600', '700'],
									italic: true,
								},
							],
						},
					}),
				],
				theme: {
					breakpoints: {
						xs: '480px',
						sm: '640px',
						md: '768px',
						lg: '1024px',
						xl: '1280px',
						'2xl': '1536px',
					},
				},
			}),
		],
	},
	middleware: './src/middleware.ts',
});
