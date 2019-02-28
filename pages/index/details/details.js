const util = require("../../../utils/util.js");
const WxParse = require('../../../wxParse/wxParse.js');

Page({
  data: {
    id: '',
    info: [],
    userlogin: false,
    canbuy:{
      text: '',
      Isf: true
    }
  },
  onLoad: function(e) {
    this.setData({
      id: e.id
    })
    this.getData()

    if (!wx.getStorageSync('userInfo-login') || wx.getStorageSync('userInfo-login') == '') { //判断是否登录
      this.setData({
        userlogin: false
      })
    }else{
      this.setData({
        userlogin: true
      })
      this.getcanBuyGoods2()
    }
  },
  callPhone(e){ //拨打电话
    wx.makePhoneCall({
      phoneNumber: this.data.info.mobile
    })
  },
  payClick(e){
    const that = this
    if (!this.data.userlogin){ //判断登录
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false
    }
    if (!this.data.canbuy.Isf){ //判断是否可以购买
      wx.showToast({
        title: this.data.canbuy.txt,
        icon: 'none',
        duration: 1000
      })
      return false
    }

    wx.showActionSheet({
      itemList: ['立即购买', '代购'],
      success(res) {
        const index = res.tapIndex
        if( index == 0 ){ //立即购买
          wx.navigateTo({
            url: '/pages/pay-add/pay-add?goods-id=' + that.data.id,
          })
        }
        if (index == 1 ){ //代购
          wx.navigateTo({
            url: '/pages/pay-dgadd/pay-dgadd?goods-id=' + that.data.id,
          })
        }
      }
    })

  },
  getcanBuyGoods2(e) { //查询商品是否可以购买
    let Isf = this.data.canbuy.Isf
    let txt = ''
    const that = this
    util.UserHttpRequst(true, 'order/canBuyGoods2', { 
      goods_id: this.data.id
    },
    'GET', res => {
      if (res.status == 200 ){
        Isf = true
      }else{
        Isf = false
        txt = res.message
      }
      that.setData({
        ['canbuy.txt']: txt,
        ['canbuy.Isf']: Isf
      })
    });
  },
  getData() {
    const that = this
    util.HttpRequst(true, 'goods/info', { //商品详情
      id: this.data.id
    },
    'GET', res => {
      that.setData({
        info: res.data
      })
      WxParse.wxParse('article', 'html', res.data.content, that, 5)
    });
  }
})