export default function Login() {
	return (
		<main class="max-w-screen-md mx-auto mt-4">
			<a
				href="/authorize/google"
				class="btn block w-24 text-center mx-auto my-2"
			>
				Google
			</a>
			<a
				href="/authorize/facebook"
				class="btn block w-24 text-center mx-auto my-2"
			>
				Facebook
			</a>
		</main>
	);
}
