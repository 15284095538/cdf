const util = require("../../../utils/util.js");

Page({
  data: {
    content: ''
  },
  onLoad: function (options) {

  },
  textarea(e){
    this.setData({
      content: e.detail.value
    })
  },
  sureClick(e){
    if (this.data.content.length < 1 ){
      wx.showToast({
        title: '请输入反馈意见',
        icon: 'none',
        duration: 1000
      })
    }
    util.UserHttpRequst(true, 'feedback/add', {
      content: this.data.content
    },
    'POST', res => {
      if (res.status == 200) {
        var message = res.message
        setTimeout(res => {
          wx.showToast({
            title: message,
            icon: 'none',
            duration: 1000
          })
          wx.navigateBack()
        }, 1000)
      }
    });
  }
})