const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './src/index.js', // Точка входа
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Обрабатываем .js и .jsx файлы
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', ["@babel/preset-react", {"runtime": "automatic"}]],
          },
        },
      },
      {
        test: /\.css$/, // Поддержка CSS (если понадобится)
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Поддержка .js и .jsx
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Шаблон HTML
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./public/images/", to: "./images" },
      ],
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000, // Локальный сервер на порту 3000
    historyApiFallback: true, // Перенаправляет все запросы на index.html
  },
  mode: 'development', // Режим разработки
};
