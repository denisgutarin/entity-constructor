declare type Key = string | symbol | number;
declare type State = Record<Key, unknown>;
declare type ValidationError = string | null | undefined;
declare type Validator<S extends State, K extends Key> = (value: S[K], state: S) => ValidationError;
declare type TemplateOptions<S extends State, K extends Key> = {
    defaultValue: S[K];
    valudators?: Validator<S, K>[];
};
export declare type Template<S extends State> = {
    [K in keyof S]: TemplateOptions<S, K>;
};
export declare const createConstructor: <S extends Record<string | number | symbol, unknown>>(template: Template<S>, transformFunction?: ((oldState: S) => S) | undefined) => (state?: Partial<S> | undefined) => Readonly<S & {
    with: (partial: Partial<State>) => Readonly<S & any>;
    errors: Record<keyof S, string[]>;
}>;
export {};
