module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 6,
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: ['@babel/plugin-proposal-object-rest-spread'],
  env: {
    test: {
      plugins: [
        [
          '@spockjs/babel-plugin-spock',
          { presets: ['@spockjs/preset-runner-jest'] },
        ],
      ],
    },
  },
};
