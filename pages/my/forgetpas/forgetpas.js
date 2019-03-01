const util = require("../../../utils/util.js");

Page({
  data: {
    tel: '',
    code: '999999',
    password: '',
    codeTips: '获取验证码',

    timer: '', //定时器名字
    countDownNum: '60' //倒计时初始值
  },
  onLoad: function(e) {

  },
  getcode(e) {
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
    if (this.data.countDownNum == 60) {
      util.PublickHttpRequst(false, 'code/send', {
          tel: this.data.tel,
          type: 2
        }, //获取验证码
        'POST', res => {
          wx.showToast({
            title: res.message,
            icon: 'success',
            duration: 1000
          })
          that.countDown();
        });
    } else {
      wx.showToast({
        title: '请60s后在获取验证码',
        icon: 'none',
        duration: 1000
      })
    }
  },
  tel(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  code(e) {
    this.setData({
      code: e.detail.value
    })
  },
  password(e) {
    this.setData({
      password: e.detail.value
    })
  },
  sureClick(e) {
    const that = this

    if (this.data.tel == '') {
      wx.showToast({
        title: '请输入电话号码',
        icon: 'none',
        duration: 1000
      })
      return false
    }

    if (this.data.code == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 1000
      })
      return false
    }

    if (this.data.password == '') {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none',
        duration: 1000
      })
      return false
    }

    util.UserHttpRequst(true, 'user/resetPwd', {
        tel: this.data.tel,
        code: this.data.code,
        password: this.data.password
      },
      'POST', res => {
        const data = res
        setTimeout(res => {
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 1000
          })
          if( data.status == 200 ){
            wx.navigateBack()
          }
        }, 500)
      });
  },
  countDown(e) {
    let that = this;
    let countDownNum = that.data.countDownNum;
    that.setData({
      timer: setInterval(function() {
        countDownNum--;
        that.setData({
          countDownNum: countDownNum,
          codeTips: countDownNum + 's'
        })
        if (countDownNum == 0) {
          clearInterval(that.data.timer);
          that.setData({
            countDownNum: '60',
            codeTips: '获取验证码'
          })
        }
      }, 1000)
    })
  }
})