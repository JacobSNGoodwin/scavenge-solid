// @refresh reload
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { MetaProvider } from '@solidjs/meta';
import { ErrorBoundary, Suspense } from 'solid-js';

export default function App() {
	return (
		<MetaProvider>
			<Router
				root={(props) => (
					<>
						<Suspense fallback={<div>Loading...</div>}>
							<ErrorBoundary fallback={<div>Something went wrong</div>}>
								{props.children}
							</ErrorBoundary>
						</Suspense>
					</>
				)}
			>
				<FileRoutes />
			</Router>
		</MetaProvider>
	);
}
