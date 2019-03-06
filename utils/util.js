const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


const publickbaseUrl = "https://cdf.mmqo.com/";//公告测试环境

const baseUrl = "https://cdf.mmqo.com/api/";//测试环境

function UserHttpRequst(loading, url, params, method, callBack) {// 用户token request封装
  if (loading == true) {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
  }
  wx.request({
    url: baseUrl + url,
    data: params,
    dataType: "json",
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      'user-token': wx.getStorageSync('userInfo-login')['user-token']
    },
    method: method,
    success: function (res) {
      if (loading == true) {
        wx.hideToast();//隐藏提示框
      }
      //console.log(res.data);
      callBack(res.data);
      if (res.data.status == 440 ){
        wx.showToast({
          title: '登录失效，请重新登录',
          icon: 'none',
          duration: 1000,
          success(res){
            setTimeout(res=>{
              wx.redirectTo({
                url: '/pages/login/login',
              })
            },1000)
          }
        })
      }
    },
    complete: function () {
      if (loading == true) {
        wx.hideToast();//隐藏提示框
      }
    }
  })
}


function HttpRequst(loading, url, params, method, callBack) {// request封装
  if (loading == true) {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
  }
  wx.request({
    url: baseUrl + url,
    data: params,
    dataType: "json",
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    method: method,
    success: function (res) {
      if (loading == true) {
        wx.hideToast();//隐藏提示框
      }
      //console.log(res.data);
      callBack(res.data);
    },
    complete: function () {
      if (loading == true) {
        wx.hideToast();//隐藏提示框
      }
    }
  })
}

function PublickHttpRequst(loading, url, params, method, callBack) {// request封装
  if (loading == true) {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
  }
  wx.request({
    url: publickbaseUrl + url,
    data: params,
    dataType: "json",
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    method: method,
    success: function (res) {
      if (loading == true) {
        wx.hideToast();//隐藏提示框
      }
      //console.log(res.data);
      callBack(res.data);
    },
    complete: function () {
      if (loading == true) {
        wx.hideToast();//隐藏提示框
      }
    }
  })
}

module.exports = {
  formatTime: formatTime,
  HttpRequst: HttpRequst,
  PublickHttpRequst: PublickHttpRequst,
  UserHttpRequst: UserHttpRequst,
  baseUrl: baseUrl
}