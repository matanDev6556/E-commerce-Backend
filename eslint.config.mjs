import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node, // הוספת משתני הגלובל של Node.js
        ...globals.browser,
      },
    },
  },
  pluginJs.configs.recommended,
];
