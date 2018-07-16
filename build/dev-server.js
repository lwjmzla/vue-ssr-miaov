const serverConf = require('./webpack.server.conf');

const webpack = require('webpack')
const fs  =require('fs')
const path = require('path');
const Mfs = require('memory-fs')
const axios = require('axios')

module.exports = (cb) => {
  
  const webpackComplier = webpack(serverConf);

  var mfs = new Mfs();
  webpackComplier.outputFileSystem = mfs;//把生成的文件传进内存中

  //也是热更新用的
webpackComplier.watch({}, async (error, stats) => {
    if (error) return console.log(error);
    //有些错误不在上面出现例如es-lint所以用下面的
    stats = stats.toJson();
    stats.errors.forEach(err => console.log(err))
    stats.warnings.forEach(err => console.log(err))

    // server Bundle json文件
    let serverBundlePath = path.join(
      serverConf.output.path,
      'vue-ssr-server-bundle.json'
    )

    let serverBundle = JSON.parse(mfs.readFileSync(serverBundlePath, "utf-8"))

    //console.log(serverBundle)

    // client Bundle json文件
    let clientBundle = await axios.get('http://localhost:8080/vue-ssr-client-manifest.json')
    //console.log(clientBundle)
    // 模板

    //let template = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
    let template = fs.readFileSync(
      path.join(__dirname,'..', 'server.template.ejs'),
      'utf-8'
    )

    //回调函数
    cb(serverBundle, clientBundle,template)

  })
}