var path = require('path');
module.exports = {
  entry: {
  	'index1':'./src/index1.js'
  },
  output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].build.js"
  }
};