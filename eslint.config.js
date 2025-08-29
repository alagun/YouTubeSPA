import { fileURLToPath } from 'node:url'
import path from 'node:path'
import globals from 'globals'
import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/*.config.js',
      '**/*.d.ts'
    ]
  },
    js.configs.recommended,
    ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname
      }
    },
    plugins: {
      react: reactPlugin
    },
    settings:{
      react:{
        version: 'detect'
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      // // '@typescript-eslint/no-unused-vars': [
      // //   'warn',
      // //   { 
      // //     argsIgnorePattern: '^_',
      // //     varsIgnorePattern: '^_',
      // //     caughtErrorsIgnorePattern: '^_'
      // //   }
      // // ],
      // '@typescript-eslint/no-unused-vars': 'warn',
      // 'no-console': ['warn', { allow: ['warn', 'error'] }],
      // 'quotes': ['error', 'single', { avoidEscape: true }],
      // 'semi': ['error', 'always'],
      // 'indent': ['error', 2, { SwitchCase: 1 }]
      quotes: ['warn', 'single'], // Использовать одинарные кавычки
      'jsx-quotes': ['warn', 'prefer-single'], // Использовать одинарные кавычки
      'max-len': [
        'warn',
        {
          code: 140, // Максимальная длина строки для кода
          comments: 160, // Максимальная длина строки для комментариев
          ignoreTrailingComments: true, // Игнорировать длину строки для комментариев в конце строки
          ignoreComments: true, // Игнорировать длину строки для комментариев
          ignoreUrls: true, // Игнорировать длину строки для URL
          ignoreStrings: true, // Игнорировать длину строки для строковых литералов
          ignoreTemplateLiterals: true, // Игнорировать длину строки для шаблонных литералов
          ignoreRegExpLiterals: true, // Игнорировать длину строки для регулярных выражений
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Разрешены только console.warn и console.error
      'comma-dangle': ['warn', 'always-multiline'], // Висячая запятая в многострочных конструкциях
      semi: [
        'warn',
        'never',
        {
          beforeStatementContinuationChars: 'always', // Разрешает точки с запятой при необходимости
        },
      ],
      'no-trailing-spaces': ['warn'], // Удаление лишних пробелов в конце строки
      'linebreak-style': ['warn', 'unix'], // Использование Unix стиля перевода строк
      'new-parens': ['warn', 'always'], // Требует использование скобок при вызове конструктора, даже без параметров
      'prefer-const': [
        'warn',
        {
          'destructuring': 'any', // Разрешает использование const для деструктурированных переменных
          'ignoreReadBeforeAssign': false, // Требует использования const, если переменная не переопределяется
        },
      ],

      // Правила для массивов и объектов
      'array-bracket-spacing': ['warn', 'never'], // Без пробелов внутри скобок массива
      'object-curly-spacing': ['warn', 'always'], // Пробелы внутри фигурных скобок объектов
      'object-curly-newline': ['warn', { consistent: true }], // Единый стиль для переносов фигурных скобок
      'computed-property-spacing': ['warn', 'never'], // Без пробелов в вычисляемых свойствах

      // Стрелочные функции
      'arrow-parens': ['warn', 'as-needed', { requireForBlockBody: true }], // Скобки у стрелочных функций только при необходимости
      'arrow-spacing': ['warn', { before: true, after: true }], // Пробелы до и после стрелки
      'implicit-arrow-linebreak': ['warn', 'beside'], // Nребовать переносов строк после стрелки

      // Пробелы
      'space-before-blocks': ['warn', 'always'], // Пробел перед блоком
      'space-before-function-paren': [
        'warn',
        {
          anonymous: 'always', // Пробел перед анонимной функцией
          named: 'always', // Пробел перед именованной функцией
          asyncArrow: 'always', // Пробел перед стрелочной функцией с async
        },
      ],
      'space-in-parens': ['warn', 'never'], // Без пробелов внутри скобок
      'indent': ['warn', 2, { 'ignoredNodes': ['TemplateLiteral'], 'SwitchCase': 1 }], // Настройка отступов: 2 пробела, игнорирование TemplateLiteral, с отступом для SwitchCase
      'block-spacing': ['warn', 'always'], // Требовать пробелы внутри фигурных скобок
      'comma-spacing': ['warn', { 'before': false, 'after': true }], // Пробел после запятой, но не перед ней
      'func-call-spacing': ['warn', 'never'], // Запрещать пробелы перед скобками при вызове функции
      'switch-colon-spacing': ['warn', { 'after': true, 'before': false }], // Требует пробел после двоеточия, но не перед ним

      // // React и React Hooks
      // 'react-hooks/exhaustive-deps': 'warn', // Проверка зависимостей useEffect для предотвращения ошибок

      // // Импорты
      // 'import/order': [
      //   'warn',
      //   {
      //     pathGroups: [
      //       {
      //         pattern: '@src/**', // Группировка импортов из @src
      //         group: 'external', // Внешние импорты
      //         position: 'after', // Расположить после остальных
      //       },
      //     ],
      //     pathGroupsExcludedImportTypes: ['builtin'], // Исключить встроенные модули
      //   },
      // ],

      // TypeScript
      'no-unused-vars': 'off', // Отключаем стандартное правило, так как используется версия для TypeScript
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }], // Предупреждение для неиспользуемых переменных и аргументов, начинающихся с "_"

      // Пустые строки
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'return' }, // Пустая строка перед return
        { blankLine: 'always', prev: 'function', next: '*' }, // Пустая строка после функции
        { blankLine: 'always', prev: '*', next: 'function' }, // Пустая строка перед функцией
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' }, // Пустая строка после объявления переменной
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'], // Исключение для объявлений переменных подряд
        },
        { blankLine: 'always', prev: 'directive', next: '*' }, // Пустая строка после директив
        { blankLine: 'always', prev: '*', next: 'if' }, // Пустая строка перед if
        { blankLine: 'always', prev: 'if', next: '*' }, // Пустая строка после if
        { blankLine: 'always', prev: '*', next: 'for' }, // Пустая строка перед for
        { blankLine: 'always', prev: '*', next: 'while' }, // Пустая строка перед while
        { blankLine: 'always', prev: 'block-like', next: '*' }, // Пустая строка после блочного выражения
        { blankLine: 'always', prev: '*', next: 'block-like' }, // Пустая строка перед блочным выражением
        { blankLine: 'always', prev: '*', next: 'cjs-export' }, // Пустая строка перед CommonJS экспортом
      ],
      'lines-between-class-members': ['warn', 'always'], // Требует пустую строку между методами класса

      // Прочее
      'id-match': ['error', '^[a-zA-Z_0-9]*$'], // Идентификаторы должны соответствовать шаблону
      'no-warning-comments': ['error', { terms: ['fixme'], location: 'start' }], // Запрет комментариев с "fixme"
    }
  }
)