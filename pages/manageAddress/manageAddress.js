// pages/manageAddress/manageAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    tel:'',
    province:'',
    city:'',
    area:'',
    detailAddress:'',
    provinceArray: ['上海市','广东省','北京市','浙江省','天津市','安徽省','上海市','福建省','重庆市' ,'江西省','河南省'],
    cityArray: ['上海市','佛山市','江门市','湛江市','茂名市','肇庆市','河源市','东莞市'],
    areaArray:['嘉定区','越秀区','东山区','海珠区','荔湾区','白云区','黄埔区','芳村区','花都区','番禺区','从化市'],
    pIndex: 0,
    cIndex:0,
    aIndex:0
  },
  //选择省
  bindPickProChange:function(e){
    this.setData({
      pIndex: e.detail.value
    });
  },
  //选择市
  bindPickCityChange:function(e){
    this.setData({
      cIndex: e.detail.value
    });
  },
  //选择地区
  bindPickAreaChange:function(e){
    this.setData({
      aIndex: e.detail.value
    });
  },
  //获取名字
  getName:function(e){
    this.setData({
      name: e.detail.value
    });
  },
  //获取电话信息
  getTelephone:function(e){
    this.setData({
      tel: e.detail.value
    });
  },
  //获取详细的地址信息
  getDetailAddr:function(e){
    this.setData({
      detailAddress: e.detail.value
    });
  },
  //保存信息
  saveInfo:function(){
    if(this.data.name==''||this.data.tel==''||this.data.detailAddress=='')
    {
      wx.showToast({
        title:'信息填写不完整！'
      });
    }
    else{
      var addressInfo={};
      addressInfo.name=this.data.name;
      addressInfo.tel=this.data.tel;
      addressInfo.province=this.data.provinceArray[this.data.pIndex];
      addressInfo.city=this.data.cityArray[this.data.cIndex];
      addressInfo.area=this.data.areaArray[this.data.aIndex];
      addressInfo.detailAddress=this.data.detailAddress;
      addressInfo.pIndex=this.data.pIndex;
      addressInfo.cIndex=this.data.cIndex;
      addressInfo.aIndex=this.data.aIndex;
      wx.setStorageSync('addressInfo',JSON.stringify(addressInfo));
      wx.showToast({
        title:'信息保存成功！'
      });
      setTimeout(function(){
        wx.navigateBack({
          delta:1
        });
      },1000)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title:'正在加载...'
    });
    setTimeout(()=>{
      wx.hideLoading();
      var addressInfo = wx.getStorageSync('addressInfo');
    if (!addressInfo) {
      addressInfo = {};
      addressInfo.name = 'tiger';
      addressInfo.tel = '021-69190018';
      addressInfo.province = '上海市';
      addressInfo.city = '上海市';
      addressInfo.area = '嘉定区';
      addressInfo.detailAddress = '嘉定区xx路';
      addressInfo.pIndex = 0;
      addressInfo.cIndex = 0;
      addressInfo.aIndex = 0;
      wx.setStorageSync('addressInfo', JSON.stringify(addressInfo));
    }
    else {
      addressInfo = JSON.parse(addressInfo);
    }
    this.setData({
      addressInfo: addressInfo
    });
      var addressInfo=JSON.parse(wx.getStorageSync('addressInfo'));
    this.setData({
      name: addressInfo.name,
      tel:addressInfo.tel,
      detailAddress:addressInfo.detailAddress,
      pIndex:addressInfo.pIndex,
      cIndex:addressInfo.cIndex,
      aIndex:addressInfo.aIndex
    });
    },500);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})