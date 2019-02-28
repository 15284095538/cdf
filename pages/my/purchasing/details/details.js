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
  getdata(e) {
    const that = this
    let orderlist = this.data.orderlist
    let pagemore = this.data.pagemore
    util.UserHttpRequst(true, 'order/info', { //消息列表
      id: this.data.id
    },
      'GET', res => {
        0
        that.setData({
          info: res.data,
        })
      });
  }
})