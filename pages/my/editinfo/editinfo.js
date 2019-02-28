const util = require("../../../utils/util.js");

Page({
  data: {
    userinfoData: [],
    nickname: '',
    id: '',
    imgpath:''
  },
  onLoad: function(e) {

  },
  imgUp(e) {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.showToast({
          title: '加载中...',
          icon: 'loading'
        })
        wx.uploadFile({
          url: 'https://cdf.mmqo.com/file/upload-img', 
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {},
          success(res) {
            wx.hideToast();
            const data = JSON.parse(res.data)
            if( data.status == 1 ){
              that.setData({
                id: data.data.id,
                imgpath: data.data.url
              })
            }
          }
        })
      }
    })
  },
  onShow(e) {
    this.setData({
      imgpath: wx.getStorageSync('userInfo-login').head_img_url,
      nickname: wx.getStorageSync('userInfo-login').nickname
    })
  },
  inputNc(e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  sureClick(e){
    const that = this
    util.UserHttpRequst(true, 'user/updateInfo', {
      nickname: this.data.nickname,
      head_id: this.data.id
    },
    'POST', res => {
      if( res.status == 200 ){
        that.getDataUserino()
      }
    });
  },
  getDataUserino(e){
    util.UserHttpRequst(true, 'user/info', {},
    'GET', res => {
      wx.setStorage({
        key: 'userInfo-login',
        data: res.data
      })
      wx.navigateBack()
    });
  }
})