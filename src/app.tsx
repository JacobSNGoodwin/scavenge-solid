// @refresh reload
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start';
import { Suspense } from 'solid-js';
import 'virtual:uno.css';
import './app.css';

export default function App() {
	return (
		<Router
			root={(props) => (
				<>
					<Suspense fallback={<div>Loading...</div>}>{props.children}</Suspense>
				</>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
