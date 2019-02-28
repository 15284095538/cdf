const util = require("../../../../utils/util.js");
const address = require('../../../../utils/city.js')

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
    adrrId: '',


    areaInfo: '请选择',
    name: '',
    phone: '',
    addree: '',
    is_mr: 1,
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
      adrrId: options.id
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
  name(e) {
    this.setData({ name: e.detail.value })
  },
  tel(e) {
    this.setData({ phone: e.detail.value })
  },
  addree(e) {
    this.setData({ addree: e.detail.value })
  },
  radioChange(e) {
    this.setData({ is_mr: e.detail.value })
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
        title: '请输入联系人',
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
    util.UserHttpRequst(true, 'address/edit', {
      id: this.data.adrrId,
      area: this.data.areaInfo,
      address: this.data.addree,
      name: this.data.name,
      tel: this.data.phone,
      is_mr: this.data.is_mr
    },
      'POST', res => {
        if (res.status == 200) {
          var message = res.message
          setTimeout(res => {
            wx.showToast({
              title: message,
              icon: 'none',
              duration: 1000
            })
            wx.navigateBack()
          }, 1000)
        }
      });
  }
})