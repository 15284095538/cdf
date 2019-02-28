const util = require("../../utils/util.js");
const WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {

  },
  onLoad: function (options) {
    const that = this
    util.PublickHttpRequst(true, 'config/protocol', {},//注册
    'GET', res => {
      if( res.status == 200 ){
        WxParse.wxParse('article', 'html', res.data.value, that, 5)
      }
    });
  }
})