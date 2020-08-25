var path = require('path');
var HtmlWebpackPlugin =  require('html-webpack-plugin');

module.exports = {
    entry : {
      home: './src/home/index.js',
      game: './src/game/index.js'
    },
    output : {
        path : path.resolve(__dirname , 'dist'),
        filename: '[name]_bundle.js'
    },
    module : {
        rules : [
            {test : /\.(js)$/, use:'babel-loader'},
            {test : /\.css$/, use:['style-loader', 'css-loader']}
        ]
    },
    mode:'development',
    plugins : [
        new HtmlWebpackPlugin ({
          hash: true,
          title: 'Title for index',
          template : 'src/index.html',
          chunks: ['home'],
          filename: 'home.html',
        }),
        new HtmlWebpackPlugin ({
          hash: true,
          title: 'Title for game',
          template : 'src/index.html',
          chunks: ['game'],
          filename: 'game.html',
        }),
    ],
    devServer: {
      contentBase: [path.join(__dirname, 'dist'), path.join(__dirname, 'static')],
      port: 3000,
      proxy: {
        '*': 'http://localhost:4001',
      }
    }
}
