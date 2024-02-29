/// <reference types="@solidjs/start/env" />
import { Session, User } from 'lucia';

declare module '@solidjs/start/server' {
	interface RequestEventLocals {
		user: User | null;
		session: Session | null;
	}
}
