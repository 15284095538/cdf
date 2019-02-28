const util = require("../../../utils/util.js");

Page({
  data: {
    page: 1,
    pagemore: true,
    newlist: []
  },
  onLoad(e) {
    this.data.page = 1
    this.getdata()
  },
  onReachBottom(e) {
    if (this.data.pagemore) {
      this.data.page++
      this.getdata()
    }
  },
  getdata(e) {
    const that = this
    let newlist = this.data.newlist
    let pagemore = this.data.pagemore
    util.UserHttpRequst(true, 'user/shareUser', {//推广列表
      page: this.data.page,
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
        newlist = newlist.concat(res.data)
        that.setData({
          newlist: newlist,
          pagemore: pagemore
        })
      });
  }
})