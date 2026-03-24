module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@':           './src',
            '@components': './src/components',
            '@screens':    './src/screens',
            '@data':       './src/data',
            '@hooks':      './src/hooks',
            '@utils':      './src/utils',
            '@constants':  './src/constants',
            '@store':      './src/store',
            '@services':   './src/services',
            '@types':      './src/types',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
