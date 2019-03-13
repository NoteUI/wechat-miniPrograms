// pages/myOrderList/myOrderList.js
import { getSearchResults } from "../../api/getData.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curIndex: 0,
    tabItemWidth: 0,
    left: 0,
    okOrderListData: [],
    preOrderListData: [],
    isLoading:true
  },
  //切换tab
  switchTab: function (e) {
    var _curIndex = e.currentTarget.dataset.index;
    var _left = e.currentTarget.offsetLeft;
    this.setData({
      curIndex: _curIndex,
      left: _left + (this.data.tabItemWidth - 60) / 2
    });
  },
  //购买
  toBuy: function () {
    wx.showModal({
      title: '支付提示',
      content: '本产品仅用于演示，支付系统已屏蔽',
      showCancel: false,
      success: function (res) {
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title:'正在加载...'
    });
    setTimeout(()=>{
      wx.hideLoading();
      var _noPayGoodsInfo = wx.getStorageSync('noPayGoodsInfo') || {};
      // var _preOrderListData=[
      //   {
      //     "orderNumber":'B619167730719603',
      //     "pic_url":'//m.360buyimg.com/babel/jfs/t19426/11/1131416188/256267/8da2b3e7/5abdde48N40348736.png',
      //     "title":'梅珍 海南小台芒2kg 三亚新鲜水果鸡蛋芒台农芒小芒果三亚新鲜水果鸡蛋芒台农芒小芒果',
      //     "num":1
      //   },
      //    {
      //     "orderNumber":'B619167730719603',
      //     "pic_url":'//m.360buyimg.com/babel/jfs/t19426/11/1131416188/256267/8da2b3e7/5abdde48N40348736.png',
      //     "title":'梅珍 海南小台芒2kg 三亚新鲜水果鸡蛋芒台农芒小芒果三亚新鲜水果鸡蛋芒台农芒小芒果',
      //     "num":1
      //   }
      // ];
      var _okOrderListData = [
        {
          "orderNumber": 'B739867730718403',
          "pic_url": 'https://p0.meituan.net/dpdeal/1c67ec0d676248aa97a45538a88d15d0801731.jpg%40450w_280h_1e_1c_1l%7Cwatermark%3D1%26%26r%3D1%26p%3D9%26x%3D2%26y%3D2%26relative%3D1%26o%3D20',
          "title": ' 3-5人单麦威士忌套餐',
          "marketPrice":'34',
          "num": 2
        },
        {
          "orderNumber": 'B739867730718403',
          "pic_url": 'https://p0.meituan.net/dpdeal/900518298eec24660b3dcd2791dc7f791002093.jpg%40450w_280h_1e_1c_1l%7Cwatermark%3D1%26%26r%3D1%26p%3D9%26x%3D2%26y%3D2%26relative%3D1%26o%3D20',
          "title": '超值鸡尾酒套餐',
          "marketPrice":'26',
          "num": 2
        }
      ];
      var _preOrderListData = getSearchResults();
      _preOrderListData = _preOrderListData.filter((item, index) => {
        if (_noPayGoodsInfo[item.id]) {
          item.num = _noPayGoodsInfo[item.id];
          item.totalPrice = (item.num*item.marketPrice).toFixed(2);
          return true;
        }
        else
          return false;
      });
      console.log(_preOrderListData);
      this.setData({
        preOrderListData: _preOrderListData,
        okOrderListData: _okOrderListData,
        isLoading:false
      });
      wx.createSelectorQuery().select('.first-tab-item').boundingClientRect(
        (res) => {
          console.log();
          this.setData({
            left: res.left + (res.width - 60) / 2,
            tabItemWidth: res.width
          });
        }
      ).exec();
    },500); 
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