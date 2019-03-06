const util = require("../../utils/util.js");

Page({
  data: {
    codeTips: '获取验证码',
    tel: '',
    pas: '',
    share_id: '',
    code: '999999',
    checkboxFalse: false,
    timer: '', //定时器名字
    countDownNum: '60', //倒计时初始值
    openid: ''
  },
  onLoad: function(e) {
    if (!e.share_id){
      e.share_id = ''
    }
    this.setData({
      share_id: e.share_id
    })
  },
  register(e){
    wx.redirectTo({
      url: '/pages/login/login',
    })
  },
  radioChange(e) {
    this.data.checkboxFalse = !this.data.checkboxFalse
  },
  agreement(e) {
    wx.navigateTo({
      url: '/pages/register/agreement',
    })
  },
  getregister(e) {
    if (this.data.pas.length < 1) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 1000
      })
      return false
    }

    if (!this.data.checkboxFalse) {
      wx.showToast({
        title: '请同意用户协议',
        icon: 'none',
        duration: 1000
      })
      return false
    }

    util.HttpRequst(false, 'user/register', {
        tel: this.data.tel,
        password: this.data.pas,
        code: this.data.code,
        share_id: this.data.share_id,
        open_id: this.data.openid,
        head_url: wx.getStorageSync('userInfo').avatarUrl,
        nickname: wx.getStorageSync('userInfo').nickName
      }, //注册
      'POST', res => {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1000
        })
        setTimeout(res => {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }, 1000)
      });
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
          type: 1
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
  pas(e) {
    this.setData({
      pas: e.detail.value
    })
  },
  share_id(e) {
    this.setData({
      share_id: e.detail.value
    })
  },
  code(e) {
    this.setData({
      code: e.detail.value
    })
  },
  // onGoUserinfoSetting(e) {//授权判断
  //   var that = this;
  //   wx.getSetting({
  //     success(res) {
  //       if (res.authSetting['scope.userInfo']) {
  //         that.setData({
  //           authorizationFalse: false
  //         })
  //       }
  //     }
  //   })
  // },
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
  },
  onGotUserInfo(e) {
    const that = this
    wx.login({
      success: res => {
        var code = res.code;
        util.HttpRequst(true, 'user/getOpenId', { //获取openid
            code: code
          },
          'POST', res => {
            const data = res.data
            wx.getUserInfo({
              success: function(res) {
                that.setData({
                  openid: data.openId
                })
                wx.setStorage({
                  key: 'userInfo',
                  data: res.userInfo
                })
                that.getregister()
              }
            })
          });
      }
    })
  }
})