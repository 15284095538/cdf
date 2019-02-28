const util = require("../../../utils/util.js");

Page({
  data: {
    page: 1,
    pagemore: true,
    newlist: []
  },
  onLoad(e){
    
  },
  onShow(e){
    if (!wx.getStorageSync('userInfo-login') || wx.getStorageSync('userInfo-login') == '') { //判断是否登录
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return false
    }
    this.setData({
      newlist: [],
      page: 1
    })
    this.getdata()
  },
  onReachBottom(e){
    if (this.data.pagemore){
      this.data.page++
      this.getdata()
    }
  },
  godetail(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/newsList/details/details?id=' + id,
    })
  },
  getdata(e){
    const that = this
    let newlist = this.data.newlist
    let pagemore = this.data.pagemore
    util.UserHttpRequst(true, 'message/lists', {//消息列表
      page: this.data.page,
    },
    'GET', res => {
      if( res.data.length < 15 ){
        pagemore = false
        setTimeout( res => {
          wx.showToast({
            title: '全部加载完',
            icon: 'none',
            duration: 1000
          })
        },500)
      }
      newlist = newlist.concat( res.data )
      that.setData({
        newlist: newlist,
        pagemore: pagemore
      })
    });
  }
})