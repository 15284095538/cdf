const util = require("../../../utils/util.js");


Page({
  data: {
    name: '',
    topIndex: 0,
    page: 1,
    category_id: '',
    sales_num: '',
    browse_num: '',
    menuList:[],
    layerDisPlay: false,
    shopList: [],
    pagemore: false
  },
  onLoad: function (e) {
    this.setData({
      category_id: e.id,
      name: e.name
    })
    wx.setNavigationBarTitle({
      title: e.name
    })
    this.getmenuData()
    this.getshopData()
  },
  detailsClick(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/index/details/details?id=' + id,
    })
  },
  onReachBottom(e) {
    if (this.data.pagemore) {
      this.data.page++
      this.getdata()
    }
  },
  topClick(e){ //头部点击
    let index = e.currentTarget.dataset.index
    let sales_num = this.data.sales_num
    let browse_num = this.data.browse_num
    let layerDisPlay = this.data.layerDisPlay
    if( index == 0 ){
      sales_num = ''
      browse_num = ''
      layerDisPlay = true
    }
    if( index == 1 ){
      sales_num = 'asc'
      browse_num = ''
      layerDisPlay = false
    }
    if( index == 2 ){
      sales_num = ''
      browse_num = 'desc'
      layerDisPlay = false
    }
    this.setData({
      topIndex: index,
      sales_num: sales_num,
      browse_num: browse_num,
      layerDisPlay: layerDisPlay,
      shopList: [],
      page: 1
    })
    if( index == 1 || index == 2 ){
      this.getshopData()
    }
  },
  layerDisPlay(e){
    this.setData({
      layerDisPlay: false
    })
  },
  menuClick(e){ //menu点击
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.setNavigationBarTitle({
      title: name
    })
    this.setData({
      category_id: id,
      name: name,
      layerDisPlay: false,
      shopList: [],
      page: 1
    })
    this.getshopData()
  },
  getmenuData(e){ //获取menu分类
    const that = this
    util.HttpRequst(true, 'category/lists', {//所以分类
      position: '1'
    },
    'GET', res => {
      that.setData({
        menuList: res.data
      })
    });
  },
  getshopData(e){ //获取商品列表
    const that = this
    let shopList = this.data.shopList
    let pagemore = this.data.pagemore
    util.HttpRequst(true, 'goods/lists', {
      category_id: this.data.category_id,
      page: this.data.page,
      sales_num: this.data.sales_num,
      browse_num: this.data.browse_num
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
      shopList = shopList.concat(res.data)
      that.setData({
        shopList: shopList
      })
    });
  }
})