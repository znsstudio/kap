const {join: pathJoin, resolve: resolvePath} = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

function joinPath(...paths) {
  return pathJoin(...paths);
}

const SRC_MAIN = joinPath(__dirname, 'app', 'src', 'main');
const SRC_RENDERER = joinPath(__dirname, 'app', 'src', 'renderer');
const SRC_RENDERER_JS = joinPath(SRC_RENDERER, 'js');
const SRC_RENDERER_VIEWS = joinPath(SRC_RENDERER, 'views');

module.exports = {
  node: {
    __dirname: false
  },
  target: 'electron',
  entry: {
    main: joinPath(SRC_MAIN, 'index.js'),
    'main-renderer': joinPath(SRC_RENDERER_JS, 'main.js'),
    cropper: joinPath(SRC_RENDERER_JS, 'cropper.js'),
    editor: joinPath(SRC_RENDERER_JS, 'editor.js'),
    preferences: joinPath(SRC_RENDERER_JS, 'editor.js')
  },
  output: {
    path: joinPath('app', 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: SRC_RENDERER,
        exclude: [
          resolvePath('node_modules'),
          resolvePath('app', 'node_modules')
        ],
        loader: 'babel-loader'
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.css$/,
        include: SRC_RENDERER,
        use: [
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [
                  require('postcss-import'),
                  require('postcss-simple-vars'),
                  require('postcss-extend'),
                  require('postcss-nested'),
                  require('cssnano'),
                  require('postcss-reporter')()
                ];
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'cropper.html',
      template: joinPath(SRC_RENDERER_VIEWS, 'cropper.pug')
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'editor.html',
      template: joinPath(SRC_RENDERER_VIEWS, 'editor.pug')
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'main.html',
      template: joinPath(SRC_RENDERER_VIEWS, 'main.pug')
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'preferences.html',
      template: joinPath(SRC_RENDERER_VIEWS, 'preferences.pug')
    })
  ]
};
