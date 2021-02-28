type Key = string | symbol | number;
type State = Record<Key, unknown>;

type ValidationError = string | null | undefined;

type Validator<S extends State, K extends Key> = (
  value: S[K],
  state: S
) => ValidationError;

type TemplateOptions<S extends State, K extends Key> = {
  defaultValue: S[K];
  valudators?: Validator<S, K>[];
};

export type Template<S extends State> = {
  [K in keyof S]: TemplateOptions<S, K>;
};

const getKeys = <T extends {}>(object: T): (keyof T)[] =>
  Object.keys(object) as (keyof T)[];
const fromEntries = <T extends {}>(entries: [keyof T, T[keyof T]][]): T =>
  Object.fromEntries(entries) as T;
const notNull = <T>(value: T | null | undefined): value is T => !!value;

export const createConstructor = <S extends State>(
  template: Template<S>,
  transformFunction?: (oldState: S) => S
) => {
  const defaultValues = fromEntries(
    getKeys(template).map<[keyof S, S[keyof S]]>((key) => {
      return [key, template[key].defaultValue];
    })
  );

  const constr = (state?: Partial<S>) => {
    const stateWithDefaults = { ...defaultValues, ...state };
    const transformedState = transformFunction
      ? transformFunction(stateWithDefaults)
      : stateWithDefaults;

    const normalizedState = fromEntries(
      getKeys(template).map<[keyof S, S[keyof S]]>((key) => {
        const value = transformedState[key];
        return [key, typeof value === "undefined" ? defaultValues[key] : value];
      })
    );

    const errors = fromEntries<Record<keyof S, string[]>>(
      getKeys(template)
        .map<[keyof S, string[]]>((key) => {
          const validators = template[key].valudators ?? [];
          const fieldErrors = validators
            .map((validator) =>
              validator(normalizedState[key], normalizedState)
            )
            .filter(notNull);
          return [key, fieldErrors];
        })
        .filter((entity) => entity[1]?.length)
    );

    return Object.freeze({
      ...normalizedState,
      with: (partial: Partial<State>) =>
        constr({ ...normalizedState, ...partial }),
      errors,
    });
  };

  return constr;
};
