/**
 * Provides utility libraries for generating and working with extension commands
 */
import { ExtensionContext, commands, window } from 'vscode';
import { insertWithGenerator } from './editor';

/**
 * A function that does not insert anything
 */
export type CommandFunction = (...args: any[]) => void;

/**
 * A function that returns a string for generating new text
 */
export type OutputFunction = (...args: any[]) => string;

/**
 * If a command can have a prompt, then these are the options for that operation.
 */
export type CommandPrompt = {
    message: string;
    placeholder?: string;
    validator?: (input?: string) => boolean | string;
    errorMessage?: string;
    defaultValue?: string;
};

/**
 * Declares a command that can be registered. If the `type` field is missing,
 * than `generator` is assumed.
 */
export type Command = {
    key: string;
    category?: string;
    title: string;
    shortTitle?: string;
    func: CommandFunction | OutputFunction;
    prompt?: CommandPrompt;
    prompts?: CommandPrompt[];
    isCommand?: boolean;
    templateName?: string | string[];
};

/**
 * Makes a command key by prefixing it with the known global prefix "mb."
 *
 * @param key command key
 * @returns new string
 */
export function makeCommandKey(key: string): string {
    return `mb.${key}`;
}

/**
 * Executes a given command
 * 
 * @param cmd Command description to execute
 * @param args Any arguments that may be provided to the command
 */
export function executeCommand(cmd: Command, ...args: any[]): void {
    if (cmd.isCommand) (cmd.func as CommandFunction).apply(cmd, args);
    else insertWithGenerator(cmd.func as OutputFunction, ...args);
}

/**
 * Registers a new command that will generate new source text.
 *
 * Uses the {@link insertWithGenerator} function to re-generate the text at
 * each cursor position.
 *
 * @param context VSCode extension context
 * @param cmd Given command to register
 */
export function registerGeneratorCommand(
    context: ExtensionContext,
    cmd: Command,
) {
    const handle = commands.registerTextEditorCommand(
        makeCommandKey(cmd.key),
        () => executeCommand(cmd),
    );
    context.subscriptions.push(handle);
}

export function registerPromptCommand(
    context: ExtensionContext,
    cmd: Command,
) {
    if (typeof cmd.prompt === 'undefined')
        throw new Error('Command is missing prompt options');

    const handle = commands.registerTextEditorCommand(
        makeCommandKey(cmd.key),
        () => {
            window
                .showInputBox({
                    title: cmd.shortTitle,
                    prompt: cmd.prompt?.message,
                    placeHolder: cmd.prompt?.placeholder,
                    value: cmd.prompt?.defaultValue,
                    validateInput: (input: string) => {
                        if (cmd.prompt && cmd.prompt.validator) {
                            const result = cmd.prompt.validator(input);
                            if (typeof result === 'string') return result;
                            else if (
                                typeof result === 'boolean' &&
                                result === false
                            )
                                return 'The value you entered is invalid, please try again';
                        }
                        return null;
                    },
                })
                .then((value?: string) => executeCommand(cmd, value));
        },
    );
    context.subscriptions.push(handle);
}

export function registerChainPromptCommand(
    context: ExtensionContext,
    cmd: Command,
) {
    if (typeof cmd.prompts === 'undefined' || !Array.isArray(cmd.prompts))
        throw new Error('Command is missing prompts array options');

    const handle = commands.registerTextEditorCommand(
        makeCommandKey(cmd.key),
        () => {
            if (!cmd.prompts) return;
            if (cmd.prompts.length === 0) return executeCommand(cmd);

            const results: (string | undefined)[] = new Array(
                cmd.prompts.length,
            );
            let ind = 0;
            const { length } = cmd.prompts;

            const prompt = (opts: CommandPrompt) => {
                window
                    .showInputBox({
                        title: cmd.shortTitle,
                        prompt: opts.message,
                        placeHolder: opts.placeholder,
                        value: opts.defaultValue,
                        validateInput: (input: string) => {
                            if (opts.validator) {
                                const result = opts.validator(input);
                                if (typeof result === 'string') return result;
                                else if (
                                    typeof result === 'boolean' &&
                                    result === false
                                )
                                    return 'The value you entered is invalid, please try again';
                            }
                            return null;
                        },
                    })
                    .then((value?: string) => {
                        results[ind] = value;
                        ind++;

                        if (ind < length && cmd.prompts)
                            prompt(cmd.prompts[ind]);
                        else executeCommand(cmd, ...results);
                    });
            };
            prompt(cmd.prompts[ind]);
        },
    );
    context.subscriptions.push(handle);
}

/**
 * Registers a {@link Command} with the editor. The type is taken into
 * consideration when registering. The key will be completed for use with the
 * `package.json` keys.
 *
 * Essentially differs to the following helpers based on type:
 * - `generator` -> {@link registerGeneratorCommand}
 *
 * @param context VSCode extension context
 * @param cmd Given command to register
 */
export function registerCommand(
    context: ExtensionContext,
    cmd: Command,
) {
    if (cmd.prompt) registerPromptCommand(context, cmd);
    else if (cmd.prompts) registerChainPromptCommand(context, cmd);
    else if (typeof cmd.func === 'function')
        registerGeneratorCommand(context, cmd);
    else console.error(`Invalid command "${cmd.key}"!`);
}