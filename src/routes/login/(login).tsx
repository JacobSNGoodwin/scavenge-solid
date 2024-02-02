import { useAuthClient } from '~/components/AuthContext';

export default function Login() {
	// CLERK V5 docs
	// https://github.com/clerk/javascript/tree/%40clerk/clerk-js%405.0.0-beta-v5.20/packages/clerk-js
	const clerk = useAuthClient();

	return <p>Login page: {clerk ?? 'Nada'}</p>;
}
