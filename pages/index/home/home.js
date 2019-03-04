const util = require("../../../utils/util.js");

Page({
  data: {
    bannerList:[],
    newList:[],
    menuList:[],
    goods:[],
    animationData: {}
  },
  onLoad: function (options) {
    this.getData()
  },
  detailsClick(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/index/details/details?id=' + id,
    })
  },
  menuClick(e){
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/index/list/list?id=' + id + '&name=' + name,
    })
  },
  getData(){
    const that = this
    util.HttpRequst(true, 'banner/lists', {//banner图
      position: '1'
    },
    'GET', res => {
      that.setData({
        bannerList: res.data
      })
    });
    util.HttpRequst(true, 'roll/lists', {
      page_num: 50
    },//消息列表
    'GET', res => {
      that.setData({
        newList: res.data
      })
    });
    util.HttpRequst(true, 'category/indexLists', {},//分类
    'GET', res => {
      that.setData({
        menuList: res.data
      })
    });
    util.HttpRequst(true, 'goods/indexLists', {},//推荐商品
    'GET', res => {
      that.setData({
        goods: res.data
      })
    });
    util.HttpRequst(true, 'index/dayCanBuyNum', {},//今日还可购买数量说明
      'GET', res => {
        that.setData({
          dayCanBuyNum: res.data
        })
      });
  }
})