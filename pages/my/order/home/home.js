const util = require("../../../../utils/util.js");


Page({
  data: {
    nav: [{
        txt: '全部',
        status: ''
      },
      {
        txt: '待付款',
        status: 10
      },
      {
        txt: '待发货',
        status: 20
      },
      {
        txt: '待收货',
        status: 30
      },
      {
        txt: '已完成',
        status: 40
      }
    ],
    navIndex: 0,
    orderlist: [],
    pagemore: true,
    page: 1,
    status:''
  },
  onLoad(e) {
    this.setData({
      status: e.status,
      navIndex: e.index
    })
    this.getdata()
  },
  onReachBottom(e) {
    if (this.data.pagemore) {
      this.data.page++
        this.getdata()
    }
  },
  details(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/my/order/details/details?id=' + id,
    })
  },
  navClick(e) {
    this.setData({
      navIndex: e.currentTarget.dataset.index,
      status: e.currentTarget.dataset.status,
      page: 1
    })
    this.getdataTab();
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
              duration: 2000,
              success(e) {
                setTimeout(res => {
                  that.getdataTab()
                }, 200)
              }
            })
          }, 2000)
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
              duration: 2000,
              success(e) {
                setTimeout(res => {
                  that.getdataTab()
                }, 200)
              }
            })
          }, 2000)
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
          timeStamp: res.data.payInfo.timestamp,
          nonceStr: res.data.payInfo.nonceStr,
          package: res.data.payInfo.package,
          signType: res.data.payInfo.signType,
          paySign: res.data.payInfo.paySign,
          success(res) {
            that.getdataTab()
          },
          fail(res) {
            that.getdataTab()
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
              duration: 2000,
              success(e) {
                setTimeout(res => {
                  that.getdataTab()
                }, 200)
              }
            })
          }, 2000)
        }
      });
  },
  getdataTab(e) { //操作调用接口
    const that = this
    util.UserHttpRequst(true, 'order/lists', { //消息列表
        page: this.data.page,
        status: this.data.status
      },
      'GET', res => {
        that.setData({
          orderlist: res.data,
          pagemore: true
        })
      });
  },
  getdata(e) {
    const that = this
    let orderlist = this.data.orderlist
    let pagemore = this.data.pagemore
    util.UserHttpRequst(true, 'order/lists', { //消息列表
        page: this.data.page,
        status: this.data.status
      },
      'GET', res => {
        if (res.data.length < 15) {
          pagemore = false
          setTimeout(res => {
            wx.showToast({
              title: '全部加载完',
              icon: 'none',
              duration: 1000
            })
          }, 500)
        }
        orderlist = orderlist.concat(res.data)
        that.setData({
          orderlist: orderlist,
          pagemore: pagemore
        })
      });
  }
})