const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const babel = require('@babel/core')
const less = require('less')

module.exports = {
  mode:'development',
  watch:true,
  entry:'./src/app.js',
  output:{
    path:path.resolve(__dirname,'dist')
  },
  plugins:[
    new CopyWebpackPlugin({
      patterns:[
        {from:'**/*.json',to:'./',context:'./src'},
        {from:'**/*.wxml',to:'./',context:'./src'},
        {from:'**/*.wxss',to:'./',context:'./src'},
        {from:'**/*.jpg',to:'./',context:'./src'},
        {from:'**/*.png',to:'./',context:'./src'},
        {from:'**/*.css',to:'./',context:'./src'},

        {
          from:'**/*.js',
          to:'./',
          context:'./src',
          transform(content,path){
            const newCode = babel.transformSync(content,{
              babelrc:true,
              'presets':['@babel/env']
            }).code
            return Promise.resolve(newCode.toString())
          },
          globOptions:{
            ignore:['**.test.js']
          }
        },

        {
          from:'**/*.less',
          context:'./src',
          to({context,absoluteFilename}){
            const sourceRelPath = path.relative(context,absoluteFilename)
            const destRelPath = path.dirname(sourceRelPath)
            return path.join(destRelPath,'[name].wxss')
          },
          transform(content,path){
            return less.render(content.toString())
              .then(function(output){
                return output.css
              })
          }
        }

      ]
    })
  ]

}

