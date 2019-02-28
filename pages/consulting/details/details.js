const util = require("../../../utils/util.js");
const WxParse = require('../../../wxParse/wxParse.js');

Page({
  data: {
    info: [],
    id: [],
  },
  onLoad: function (e) {
    this.setData({
      id: e.id
    })
    this.getData()
  },
  getData() { //案列详情
    const that = this
    util.HttpRequst(true, 'article/info', {
      id: this.data.id
    }, 
      'GET', res => {
        if (res.status == 200) {
          that.setData({
            info: res.data
          })
          WxParse.wxParse('article', 'html', res.data.content, that, 5)
        }
      });
  }
})