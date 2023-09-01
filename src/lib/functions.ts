export type UnknownFunction = (...args: any[]) => any;

/**
 * Makes a callback function execute in 1ms instead of immediately. Useful in
 * making functions async.
 *
 * @param cb Function to execute
 */
export function setImmediate<TFunc extends UnknownFunction>(cb: TFunc): void {
    setTimeout(cb, 1);
}

/**
 * Throw-away asynchronous function. Accepts either a promise, or a function
 * resolving to one. It will call the promise on the next event cycle (1ms later)
 * and discard any results. If the promise rejects, it is logged to console to
 * prevent "uncaught" exception errors.
 *
 * Sometimes, you just want something to happen asynchronously, and the current
 * program flow just doesn't care about the results.
 *
 * @param prom Either a function resolving to a promise, or the promise itself.
 */
export function asyncThrowaway<TFunc extends UnknownFunction>(
    prom: Promise<unknown> | TFunc,
): void {
    setImmediate(() => {
        (typeof prom === 'function' ? prom() : prom)
            .then()
            .catch((err: any) => {
                console.error('throw-away promise rejected', err);
            });
    });
}

/**
 * Debounces a function by wrapping it with a timer. Repeated calls to the
 * returned function will restart the timer. Until calls stop being made for
 * the duration, the function given will not execute. Once the time has elapsed,
 * the function will be called once.
 *
 * @param func Callback function
 * @param waitMS Time in milliseconds to wait
 * @returns New function wrapping the original, accepting the same parameters.
 */
export function debounce<TFunc extends UnknownFunction>(
    func: TFunc,
    waitMS: number,
) {
    let timeout: ReturnType<typeof setTimeout>;

    return function (this: unknown, ...args: Parameters<TFunc>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), waitMS);
    };
}
