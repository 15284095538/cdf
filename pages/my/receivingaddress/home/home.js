const util = require("../../../../utils/util.js");

Page({
  data: {
    adressList:[],
  },
  onLoad: function (e) {
    
  },
  onShow(e){
    this.getData()
  },
  editClick(e){ //编辑
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/my/receivingaddress/edit/edit?id=' + id,
    })
  },
  delClick(e){ //删除
    const that = this
    let id = e.currentTarget.dataset.id
    util.UserHttpRequst(false, 'address/del', {
      id: id
    },
    'POST', res => {
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000,
      })
      setTimeout(res=>{
        that.getData()
      },500)
    });
  },
  addClick(e){
    wx.navigateTo({
      url: '/pages/my/receivingaddress/addaddress/addaddress',
    })
  },
  getData() { //所有收货地址
    const that = this
    util.UserHttpRequst(true, 'address/lists', {},
    'GET', res => {
      that.setData({
        adressList: res.data
      })
    });
  }
})