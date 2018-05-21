import { resolve } from 'path';

import { runAva } from '../ava';

// mark implicit dependencies for jest
() => require('./workdir/ava.js') && require('./workdir/package.json');

const cwd = resolve(__dirname, 'workdir');

test('reports a transform error', () => {
  const { status, stderr } = runAva(cwd);

  expect: status === 1;
  expect(stderr.replace(/\n\s+at.+config.+/s, '')).toMatchSnapshot();
});
