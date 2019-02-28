const util = require("../../../utils/util.js");
const WxParse = require('../../../wxParse/wxParse.js');

Page({
  data: {
    bannerList: []
  },
  onLoad: function(options) {
    this.getData()
  },
  sure(e){
    wx.navigateTo({
      url: '/pages/consulting/list/list',
    })
  },
  getData() {
    const that = this
    util.HttpRequst(true, 'banner/lists', { //banner图
        position: '2'
      },
      'GET', res => {
        that.setData({
          bannerList: res.data
        })
      });
    util.PublickHttpRequst(true, 'config/medicine', {}, //中医介绍
      'GET', res => {
        if (res.status == 200) {
          WxParse.wxParse('article', 'html', res.data.value, that, 5)
        }
      });
  }
})