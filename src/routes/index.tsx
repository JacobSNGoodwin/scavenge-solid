import ClerkInfo from '~/components/clerkInfo';

export default function Home() {
	return (
		<main class="max-w-screen-md mx-auto mt-4">
			<ClerkInfo />
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
