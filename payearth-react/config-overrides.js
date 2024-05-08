// const webpackConfig = require("./webpack.config");

// module.exports = function override(config, env) {
//   let loaders = config.resolve;
//   loaders.fallback = {
//     fs: false,
//     tls: false,
//     net: false,
//     http: require.resolve("stream-http"),
//     https: false,
//     zlib: require.resolve("browserify-zlib"),
//     path: require.resolve("path-browserify"),
//     stream: require.resolve("stream-browserify"),
//     util: require.resolve("util/"),
//     crypto: require.resolve("crypto-browserify"),
//     querystring: require.resolve("querystring-es3"),
//     assert: require.resolve("assert/"),
//     process: require.resolve("process/browser"),
//   };

//   return config;
// };

//***************************************************************** */

// const webpackConfig = require("./webpack.config");
// const webpack = require("webpack");

// module.exports = function override(config, env) {
//   let loaders = config.resolve;
//   loaders.fallback = {
//     fs: false,
//     tls: false,
//     net: false,
//     http: require.resolve("stream-http"),
//     https: false,
//     zlib: require.resolve("browserify-zlib"),
//     path: require.resolve("path-browserify"),
//     stream: require.resolve("stream-browserify"),
//     util: require.resolve("util/"),
//     crypto: require.resolve("crypto-browserify"),
//     querystring: require.resolve("querystring-es3"),
//     assert: require.resolve("assert/"),
//     process: require.resolve("process/browser"),
//   };
//   return config;
// };

//*********************************************** */

// const webpack = require("webpack");

// module.exports = function override(config) {
//   const fallback = config.resolve.fallback || {};
//   Object.assign(fallback, {
//     zlib: require.resolve("browserify-zlib"),
//     querystring: require.resolve("querystring-es3"),
//     path: require.resolve("path-browserify"),
//     crypto: require.resolve("crypto-browserify"),
//     fs: false,
//     stream: require.resolve("stream-browserify"),
//     http: require.resolve("stream-http"),
//     net: false,
//     assert: require.resolve("assert/"),
//   });

//   config.resolve.fallback = fallback;
//   config.plugins = (config.plugins || []).concat([
//     new webpack.ProvidePlugin({
//       process: "process/browser",
//     }),
//   ]);
//   return config;
// };

//************************************************************* */
const webpack = require("webpack");
// const webpack = require("webpack");
// const isNode =
//   typeof process !== "undefined" &&
//   process.versions != null &&
//   process.versions.node != null;

module.exports = function override(config, env) {
  config.resolve.fallback = {
    fs: false,
    tls: false,
    net: false,
    http: require.resolve("stream-http"),
    https: false,
    zlib: require.resolve("browserify-zlib"),
    path: require.resolve("path-browserify"),
    stream: require.resolve("stream-browserify"),
    util: require.resolve("util/"),
    crypto: require.resolve("crypto-browserify"),
    querystring: require.resolve("querystring-es3"),
    assert: require.resolve("assert"),
    vm: require.resolve("vm-browserify"),
    buffer: require.resolve("buffer"),

    // process: require.resolve("process/browser"),
  };

  // loaders.fallback = loaders;

  // if (isNode) {
  //   fallback.process = require.resolve("process/browser");
  // }

  // loaders.fallback = fallback;

  // config.resolve.fallback = fallback;
  // config.plugins = (config.plugins || []).concat([
  //   new webpack.ProvidePlugin({
  //     process: "process/browser",
  //   }),
  // ]);

  //*****************
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  );

  //************/
  //  if (typeof process !== "undefined" && process.versions != null && process.versions.node != null) {
  // config.plugins = (config.plugins || []).concat([
  //   new webpack.ProvidePlugin({
  //     process: "process/browser",
  //   }),
  // ]);
  // }
  config.module.rules.unshift({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false, // disable the behavior
    },
  });
  return config;
};
