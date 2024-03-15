export default function Home() {
	return (
		<main class="max-w-screen-md mx-auto">
			<div class="mx-auto flex flex-col justify-center h-screen">
				<a
					href="/manage"
					class="btn block w-24 text-center mx-auto my-2 bg-violet-500 text-white"
				>
					Manage
				</a>
				<a href="/join" class="btn block w-24 text-center mx-auto my-2">
					Join
				</a>
			</div>
		</main>
	);
}
