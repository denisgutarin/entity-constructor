"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConstructor = void 0;
const getKeys = (object) => Object.keys(object);
const fromEntries = (entries) => Object.fromEntries(entries);
const notNull = (value) => !!value;
const createConstructor = (template, transformFunction) => {
    const defaultValues = fromEntries(getKeys(template).map((key) => {
        return [key, template[key].defaultValue];
    }));
    const constr = (state) => {
        const stateWithDefaults = Object.assign(Object.assign({}, defaultValues), state);
        const transformedState = transformFunction
            ? transformFunction(stateWithDefaults)
            : stateWithDefaults;
        const normalizedState = fromEntries(getKeys(template).map((key) => {
            const value = transformedState[key];
            return [key, typeof value === "undefined" ? defaultValues[key] : value];
        }));
        const errors = fromEntries(getKeys(template)
            .map((key) => {
            var _a;
            const validators = (_a = template[key].valudators) !== null && _a !== void 0 ? _a : [];
            const fieldErrors = validators
                .map((validator) => validator(normalizedState[key], normalizedState))
                .filter(notNull);
            return [key, fieldErrors];
        })
            .filter((entity) => { var _a; return (_a = entity[1]) === null || _a === void 0 ? void 0 : _a.length; }));
        return Object.freeze(Object.assign(Object.assign({}, normalizedState), { with: (partial) => constr(Object.assign(Object.assign({}, normalizedState), partial)), errors }));
    };
    return constr;
};
exports.createConstructor = createConstructor;
