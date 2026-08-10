const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = tseslint.config(
  { ignores: ['node_modules/**', 'lib/**', 'coverage/**'] },
  js.configs.recommended,
  {
    // Reglas con información de tipos, solo para el código fuente.
    files: ['src/**/*.ts'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-console': 'warn',
    },
  },
  {
    // Los ficheros de configuración son CommonJS y quedan fuera del programa de TS.
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        __dirname: 'readonly',
        module: 'writable',
        require: 'readonly',
      },
    },
  },
  prettierRecommended
);
