const util = require("../../../utils/util.js");
Page({
  data: {
    disabled: true,
    money: '',
    bankList: [],
    bank_type: '',
    bankName: '请选择银行',
    page: 1,
    pagemore: true,
    newlist:[]
  },
  onLoad: function (options) {
    var cash = Number( wx.getStorageSync('userInfo-login').may_withdraw_integral );
    this.setData({ cash })
    this.getlist();
  },
  onShow(e){
    this.getbankList();

    wx.login({
      success: res => {
        var code = res.code;
        util.UserHttpRequst(true, 'user/updateOpenId', { //获取openid
          code: code
        },
          'POST', res => {
            console.log(res)
          });
      }
    })

  },
  IsBlank(e){
    if (this.data.bankList == '' ){
      wx.navigateTo({
        url: '/pages/my/bankcard/add/add',
      })
    }
  },
  onReachBottom(e) {
    if (this.data.pagemore) {
      this.data.page++
      this.getlist()
    }
  },
  details(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/my/withdrawal/details?id=' + id,
    })
  },
  bindPickerChange(e) {
    let index = e.detail.value
    this.setData({
      bank_type: this.data.bankList[index].id,
      bankName: this.data.bankList[index].bank_name
    })
  },
  getbankList(e) {
    const that = this
    util.UserHttpRequst(true, 'userBank/lists', {},
      'GET', res => {
        that.setData({
          bankList: res.data
        })
        // if( res.data == '' ){
        //   wx.navigateTo({
        //     url: '/pages/my/bankcard/add/add',
        //   })
        // }
      });
    util.UserHttpRequst(true, 'withdraw/managementSpk', {},
      'GET', res => {
        that.setData({
          managementSpk: res.data
        })
      });
  },
  bindinput(e) {
    this.setData({ money: e.detail.value })
    if (e.detail.value) {
      this.setData({ disabled: false })
    } else {
      this.setData({ disabled: true })
    }
  },
  cashout(e) {
    const that = this
    if (Number(this.data.money) == 0) {
      wx.showToast({
        title: '请输入正确提款金额',
        icon: 'none'
      })
    }
    if (Number(this.data.money) > this.data.cash) {
      wx.showToast({
        title: '输入金额大于可提现金额',
        icon: 'none'
      })
      return false;
    }
    if (!this.data.bank_type ){
      wx.showToast({
        title: '请选择提现银行',
        icon: 'none'
      })
      return false;
    }
    if (Number(this.data.money) > 0) {
      util.UserHttpRequst(false, 'withdraw/add', {
        integral: this.data.money,
        bank_id: this.data.bank_type
      },
        'POST', res => {
          const message = res.message
          setTimeout(res=>{
            wx.showToast({
              title: message,
              icon: 'none',
              duration: 2000
            })
            setTimeout(res=>{
              that.data.newlist = []
              that.getlist();
            },2000)
          },500)
        });
    }
  },
  all(e) {
    var that = this;
    if (that.data.cash != 0) {
      that.setData({
        money: that.data.cash,
        disabled: false
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '你没有可提现金额',
      })
    }
  },
  getlist(e){
    const that = this
    let newlist = this.data.newlist
    let pagemore = this.data.pagemore
    util.UserHttpRequst(false, 'withdraw/lists', {
      page: this.data.page,
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
        newlist = newlist.concat(res.data)
        that.setData({
          newlist: newlist,
          pagemore: pagemore
        })
      });
  }
})