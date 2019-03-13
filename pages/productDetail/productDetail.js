
import { getProductDetailData } from "../../api/getData.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productId: 0,
    curTabIndex: 0,
    productInfo: {},
    productNum: 1,
    targetSection: '',
    sectionHeightArr: [],
    province: '',
    city: '',
    area: '',
    multiArray: [],
    multiIndex: [0, 0, 0],
    provinceArray: ['广东省', '北京市', '浙江省', '天津市', '安徽省', '上海市', '福建省', '重庆市', '江西省', '河南省'],
    cityArray: ['广州市', '佛山市', '江门市', '湛江市', '茂名市', '肇庆市', '河源市', '东莞市'],
    areaArray: ['天河区', '越秀区', '东山区', '海珠区', '荔湾区', '白云区', '黄埔区', '芳村区', '花都区', '番禺区', '从化市'],
    isCurTypeIndex: 0,
    curDetailTabIndex: 0,
    detailContsHeightArr: [],
    isCollected: false,
    addToCartNum: 0,
    isShowScrTopIcon: false,
    addAnimation: '',
    opacity:0,
    isShowAnimation: false
  },
  //切换tab
  switchTab: function (e) {
    var _curTabIndex = e.currentTarget.dataset.index;
    this.setData({
      curTabIndex: _curTabIndex,
      targetSection: 'section' + _curTabIndex
    })
  },
  //查看大图
  viewBigImages: function (e) {
    console.log(e.currentTarget.dataset);
    var picUrlArr = e.currentTarget.dataset.picarr;
    wx.previewImage({
      current: picUrlArr[e.target.dataset.index], // 当前显示图片的http链接
      urls: picUrlArr  // 需要预览的图片http链接列表
    });
  },
  //侦听加减
  operationNum: function ($operationObj) {
    var _productNum = this.data.productNum;
    if ($operationObj.detail.type == 'add')
      _productNum += $operationObj.detail.num;
    else
      _productNum -= $operationObj.detail.num;
    this.setData({
      productNum: _productNum
    });
  },
  //监听页面滚动
  pageScroll: function (e) {
    var _scrollTop = e.detail.scrollTop;
    var _sectionHeightArr = this.data.sectionHeightArr;
    for (var i = 0; i < _sectionHeightArr.length - 1; i++) {
      var height1 = _sectionHeightArr[i];
      var height2 = _sectionHeightArr[i + 1];
      if (_scrollTop >= height1 && _scrollTop < height2) {
        this.setData({
          curTabIndex: i
        });
        break;
      }
    }
    //判断是否显示回到顶部的按钮
    if (e.detail.scrollTop > 1200) {
      this.setData({
        isShowScrTopIcon: true
      });
    }
    else {
      this.setData({
        isShowScrTopIcon: false
      });
    }
  },
  //回到顶部
  onScrollTopTap: function () {
    this.setData({
      scrollTop: 0
    });
  },
  //选择地址
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  //选择规格
  selectType: function (e) {
    var _index = e.target.dataset.index;
    if (_index) {
      this.setData({
        isCurTypeIndex: _index
      })
    }
  },
  //切换商品详情的tab
  switchDetailTab: function (e) {
    var _curIndex = e.target.dataset.index;
    if (_curIndex) {
      this.setData({
        curDetailTabIndex: _curIndex
      });
    }
  },
  //点击收藏
  onCollection: function () {
    var _isCollected = !this.data.isCollected;
    var _isCollectedArr = wx.getStorageSync('isCollectedArr') || {};
    if (!_isCollected)
      delete (_isCollectedArr[this.data.productId]);
    else
      _isCollectedArr[this.data.productId] = _isCollected;
    wx.setStorageSync('isCollectedArr', _isCollectedArr);
    var tip = '';
    if (_isCollected)
      tip = "收藏成功";
    else
      tip = "取消收藏";
    wx.showToast({
      title: tip
    });
    this.setData({
      isCollected: _isCollected
    });
  },
  //进入购物车页面
  toCartPage: function () {
    wx.navigateTo({
      url: '../cart-back/cart-back'
    })
  },
  //点击直接购买
  goToBuy: function () {
    var selectedIdObj={};
    var totalPrice=0;
    selectedIdObj[this.data.productId]=true;
    totalPrice=(this.data.productNum*this.data.productInfo.marketPrice[this.data.productId]).toFixed(2);
    wx.navigateTo({
      url: '../orderDetail/orderDetail?totalPrice=' + totalPrice+"&selectedIdObj="+JSON.stringify(selectedIdObj)+"&isTobuy=true&num="+this.data.productNum
    });
  },
  //点击加入购物车
  addNumToCart: function () {
    var _addToCartNum = this.data.addToCartNum;
    _addToCartNum += this.data.productNum;
    // this.animation.translate3d(0,-22,0).scale(1.2).step({duration:1000});
    // this.animation.opacity(0).step({duration:500});
    // this.animation.translate3d(0,0,0).scale(.6).step({duration:0});
    wx.setStorageSync('addToCartNum', _addToCartNum);
    var goodsInfo = wx.getStorageSync('goodsInfo') || {};
    goodsInfo[this.data.productId] = goodsInfo[this.data.productId] || 0;
    goodsInfo[this.data.productId] += this.data.productNum;
    wx.setStorageSync('goodsInfo', goodsInfo);
    this.setData({
      isShowAnimation: true,
      addToCartNum: _addToCartNum,
      isShowAnimation: true,
      // opacity:1,
      // addAnimation:this.animation.export()
    });
    wx.showToast({
      title: "加入购物车"
    });
  },
  //加入购物车的动画结束
  onAddAnimationEnd: function () {
    console.log("Ok");
    this.setData({
      isShowAnimation: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载...'
    });
    setTimeout(() => {
      wx.hideLoading();
      var _productInfo = getProductDetailData();
      var _multiArray = [];
      var _isCollectedArr = wx.getStorageSync('isCollectedArr');
      var _isCollected = _isCollectedArr[options.productId] || false;
      _multiArray.push(this.data.provinceArray);
      _multiArray.push(this.data.cityArray);
      _multiArray.push(this.data.areaArray);
      this.setData({
        productId: options.productId,
        productInfo: _productInfo,
        multiArray: _multiArray,
        isCollected: _isCollected
      });
      //计算每个区域的高度
      var juery = wx.createSelectorQuery();
      juery.selectAll('.section').boundingClientRect((rects) => {
        var _sectionHeightArr = [];
        var _height = 0;
        _sectionHeightArr.push(_height);
        rects.forEach(function (rect) {
          _height += rect.height;
          _sectionHeightArr.push(_height);
        });
        this.setData({
          sectionHeightArr: _sectionHeightArr
        });
      }).exec();
      //计算商品详情的三个内容的高度
      juery.selectAll('.detail-cont').boundingClientRect((rects) => {
        var _detailContsHeightArr = [];
        rects.forEach(function (rect) {
          _detailContsHeightArr.push(rect.height);
        });
        this.setData({
          detailContsHeightArr: _detailContsHeightArr
        });
      }).exec();
      //创建动画
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
      });
      this.animation = animation;
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
    var _addToCartNum = wx.getStorageSync('addToCartNum') || 0;
    this.setData({
      addToCartNum: _addToCartNum
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