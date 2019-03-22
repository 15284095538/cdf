const util = require("../../../../utils/util.js");


Page({
  data: {
    bank_type: '',
    bank_number: '',
    name: '',
    bankList: [],
    bankName: '请选择银行',
    id: ''
  },
  onLoad: function (e) {
    this.setData({
      id: e.id,
      bank_number: e.bank_number,
      name: e.name
    })
    this.getbankList()
  },
  bindPickerChange(e) {
    let index = e.detail.value
    this.setData({
      bank_type: this.data.bankList[index].id,
      bankName: this.data.bankList[index].name
    })
  },
  bank_number(e) {
    this.setData({
      bank_number: e.detail.value
    })
  },
  name(e) {
    this.setData({
      name: e.detail.value
    })
  },
  getbankList(e) {
    const that = this
    util.UserHttpRequst(true, 'userBank/bankTypeList', {},
      'GET', res => {
        that.setData({
          bankList: res.data
        })
      });
  },
  sureClick(e) {
    const that = this
    if (this.data.bankName == '请选择银行') {
      wx.showToast({
        title: '请选择银行',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return false
    }
    if (this.data.bank_number == '') {
      wx.showToast({
        title: '请输入银行卡号',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return false
    }
    if (this.data.name == '') {
      wx.showToast({
        title: '请输入收款人姓名',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return false
    }
    util.UserHttpRequst(true, 'userBank/edit', {
      bank_type: this.data.bank_type,
      bank_number: this.data.bank_number,
      name: this.data.name,
      id: this.data.id
    },
      'POST', res => {
        const data = res
        setTimeout(res => {
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 2000,
            mask: true
          })
          wx.navigateBack()
        }, 2000)
      });
  }
})