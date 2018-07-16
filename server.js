const devServer = require('./build/dev-server'); //得到客户端bundle 服务端bundle 和模板
const express = require('express');
const app = express();
const vueRenderer = require('vue-server-renderer')
const path = require('path');
const fs  =require('fs')
const ejs = require('ejs')

app.get('*', async (req, res) => {


  res.status(200);
  res.setHeader('Content-Type', 'text/html;charset=utf-8;')

  devServer(async function(serverBundle,clientBundle,template){
    let renderer = vueRenderer.createBundleRenderer(serverBundle,{
      inject:false,   //用ejs就设置就这个   默认inject  true的话  要按照他的模板来插入的。
      //template,
      clientManifest: clientBundle.data,
      runInNewContext: false
    })


    let context = { url: req.url }// context.renderStyles() 如何来的。
    //console.log(context)

    // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。现在我们的服务器与应用程序已经解耦！
    //{ url: req.url }   会通过 webpack.server.conf.js 传到 entry-server.js
    // renderer.renderToString(context).then((html) => {
    //     //console.log(html)
    //   res.end(html)
    // }).catch(err => console.log(err))
    

    try{
      const appString = await renderer.renderToString(context)
      const html = ejs.render(template, {
        appString,
        style: context.renderStyles(),  // context.renderStyles()  获取带有style标签的插入减去  不知跟上面的 context有什么关系
        scripts: context.renderScripts()
      })

      res.end(html)
    }catch(err){
      console.log(err)
    }
  })

})

app.listen(5000, () => {
  console.log('启动成功')
})
