const util = require("../../utils/util.js");

Page({
  data: {
    tel: '',
    pas: '',
  },
  onLoad: function (options) {
    
  },
  forget(e){
    wx.navigateTo({
      url: '/pages/my/forgetpas/forgetpas',
    })
  },
  login(e) {
    const that = this
    const myreg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (this.data.tel.length < 11) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 1000
      })
      return false
    }

    if (!myreg.test(this.data.tel)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 1000
      })
      return false
    }

    if (this.data.tel.pas < 1) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 1000
      })
      return false
    }

    util.HttpRequst(false, 'user/login', {
      tel: this.data.tel,
      password: this.data.pas
    },//登录
    'POST', res => {
      wx.showToast({
        title: res.message,
        icon: 'success',
        duration: 1000
      })
      if( res.status == 200 ){
        wx.setStorage({
          key: 'userInfo-login',
          data: res.data
        })
        wx.switchTab({
          url: '/pages/index/home/home'
        })
      }
    });
  },
  tel(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  pas(e) {
    this.setData({
      pas: e.detail.value
    })
  },
  register(e){ //注册
    wx.navigateTo({
      url: '/pages/register/register',
    })
  }
})