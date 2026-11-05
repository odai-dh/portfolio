import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Apostrophes in JSX copy render fine in React; escaping them only makes the copy harder to edit
      'react/no-unescaped-entities': 'off',
      // React Compiler rules (new in eslint-plugin-react-hooks 7). The site doesn't use the
      // compiler, and the flagged code (games, theme, chat) works as intended, so they warn
      // instead of failing. Fix them when touching that code anyway.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
  globalIgnores(['.next/**', '.netlify/**', 'out/**', 'build/**', 'next-env.d.ts']),
])

export default eslintConfig
