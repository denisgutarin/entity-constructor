// @ts-nocheck
// const { describe, test, expect } = require("jest");
const { createConstructor } = require("./dist/entity-constructor");

describe("Tesging library", () => {
  const template = {
    login: {
      defaultValue: "",
      valudators: [(value) => (value ? null : "Required")],
    },
    name: {
      defaultValue: "unnamed",
    },
  };
  const newUser = createConstructor(template);

  test("Entity must be defined", () => {
    const user = newUser();
    expect(user).toBeDefined();
  });

  test("Empty entity must have default values", () => {
    const user = newUser();
    expect(user.login).toBe("");
    expect(user.name).toBe("unnamed");
  });

  test("Empty login should cause validation error", () => {
    expect(newUser().errors.login).toContain("Required");
  });

  test("Entity can apply new values", () => {
    expect(newUser({ login: "login" }).login).toBe("login");
  });

  test("Entity must be copiable, with changes", () => {
    const user = newUser({ login: "login" }).with({ name: "Name" });
    expect(user.login).toBe("login");
    expect(user.name).toBe("Name");
  });
});
