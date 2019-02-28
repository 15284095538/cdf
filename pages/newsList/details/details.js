const util = require("../../../utils/util.js");

Page({
  data: {
    id: '',
    data: {}
  },
  onLoad: function (e) {
    this.setData({
      id: e.id
    })
    this.getdata()
  },
  getdata(e) {
    const that = this
    util.UserHttpRequst(true, 'message/info', {//消息列表
      id: this.data.id,
    },
    'GET', res => {
      that.setData({
        data: res.data
      })
    });
  }
})