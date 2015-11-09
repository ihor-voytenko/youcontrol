var path = require('path');

module.exports = {
  entry: './js/index.jsx',
  output: {
    filename: 'bundle.js', //this is the default name, so you can skip it
    //at this directory our bundle file will be available
    //make sure port 8090 is used when launching webpack-dev-server
    publicPath: 'http://localhost:8090/assets',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
      {
        //tell webpack to use jsx-loader for all *.jsx files
        test: /\.jsx$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        loader: 'jsx-loader?insertPragma=React.DOM&harmony'
      }
    ]
  },
  externals: {
    //don't bundle the 'react' npm package with our bundle.js
    //but get it from a global 'React' variable
    //'react': 'React'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}