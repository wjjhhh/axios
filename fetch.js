/**
 * Created by Stone Cold on 2017/12/7.
 */
import axios from 'axios'
import qs from 'qs'
import stores from '../store/store'
import jsonpAdapter from 'axios-jsonp'

axios.interceptors.request.use(config => {
  //显示loading
  stores.dispatch('setLoading',true)
  return config
}, error => {
  return Promise.reject(error)
})

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
