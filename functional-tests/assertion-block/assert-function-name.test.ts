import { transform, TransformOptions } from '@babel/core';
import { Config, minimalConfig } from '@spockjs/config';

import plugin from '@spockjs/babel-plugin-spock';

const config: Config = { ...minimalConfig, assertFunctionName: 'check' };
const babelOpts = (config: Config) =>
  ({
    plugins: [[plugin, config]],
    filename: 'test.js',
    configFile: false,
  } as TransformOptions);

test('generates specified assert function', () => {
  const { code } = transform(`expect: 1 === 1;`, babelOpts(config));
  expect(code).toMatchSnapshot();
});

test('generates import with specified name when autoImport is set', () => {
  const { code } = transform(
    `expect: 1 === 1;`,
    babelOpts({ ...config, autoImport: true }),
  );
  expect(code).toMatchSnapshot();
});

test('renames conflicting bindings when autoImporting', () => {
  const { code } = transform(
    `let check;
    expect: 1 === 1;`,
    babelOpts({ ...config, autoImport: true }),
  );
  expect(code).toMatchSnapshot();
});

test('does not rename non-conflicting bindings of the same name', () => {
  const { code } = transform(
    `{
      let check;
    }
    expect: 1 === 1;`,
    babelOpts({ ...config, autoImport: true }),
  );
  expect(code).toMatchSnapshot();
});
