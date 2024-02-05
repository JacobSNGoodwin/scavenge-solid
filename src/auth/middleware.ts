import { FetchEvent } from '@solidjs/start/server';
import { Session, User, verifyRequestOrigin } from 'lucia';
import { appendHeader, getCookie, getHeader } from 'vinxi/http';

import { lucia } from './lucia';

const authMiddleWare = async (event: FetchEvent) => {};

export default authMiddleWare;
