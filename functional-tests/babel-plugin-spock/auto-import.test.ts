import { transform } from '@babel/core';
import { AssertionError } from 'power-assert';

import plugin from '@spockjs/babel-plugin-spock';
import { Config, minimalConfig } from '@spockjs/config';

test('makes a manual import superfluous', () => {
  const { code } = transform(`expect: 1 === 2;`, {
    plugins: [
      [plugin, { ...minimalConfig, autoImport: true } as Config],
      '@babel/plugin-transform-modules-commonjs',
    ],
  });
  expect(() => new Function('require', code as string)(require)).toThrow(
    AssertionError,
  );
});

test('does not clash with an existing "_assert" import', () => {
  const { code } = transform(
    `import _assert from 'fs';
    expect: 1 === 2;`,
    {
      plugins: [
        [plugin, { ...minimalConfig, autoImport: true } as Config],
        '@babel/plugin-transform-modules-commonjs',
      ],
    },
  );
  expect(() => new Function('require', code as string)(require)).toThrow(
    AssertionError,
  );
});

test('does not clash with an existing "_assert" identifier in another scope after adding an import', () => {
  const { code } = transform(
    `expect: 1 === 1;
    {
      let _assert;
      expect: 1 === 2;
    }`,
    {
      plugins: [
        [plugin, { ...minimalConfig, autoImport: true } as Config],
        '@babel/plugin-transform-modules-commonjs',
      ],
    },
  );
  expect(() => new Function('require', code as string)(require)).toThrow(
    AssertionError,
  );
});

test('imports from a custom source', () => {
  const { code } = transform(`expect: 1 === 2;`, {
    plugins: [
      [plugin, { ...minimalConfig, autoImport: 'fancy-assert' } as Config],
      '@babel/plugin-transform-modules-commonjs',
    ],
  });

  const customRequire = (name: string) =>
    name === 'fancy-assert' ? require('power-assert') : undefined;

  expect(() => new Function('require', code as string)(customRequire)).toThrow(
    AssertionError,
  );
});

test('uses an existing default import', () => {
  const { code } = transform(
    `import fancyAssert from 'power-assert';
    expect: 1 === 2;`,
    {
      plugins: [
        [plugin, { ...minimalConfig, autoImport: true } as Config],
        '@babel/plugin-transform-modules-commonjs',
      ],
    },
  );

  const customRequire = jest.fn(require);
  expect(() => new Function('require', code as string)(customRequire)).toThrow(
    AssertionError,
  );
  expect(customRequire).toHaveBeenCalledTimes(1);
});

test('does not attempt to use an existing named import', () => {
  const { code } = transform(
    `import { fancyAssert } from 'power-assert';
    expect: 1 === 2;`,
    {
      plugins: [
        [plugin, { ...minimalConfig, autoImport: true } as Config],
        '@babel/plugin-transform-modules-commonjs',
      ],
    },
  );
  expect(() => new Function('require', code as string)(require)).toThrow(
    AssertionError,
  );
});

test('does not attempt to use a shadowed existing default import', () => {
  const { code } = transform(
    `import fancyAssert from 'power-assert';
    {
      let fancyAssert;
      expect: 1 === 2;
    }`,
    {
      plugins: [
        [plugin, { ...minimalConfig, autoImport: true } as Config],
        '@babel/plugin-transform-modules-commonjs',
      ],
    },
  );
  expect(() => new Function('require', code as string)(require)).toThrow(
    AssertionError,
  );
});

test('reuses the same import for multiple assertions', () => {
  const { code } = transform(
    `expect: 1 === 1;
    expect: 2 === 2;`,
    {
      plugins: [
        [plugin, { ...minimalConfig, autoImport: true } as Config],
        '@babel/plugin-transform-modules-commonjs',
      ],
    },
  );

  const customRequire = jest.fn(require);
  new Function('require', code as string)(customRequire);
  expect(customRequire).toHaveBeenCalledTimes(1);
});

test('reuses the same import for multiple assertions in nested scopes', () => {
  const { code } = transform(
    `(() => {
      expect: 1 === 1;
      expect: 2 === 2;
    })()`,
    {
      plugins: [
        [plugin, { ...minimalConfig, autoImport: true } as Config],
        '@babel/plugin-transform-modules-commonjs',
      ],
    },
  );

  const customRequire = jest.fn(require);
  new Function('require', code as string)(customRequire);
  expect(customRequire).toHaveBeenCalledTimes(1);
});