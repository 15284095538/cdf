const util = require("../../../../utils/util.js");

Page({
  data: {
    adressList: [],
  },
  onLoad: function (e) {

  },
  onShow(e) {
    this.getData()
  },
  editClick(e) { //编辑
    let id = e.currentTarget.dataset.id
    let bank_number = e.currentTarget.dataset.bank_number
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/my/bankcard/edit/edit?id=' + id + '&bank_number=' + bank_number + '&name=' + name,
    })
  },
  delClick(e) { //删除
    const that = this
    let id = e.currentTarget.dataset.id
    util.UserHttpRequst(false, 'userBank/del', {
      id: id
    },
      'POST', res => {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000,
        })
        setTimeout(res => {
          that.getData()
        }, 500)
      });
  },
  addClick(e) {
    wx.navigateTo({
      url: '/pages/my/bankcard/add/add',
    })
  },
  getData() { //所有银行卡地址
    const that = this
    util.UserHttpRequst(true, 'userBank/lists', {},
      'GET', res => {
        that.setData({
          adressList: res.data
        })
      });
  }
})