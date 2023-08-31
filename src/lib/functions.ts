export type UnknownFunction = (...args: any[]) => any;

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
