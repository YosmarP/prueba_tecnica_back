import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { 
    files: ["**/*.js"], 
    languageOptions: { 
      sourceType: "commonjs",
      globals: {
        ...globals.browser, 
        ...globals.node,
        jest: true, // Añadir esta línea
        describe: true,
        beforeAll: true,
        beforeEach: true,
        afterAll: true,
        it: true,
        expect: true,
      },
    },
    rules: {
      "no-console": "warn", 
    },
  },
  pluginJs.configs.recommended,
];