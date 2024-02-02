// @refresh reload
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start';
import { Suspense } from 'solid-js';
import AuthProvider from './auth/AuthProvider';

export default function App() {
	return (
		<Router
			root={(props) => (
				<>
					<AuthProvider>
						<Suspense fallback={<div>Loading...</div>}>
							{props.children}
						</Suspense>
					</AuthProvider>
				</>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
