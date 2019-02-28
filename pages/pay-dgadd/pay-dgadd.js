const util = require("../../utils/util.js");
const address = require('../../utils/city.js')

Page({
  data: {
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],//选择省对应的所有市
    areas: [],//选择市对应的所有区
    province: '',//所有省份
    city: '',//当前被选中的市
    area: '',//当前被选中的区


    areaInfo: '请选择',
    phone: '',
    addree: '',
    name:'',
    address_tel: '',
    code:'',
    timer: '', //定时器名字
    countDownNum: '60', //倒计时初始值
    codeTips: '获取验证码',
    goods_id:''
  },
  code(e){
    this.setData({ code: e.detail.value })
  },
  tel(e) {
    this.setData({ phone: e.detail.value })
  },
  addree(e) {
    this.setData({ addree: e.detail.value })
  },
  name(e){
    this.setData({ name: e.detail.value })
  },
  address_tel(e){
    this.setData({ address_tel: e.detail.value })
  },
  getcode(e) {
    const that = this
    const myreg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (this.data.phone.length < 11) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 1000
      })
      return false
    }

    if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 1000
      })
      return false
    }

    if (this.data.countDownNum == 60) {
      util.PublickHttpRequst(false, 'code/send', {
        tel: this.data.phone,
        type: 1
      }, //获取验证码
        'POST', res => {
          wx.showToast({
            title: res.message,
            icon: 'success',
            duration: 1000
          })
          that.countDown();
        });
    } else {
      wx.showToast({
        title: '请60s后在获取验证码',
        icon: 'none',
        duration: 1000
      })
    }
  },
  countDown(e) {
    let that = this;
    let countDownNum = that.data.countDownNum;
    that.setData({
      timer: setInterval(function () {
        countDownNum--;
        that.setData({
          countDownNum: countDownNum,
          codeTips: countDownNum + 's'
        })
        if (countDownNum == 0) {
          clearInterval(that.data.timer);
          that.setData({
            countDownNum: '60',
            codeTips: '获取验证码'
          })
        }
      }, 1000)
    })
  },
  onGotUserInfo(e) {
    const that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) { //判断授权
          wx.login({
            success: res => {
              var code = res.code;
              wx.getUserInfo({
                success: function (res) {
                  wx.setStorage({
                    key: 'userInfo',
                    data: res.userInfo
                  })
                  that.getregister()
                }
              })
            }
          })
        } else {
          that.getregister()
        }
      }
    })
  },
  onLoad: function (options) {
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
      goods_id: options['goods-id']
    })
  },
  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    console.log(isShow)
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name
    that.setData({
      areaInfo: areaInfo,
    })
  },
  hideCitySelected: function (e) {
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    console.log(e)
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
  },
  addClick(e) {
    const that = this
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.phone.length < 11 && this.data.phone.length) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 500,
        mask: true
      })
      return false
    }
    if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 500,
        mask: true
      })
      return false
    }
    if (!this.data.name) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none',
        duration: 500,
        mask: true
      })
      return false
    }
    if (!this.data.addree) {
      wx.showToast({
        title: '请输入街道门牌信息',
        icon: 'none',
        duration: 500,
        mask: true
      })
      return false
    }
    if (!myreg.test(this.data.address_tel)) {
      wx.showToast({
        title: '请输入正确收货人手机号',
        icon: 'none',
        duration: 500,
        mask: true
      })
      return false
    }
    if (!this.data.address_tel) {
      wx.showToast({
        title: '请输入收货人电话',
        icon: 'none',
        duration: 500,
        mask: true
      })
      return false
    }
    util.UserHttpRequst(true, 'order/dgAdd', {
      goods_id: this.data.goods_id,
      tel: this.data.phone,
      code: this.data.code,
      area: this.data.areaInfo,
      address: this.data.addree,
      name: this.data.name,
      address_tel: this.data.address_tel
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
  }
})