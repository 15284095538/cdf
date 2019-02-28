const util = require("../../../../utils/util.js");


Page({
  data: {
    id: '',
    info: []
  },
  onLoad: function (e) {
    this.setData({
      id: e.id
    })
    this.getdata()
  },
  del(e) { //删除订单
    const that = this
    let id = e.currentTarget.dataset.id
    util.UserHttpRequst(true, 'order/del', {
      id: id
    },
      'POST', res => {
        if (res.status == 200) {
          var message = res.message
          setTimeout(res => {
            wx.showToast({
              title: message,
              icon: 'none',
              duration: 1000,
              success(e) {
                setTimeout(res => {
                  wx.navigateBack()
                }, 200)
              }
            })
          }, 1000)
        }
      });
  },
  cancel(e) { //取消订单
    const that = this
    let id = e.currentTarget.dataset.id
    util.UserHttpRequst(true, 'order/cancel', {
      id: id
    },
      'POST', res => {
        if (res.status == 200) {
          var message = res.message
          setTimeout(res => {
            wx.showToast({
              title: message,
              icon: 'none',
              duration: 1000,
              success(e) {
                setTimeout(res => {
                  that.getdata()
                }, 200)
              }
            })
          }, 1000)
        }
      });
  },
  toPay(e) { //支付
    const that = this
    let id = e.currentTarget.dataset.id
    util.UserHttpRequst(true, 'order/toPay', {
      id: id
    },
      'POST', res => {
        wx.requestPayment({ //微信支付
          timeStamp: res.payInfo.timestamp,
          nonceStr: res.payInfo.nonceStr,
          package: res.payInfo.package,
          signType: res.payInfo.signType,
          paySign: res.payInfo.paySign,
          success(res) {
            that.getdata()
          },
          fail(res) {
            that.getdata()
          }
        })
      });
  },
  take(e) { //确定收货
    const that = this
    let id = e.currentTarget.dataset.id
    util.UserHttpRequst(true, 'order/take', {
      id: id
    },
      'POST', res => {
        if (res.status == 200) {
          var message = res.message
          setTimeout(res => {
            wx.showToast({
              title: message,
              icon: 'none',
              duration: 1000,
              success(e) {
                setTimeout(res => {
                  that.getdata()
                }, 200)
              }
            })
          }, 1000)
        }
      });
  },
  getdata(e) {
    const that = this
    util.UserHttpRequst(true, 'order/info', { //消息列表
      id: this.data.id
    },
      'GET', res => {
        that.setData({
          info: res.data,
        })
      });
  }
})