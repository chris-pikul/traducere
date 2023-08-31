/**
 * Loopback is a testing backend
 */

import { Backend, services } from './types';

async function loopback(text: string, lang: string): Promise<string> {
    return text.split('').reverse().join('');
}
loopback.service = services.loopback;
export default loopback satisfies Backend;
