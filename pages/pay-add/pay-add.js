const util = require("../../utils/util.js");

Page({
  data: {
    ['goods-id']: '',
    address_id: '',
    address: ' ',
    adressList: [],
    layerDisplay: false
  },
  onLoad: function(e) {
    this.setData({
      ['goods-id']: e['goods-id']
    })
  },
  onShow(e) {
    this.getData()
  },
  addClick(e) { //创建订单
    util.UserHttpRequst(true, 'order/add', {
      goods_id: this.data['goods-id'],
      address_id: this.data.address_id
    },
      'POST', res => {
        wx.requestPayment({ //微信支付
          timeStamp: res.payInfo.timestamp,
          nonceStr: res.payInfo.nonceStr,
          package: res.payInfo.package,
          signType: res.payInfo.signType,
          paySign: res.payInfo.paySign,
          success(res) {

          },
          fail(res) {

          }
        })
      });
  },
  adressClick(e) { //地址点击
    let address_id = e.currentTarget.dataset.id
    let address = e.currentTarget.dataset.txt
    this.setData({
      address_id: address_id,
      address: address,
      layerDisplay: false
    })
  },
  layerDisplayClick(e) {
    this.setData({
      layerDisplay: true
    })
  },
  layerDisplayF(e) {
    this.setData({
      layerDisplay: false
    })
  },
  receivingaddress(e) { //新建收货地址
    wx.navigateTo({
      url: '/pages/my/receivingaddress/addaddress/addaddress',
    })
  },
  getData() { //所有收货地址
    const that = this
    let address_id = this.data.address_id
    let address = this.data.address
    util.UserHttpRequst(true, 'address/lists', {},
      'GET', res => {
        const data = res.data
        if (data == '') { //没有收货地址
          wx.showModal({
            title: '提示',
            content: '没有收货地址请新建收货地址',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/my/receivingaddress/addaddress/addaddress',
                })
              } else if (res.cancel) {
                wx.navigateBack()
              }
            }
          })
          return false
        }
        for (let i = 0; i < data.length; i++) { //选择默认收货地址
          if (data[i].is_mr == 1) {
            address_id = data[i].id
            address = data[i].area_text
          }
        }
        that.setData({
          adressList: data,
          address_id: address_id,
          address: address
        })
      });
  }
})