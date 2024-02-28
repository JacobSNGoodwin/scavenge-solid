import { StartServer, createHandler } from '@solidjs/start/server';
import { webcrypto } from 'node:crypto';

// this is needed for oslo code creation
// @ts-ignore
globalThis.crypto = webcrypto;

export default createHandler(() => (
	<StartServer
		document={({ assets, children, scripts }) => (
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="icon" href="/favicon.ico" />
					{assets}
				</head>
				<body class="font-sans">
					<div id="app">{children}</div>
					{scripts}
				</body>
			</html>
		)}
	/>
));
