import { useAuthClient } from '~/auth/AuthProvider';

export default function Home() {
	const client = useAuthClient();
	return (
		<main class="max-w-screen-md mx-auto mt-4">
			<h1 class="text-3xl text-center">
				Scavenge: {client ? 'Client' : 'No client'}
			</h1>
			<div class="mx-auto flex flex-col my-12">
				<a href="/manage" class="btn block w-24 text-center mx-auto my-2">
					Manage
				</a>
				<a href="/join" class="btn block w-24 text-center mx-auto my-2">
					Join
				</a>
				<a href="/login" class="btn block w-24 text-center mx-auto my-2">
					Log on In
				</a>
			</div>
		</main>
	);
}
