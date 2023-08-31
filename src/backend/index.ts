import { getConfigValue } from '../lib/config';
import { Backend, Service, services } from './types';
import loopback from './loopback';
import { showError } from '../lib/display';

export { services } from './types';

export type { Service, Backend } from './types';

const serviceBackends: Record<Service, Backend> = {
    [services.loopback]: loopback,
    [services.deepl]: loopback,
    [services.google]: loopback,
    [services.microsoft]: loopback,
} as const;

export async function useBackendService(text: string) {
    const service = getConfigValue<Service>('backendService');
    if (service in serviceBackends) {
        try {
            const results = await serviceBackends[service](text, '');
            return results;
        } catch (err: unknown) {
            console.error(
                `error attempting to translate text block using backend "${service}"`,
                err,
            );
            throw new Error(
                `Sorry, we could not translate that text using your preffered backend "${service}"`,
            );
        }
    }

    throw new Error(`Preffered backend "${service}" is invalid`);
}
