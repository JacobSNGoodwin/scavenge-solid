'use client';
import { Clerk } from '@clerk/clerk-js';
import { Signal, createContext, createSignal } from 'solid-js';

const AuthContext = createContext<Signal<number>>(createSignal(5), {
	name: 'AuthContext',
});

export default AuthContext;
