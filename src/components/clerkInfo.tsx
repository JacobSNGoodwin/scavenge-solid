'use client';
import { useAuthClient } from '~/auth/primitives';

export default function ClerkInfo() {
	const clerk = useAuthClient();

	return <p>Context value: {clerk()}</p>;
}
