'use strict';

module.exports = function() {
  const plugins = [
    require.resolve('babel-plugin-transform-es3-member-expression-literals'),
    require.resolve('babel-plugin-transform-es3-property-literals'),
    require.resolve('babel-plugin-transform-object-assign'),
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-transform-object-rest-spread'),
    require.resolve('babel-plugin-add-module-exports'),
    [
      require.resolve('babel-plugin-transform-runtime'),
      {
        polyfill: false
      }
    ]
  ];
  return {
    presets: [require.resolve('babel-preset-react'), require.resolve('babel-preset-env')],
    plugins
  };
};
