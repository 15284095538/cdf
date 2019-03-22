const util = require("../../../utils/util.js");

Page({
  data: {
    oldPassword: '',
    password: '',
    password2: ''
  },
  onLoad: function (e) {

  },
  password1(e){
    this.setData({
      oldPassword: e.detail.value
    })
  },
  password2(e) {
    this.setData({
      password: e.detail.value
    })
  },
  password3(e) {
    this.setData({
      password2: e.detail.value
    })
  },
  sureClick(e) {
    const that = this

    if (this.data.oldPassword == '') {
      wx.showToast({
        title: '请输入旧密码',
        icon: 'none',
        duration: 2000
      })
      return false
    }

    if (this.data.password == '') {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none',
        duration: 2000
      })
      return false
    }

    if (this.data.password2 == '') {
      wx.showToast({
        title: '请再次输入新密码',
        icon: 'none',
        duration: 2000
      })
      return false
    }

    util.UserHttpRequst(true, 'user/updatePwd', {
      oldPassword: this.data.oldPassword,
      password: this.data.password,
      password2: this.data.password2
    },
    'POST', res => {
      const data = res
      wx.showToast({
        title: data.message,
        icon: 'none',
        duration: 2000
      })
      if (data.status == 200) {
        wx.navigateBack()
      }
    });
  }
})