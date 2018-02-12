# axios
axios二次封装
为什么使用axios
1.因为vue-resource后期已经没团队维护，而且只适合跑在浏览器环境，而axios在node和浏览器都通用，api一致
2.axios是基于promise 的 HTTP 库
3.上手简单


新建一个fetch.js，先npm(cnpm) 几个模块，包括axios,qs,axios-jsonp
axios默认是 json 格式提交,确认后台是否做了对应的支持;
若是只能接受传统的表单序列化,就需要自己写一个转义的方法...
当然还有一个更加省事的方案,装一个小模块qs
 
