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


import axios from 'axios'
import qs from 'qs'
import stores from '../store/store'
import jsonpAdapter from 'axios-jsonp'

//拦截所有axios请求，在请求前都有显示loading的动作，这里使用了vuex分发
axios.interceptors.request.use(config => {
  //显示loading
 stores.dispatch('setLoading',true)
 return config
}, error => {
  return Promise.reject(error)
})

//拦截所有axios响应，收到响应隐藏loading，这里也使用了vuex分发
axios.interceptors.response.use(reponse=>{
  stores.dispatch('setLoading',false)
 return reponse
},error=>{
  return Promise.reject(error.response)
})


let httpServer = (opts,data)=>{

  let httpDefaultOpts = {
    method: opts.method,
    baseURL: opts.baseURL || CTX,
    url: opts.url,
    adapter: jsonpAdapter,
    timeout: 30000,
    params: data,
    data: qs.stringify(data),

    headers: opts.method == 'get'?{
      'X-Requested-With': 'XMLHttpRequest',
      "Accept": "application/json",
      "Content-Type": "application/json; charset=UTF-8"
 }:{
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
 }
  }

 if(opts.method == 'post'){
    delete httpDefaultOpts.params

 }
  else{
    delete httpDefaultOpts.data
 }
  if(opts.method != 'jsonp'){
    delete httpDefaultOpts.adapter
 }
  let promise = new Promise((resolve,reject)=>{
    axios(httpDefaultOpts).then(res=>{
      resolve(res)
 }).catch(response=>{
      reject(response)
 })
 })
 return promise
}


let http = {
  dispatch(opts,data,method) {
    return httpServer(Object.assign(opts,{
      [typeof opts === 'string'?'url':'']: opts,
      method:method
 }),data)
 },
  post(opts,data){
    return this.dispatch(opts,data,'post')
 },
  get(opts,data){
    return this.dispatch(opts,data,'get')
 },
  jsonp(opts,data) {
    return this.dispatch(opts,data,'jsonp')
 }
}

export default http

 
