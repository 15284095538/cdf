const util = require("../../../utils/util.js");

Page({
  data: {
    userinfoData:[]
  },
  onLoad: function (options) {
    
  },
  onShow(e) {   
    if (!wx.getStorageSync('userInfo-login') || wx.getStorageSync('userInfo-login') == '') { //判断是否登录
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return false
    }
    this.getUserinfo();
    this.setData({
      userinfoData: wx.getStorageSync('userInfo-login')
    })
  },
  clerLogin(e){ //退出登录
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定退出登录',
      success(res) {
        if (res.confirm) {
          wx.clearStorage({
            success(res){
              that.onShow()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onShareAppMessage(res){ //分享
    return {
      title: '您的健康财富从这里开始',
      imageUrl: 'https://cdf.mmqo.com/logomini.png',
      path: '/pages/register/register?share_id=' + this.data.userinfoData.code
    }
  },
  extension(e){
    wx.navigateTo({
      url: '/pages/my/extension/extension',
    })
  },
  order(e){
    let status = e.currentTarget.dataset.status
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/my/order/home/home?status=' + status + '&index=' + index,
    })
  },
  withdrawal(e){ //提现
    wx.navigateTo({
      url: '/pages/my/withdrawal/withdrawal',
    })
  },
  editinfo(e){
    wx.navigateTo({
      url: '/pages/my/editinfo/editinfo',
    })
  },
  serviceClick(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.link,
    })
  },
  customerservice(e){ //客服服务
    util.PublickHttpRequst(true, 'config/mobile', {},
    'GET', ress => {
      if (ress.status == 200) {
        wx.showActionSheet({
          itemList: ['QQ'],
          success(res) {
            //console.log(res.tapIndex)
            // if (res.tapIndex == 0 ){
            //   wx.makePhoneCall({
            //     phoneNumber: ress.data.mobile
            //   })
            // }else{
              
            // }
            wx.showModal({
              title: 'QQ',
              content: ress.data.qq,
              success(res) { }
            })
          },
        })
      }
    });
  },
  getUserinfo(){
    util.UserHttpRequst(true, 'user/info', {},
      'GET', res => {
        wx.setStorage({
          key: 'userInfo-login',
          data: res.data
        })
      });
  }
})