// pages/orderDetail/orderDetail.js
import { getSearchResults } from "../../api/getData.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: {},
    orderData: [],
    selectedIdObj: {},
    totalPrice: 0,
    isTobuy:false,
    num:0
  },
  //付款
  onBuyTap: function () {
    wx.showModal({
      title: '支付提示',
      content: '本产品仅用于演示，支付系统已屏蔽',
      showCancel: false,
      success: (res) => {
        if (res.confirm) {
          var _selectedIdObj = this.data.selectedIdObj;
          var _noPayGoodsInfo = wx.getStorageSync('noPayGoodsInfo') || {};
          if(this.data.isTobuy){
            for (var i in _selectedIdObj) {
            _noPayGoodsInfo[i]=_noPayGoodsInfo[i] || 0;
            _noPayGoodsInfo[i]+=Number(this.data.num);
            }
          }
          else{
            var _addToCartNum = wx.getStorageSync('addToCartNum');
            var _goodsInfo = wx.getStorageSync('goodsInfo');
            for (var i in _selectedIdObj) {
              if (_selectedIdObj[i]) {
                _noPayGoodsInfo[i] = _noPayGoodsInfo[i] || 0;
                _noPayGoodsInfo[i] += _goodsInfo[i];
                _addToCartNum -= _goodsInfo[i];
                delete (_goodsInfo[i]);
              }
            }
            wx.setStorageSync('addToCartNum', _addToCartNum);
            wx.setStorageSync('goodsInfo', _goodsInfo);
          }
          wx.setStorageSync('noPayGoodsInfo', _noPayGoodsInfo);
          wx.switchTab({
            url: '../user/user'
          });
        }
      }
    });
  },
  //地址管理
  operateAddress: function () {
    wx.navigateTo({
      url: '../manageAddress/manageAddress'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // var _orderData = [
    //   {
    //     "id": 1,
    //     "pic_url": "//m.360buyimg.com/babel/jfs/t19426/11/1131416188/256267/8da2b3e7/5abdde48N40348736.png",
    //     "title": "梅珍 海南小台芒2kg 三亚新鲜水果鸡蛋芒台农芒小芒果三亚新鲜水果鸡蛋芒台农芒小芒果",
    //     "price": 10,
    //     "num": 1
    //   },
    //   {
    //     "id": 2,
    //     "pic_url": "//m.360buyimg.com/babel/jfs/t19426/11/1131416188/256267/8da2b3e7/5abdde48N40348736.png",
    //     "title": "梅珍 海南小台芒2kg 三亚新鲜水果鸡蛋芒台农芒小芒果三亚新鲜水果鸡蛋芒台农芒小芒果",
    //     "price": 20,
    //     "num": 1
    //   },
    //   {
    //     "id": 3,
    //     "pic_url": "//m.360buyimg.com/babel/jfs/t19426/11/1131416188/256267/8da2b3e7/5abdde48N40348736.png",
    //     "title": "梅珍 海南小台芒2kg 三亚新鲜水果鸡蛋芒台农芒小芒果三亚新鲜水果鸡蛋芒台农芒小芒果",
    //     "price": 30,
    //     "num": 1
    //   },
    //   {
    //     "id": 3,
    //     "pic_url": "//m.360buyimg.com/babel/jfs/t19426/11/1131416188/256267/8da2b3e7/5abdde48N40348736.png",
    //     "title": "梅珍 海南小台芒2kg 三亚新鲜水果鸡蛋芒台农芒小芒果三亚新鲜水果鸡蛋芒台农芒小芒果",
    //     "price": 40,
    //     "num": 1
    //   }
    // ];
    // this.setData({
    //   orderData:_orderData,
    //   totalPrice:options.totalPrice
    // });
    wx.showLoading({
      title: '正在加载...'
    });
    setTimeout(() => {
      wx.hideLoading();
      var _orderData = getSearchResults();
      var _selectedIdObj = JSON.parse(options.selectedIdObj);
      //获取缓存商品的数据
      //判断是不是直接购买的
      if(options.isTobuy){
        _orderData = _orderData.filter((item, index) => {
          if (_selectedIdObj[item.id]) {
            _orderData[index].num = options.num;
            return true;
          }
          else
            return false;
        });
        this.setData({
          isTobuy:true,
          num:options.num
        })
      }
      else{
        var goodsInfo = wx.getStorageSync('goodsInfo');
        if (_selectedIdObj) {
          _orderData = _orderData.filter((item, index) => {
            if (goodsInfo[item.id] && _selectedIdObj[item.id]) {
              _orderData[index].num = goodsInfo[item.id];
              return true;
            }
            else
              return false;
          });
        }
        else {
          _orderData = []
        }
      }
      this.setData({
        orderData: _orderData,
        selectedIdObj: _selectedIdObj,
        totalPrice: options.totalPrice
      });
    }, 500);
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
    var addressInfo = wx.getStorageSync('addressInfo');
    if (!addressInfo) {
      addressInfo = {};
      addressInfo.name = 'tiger';
      addressInfo.tel = '021-69190018';
      addressInfo.province = '嘉定区';
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