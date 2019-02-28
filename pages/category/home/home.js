const util = require("../../../utils/util.js");

Page({
  data: {
    menuList: [],
    menuindex:0,
    goods: [],
    scrollHeight:'',
    requestData:{
      category_id: '',
      page: 1,
      sales_num: '',
      browse_num: ''
    },
    pagemore: true
  },
  onLoad: function (options) {
    var that = this
    this.getmenuData()
    wx.getSystemInfo({
      success(res) {
        that.setData({
          scrollHeight: res.windowHeight
        })
      }
    })
  },
  detailsClick(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/index/details/details?id=' + id,
    })
  },
  shoppingBottom(e){
    if (this.data.pagemore) {
      this.data.requestData.page++
      this.getshoopData()
    }
  },
  menuClick(e){ //左列表点击
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    this.setData({
      ['requestData.category_id']: id,
      ['requestData.page']: 1,
      goods: [],
      menuindex: index
    })
    this.getshoopData()
  },
  getshoopData(){
    const that = this
    let goods = this.data.goods
    let pagemore = this.data.pagemore
    util.HttpRequst(true, 'goods/lists', {//所有商品
      page: this.data.requestData.page,
      category_id: this.data.requestData.category_id,
      sales_num: this.data.requestData.sales_num,
      browse_num: this.data.requestData.browse_num
    },
    'GET', res => {
      if (res.data == '' ) {
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
  },
  getmenuData() {
    const that = this
    util.HttpRequst(true, 'category/lists', {//所以分类
      position: '1'
    },
    'GET', res => {
      that.setData({
        menuList: res.data,
        ['requestData.category_id']: res.data[0].id
      })
      that.getshoopData()
    });
  }
})