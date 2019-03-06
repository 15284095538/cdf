const util = require("../../../utils/util.js");

Page({
  data: {
    goods: [],
    page: 1,
    pagemore: true
  },
  onLoad: function (options) {
    this.getData()
  },
  onReachBottom(e) {
    if (this.data.pagemore) {
      this.data.page++
      this.getdata()
    }
  },
  details(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/index/xwdetails/xwdetails?id=' + id,
    })
  },
  getData() {
    const that = this
    let goods = this.data.goods
    let pagemore = this.data.pagemore
    util.HttpRequst(true, 'article/helpLists', { //案列列表
      page: this.data.page
    },
      'GET', res => {
        if (res.data == '') {
          pagemore = false
          setTimeout(res => {
            wx.showToast({
              title: '全部加载完',
              icon: 'none',
              duration: 1000
            })
          }, 500)
        }
        goods = goods.concat(res.data)
        that.setData({
          goods: goods
        })
      });
  }
})