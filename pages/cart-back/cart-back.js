// pages/cart/cart.js
import { getRecommendListData, getIndexMoreData, getSearchResults } from "../../api/getData.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    isSelectedArr: [],
    isAllSelected: false,
    recommendListData: [],
    totalPrice: 0,
    totalNum: 0,
    isEnableToBuy: false,
    menuWidth: 210
  },
  // 点击选择订单的按钮
  onSelectBtnTap: function (e) {
    var _isSelectedArr = this.data.isSelectedArr;
    var _orderData=this.data.orderData;
    var curIndex = e.currentTarget.dataset.index;
    //选择状态切换
    if (_isSelectedArr[curIndex]){
      _isSelectedArr[curIndex] = false;
      _orderData[curIndex].selected=false;
    }
    else{
      _isSelectedArr[curIndex] = true;
      _orderData[curIndex].selected=true;
    }
    console.log(_orderData);
    this.setData({
      isSelectedArr: _isSelectedArr,
      orderData:_orderData
    });
    this.calculateNumAndPrice();
  },
  //全选
  selecteAll: function (e) {
    var _isAllSelected = !this.data.isAllSelected;
    var _isSelectedArr = this.data.isSelectedArr;
    var _orderData=this.data.orderData;
    //如果是全选
    if (_isAllSelected) {
      _isSelectedArr.forEach((el, index) => {
        _isSelectedArr[index] = true;
        _orderData[index].selected=true;
      });
    }
    //取消全选
    else {
      _isSelectedArr.forEach((el, index) => {
        _isSelectedArr[index] = false;
        _orderData[index].selected=false;
      });
    }
    console.log(_orderData);
    this.setData({
      isSelectedArr: _isSelectedArr,
      orderData:_orderData
    });
    this.calculateNumAndPrice();
  },
  //侦听加减
  operationNum: function ($operationObj) {
    var _orderData = this.data.orderData;
    var operationId = $operationObj.currentTarget.id;
    var _goodsInfo = wx.getStorageSync('goodsInfo');
    var _addToCartNum = wx.getStorageSync('addToCartNum');
    var oprateNum=$operationObj.detail.num;
    var curIndex = _orderData.findIndex((item) => {
      return item.id == operationId;
    });
    if ($operationObj.detail.type == 'add') {
      _orderData[curIndex].num += oprateNum;
      _goodsInfo[operationId]+=oprateNum;
      _addToCartNum+=oprateNum;
    }
    else {
      _orderData[curIndex].num -= oprateNum;
      _goodsInfo[operationId]-=oprateNum;
      _addToCartNum-=oprateNum;
    }
    wx.setStorageSync('goodsInfo',_goodsInfo);
    wx.setStorageSync('addToCartNum',_addToCartNum);
    this.setData({
      orderData: _orderData
    });
    this.calculateNumAndPrice();
  },
  // 计算价格
  calculateNumAndPrice: function () {
    var _totalPrice = 0;
    var _orderData = this.data.orderData;
    var _isSelectedArr = this.data.isSelectedArr;
    var _isAllSelected = false;
    var _isEnableToBuy = false;
    //过滤出值为true的数组，即为选择的的件数
    var trueArr = _isSelectedArr.filter(function (item) {
      return item;
    });
    if (trueArr.length == _isSelectedArr.length && trueArr.length > 0)
      _isAllSelected = true;
    else
      _isAllSelected = false;
    //计算选中商品的价格
    _isSelectedArr.forEach((item, index) => {
      //item为true，即为选中
      if (item)
        _totalPrice += Number(_orderData[index].marketPrice) * Number(_orderData[index].num);
    });
    //判断价钱不为0，可以去结算
    if (_totalPrice > 0){
      _totalPrice=_totalPrice.toFixed(2);
      _isEnableToBuy = true;
    }
    else
      _isEnableToBuy = false;
    this.setData({
      totalPrice: _totalPrice,
      totalNum: trueArr.length,
      isAllSelected: _isAllSelected,
      isEnableToBuy: _isEnableToBuy
    })
  },
  // 手指按下开始
  onMoveOrderItemStart: function (e) {
    this.resetData(false);
    var startX = e.touches[0].clientX;
    this.setData({
      startX
    })
  },
  // 滑动菜单
  onMoveOrderItemMove: function (e) {
    var _diffX = e.touches[0].clientX - this.data.startX;
    var _orderData = this.data.orderData;
    if (_diffX > -this.data.menuWidth && _diffX < 30) {
      _orderData[e.currentTarget.dataset.index].left = _diffX;
      _orderData[e.currentTarget.dataset.index].move = true;
    }
    this.setData({
      orderData: _orderData
    });
  },
  // 手指离开菜单
  onMoveOrderItemEnd: function (e) {
    var _diffX = e.changedTouches[0].clientX - this.data.startX;
    var _orderData = this.data.orderData;
    var _left = 0;
    _orderData[e.currentTarget.dataset.index].move = false;
    if (_diffX > 0 || _diffX == 0)
      _left = 0;
    else
      _diffX < -this.data.menuWidth / 2 ? _left = - this.data.menuWidth : _left = 0;

    _orderData[e.currentTarget.dataset.index].left = _left;
    this.setData({
      orderData: _orderData
    });
  },
  resetData: function ($move) {
    var _orderData = this.data.orderData;
    _orderData.forEach((item, index) => {
      item.left = 0;
      item.move = $move;
    });
    this.setData({
      orderData: _orderData
    });
  },
  //删除订单
  delOrderItem: function (e) {
    console.log(e);
    this.delhandle(e.currentTarget.dataset.index, e.currentTarget.dataset.id);
  },
  delhandle: function ($curDelIndex, $curDelId) {
    var _orderData = this.data.orderData;
    var _isSelectedArr = this.data.isSelectedArr;
    var _curDelIndex = $curDelIndex;
    var goodsInfo = wx.getStorageSync('goodsInfo');
    var _addToCartNum = wx.getStorageSync('addToCartNum');
    _addToCartNum -= goodsInfo[$curDelId];
    delete(goodsInfo[$curDelId]);
    wx.setStorageSync('addToCartNum', _addToCartNum);
    wx.setStorageSync('goodsInfo', goodsInfo);
    //删除显示的数据和选择状态的数据
    this.resetData(true);
    _orderData.splice(_curDelIndex, 1);
    _isSelectedArr.splice(_curDelIndex, 1);
    this.setData({
      orderData: _orderData,
      isSelectedArr: _isSelectedArr
    });
    this.calculateNumAndPrice();
  },
  //移入收藏夹
  onCollect: function (e) {
    wx.showToast({
      title: '已经移入收藏夹！',
      success: () => {
        this.delhandle(e.currentTarget.dataset.index, e.currentTarget.dataset.id);
      }
    });
  },
  //隐藏菜单
  hideMenu: function () {
    this.resetData(false);
  },
  //确认订单
  confirmOrder: function () {
    if (this.data.isEnableToBuy) {
      var selectedIdObj={};
      this.data.orderData.forEach((item,index)=>{
        selectedIdObj[item.id]=item.selected;
      });
      wx.navigateTo({
        url: '../orderDetail/orderDetail?totalPrice=' + this.data.totalPrice+"&selectedIdObj="+JSON.stringify(selectedIdObj)
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  购物车的数据
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
    wx.showLoading({
      title:'正在加载...'
    });
  },
  //监听页面滚动到底部
  onReachBottom: function () {

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
    setTimeout(()=>{
      wx.hideLoading();
      var _orderData = getSearchResults();
      var _isSelectedArr = [];
      //获取推荐更多的数据
      var _recommendListData = getRecommendListData().lists;
      var goodsInfo = wx.getStorageSync('goodsInfo');
      if (goodsInfo) {
        _orderData = _orderData.filter((item, index) => {
          if (goodsInfo[item.id]) {
            _orderData[index].num = goodsInfo[item.id];
            _orderData[index].selected=false;
            return true;
          }
          else
            return false;
        });
        _orderData.forEach((item, index) => {
          _isSelectedArr[index]=_isSelectedArr[index]?true:false;
          item.left = 0;
        });
        console.log(_isSelectedArr);
      }
      else {
        _orderData = []
      }
      this.setData({
        recommendListData: _recommendListData,
        orderData: _orderData,
        isSelectedArr: _isSelectedArr,
        isAllSelected:false,
        totalPrice:0,
        totalNum:0,
        isEnableToBuy:false
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