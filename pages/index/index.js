//index.js
//获取应用实例
import { getIndexData, getIndexCategoryCom, getIndexMoreData } from "../../api/getData.js"
const app = getApp()
Page({
  data: {
    topNavs: [],
    curTopNavId: 1,
    topNavScrollLeft: 0,
    topNavsOffsetLeft: [],
    screenWidth: 0,
    topNavWidth: 0,
    itemWidth: 0,
    activeBarWidth: 0,
    activeBarAnimation: {},
    currentCategoryPage: 0,
    categoryPagesData: [{}, {}, {}, {}, {}, {}, {}],
    isShowLoading: true,
    isCurPromoItemIndex: 0,
    promoListScrollLeft: 0,
    curSliderCIndex: 1,
    oldSliderCIndex: 0,
    curSliderLIndexArr: [],
    isShowScrTopIcon: false,
    scrollTop: 0,
    isLoadingMore: false,
    curPageArr: [0, 0, 0, 0, 0, 0, 0],
    totoalPageArr: [1, 2, 1, 1, 2, 3, 4],
    loadingMoreTipTxtArr: ['loading...', 'loading...', 'loading...', 'loading...', 'loading...', 'loading...', 'loading...'],

  },
  // 页面上拉加载更多
  loadMore: function () {
    //给正在加载数据设置开关
    if (!this.data.isLoadingMore) {
      var curPageArr = this.data.curPageArr;
      var curCPageIndex = this.data.currentCategoryPage;
      var tipTxtArr = this.data.loadingMoreTipTxtArr;
      if (curPageArr[curCPageIndex] < this.data.totoalPageArr[curCPageIndex]) {
        curPageArr[curCPageIndex]++;
        tipTxtArr[curCPageIndex] = "正在加载数据...";
        this.setData({
          loadingMoreTipTxtArr: tipTxtArr,
          isShowLoadingMore: true,
          isLoadingMore: true,
          curPageArr: curPageArr
        });
        console.log(curPageArr);
        setTimeout(() => {
          var curCategoryPagesData = this.data.categoryPagesData;
          var getMoreData = getIndexMoreData().lists;
          getMoreData.forEach((item) => {
            if (this.data.currentCategoryPage > 0)
              curCategoryPagesData[curCPageIndex].moreProducts.lists.push(item);
            else
              curCategoryPagesData[curCPageIndex].recommendFY.lists.push(item);
          });
          this.setData({
            categoryPagesData: curCategoryPagesData,
            isLoadingMore: false
          });
        }, 600);
      }
      else {
        tipTxtArr[curCPageIndex] = "没有更多的商品了";
        this.setData({
          loadingMoreTipTxtArr: tipTxtArr,
          isLoadingMore: false
        });
      }
    }
  },
  onTopNavItemTap: function (event) {
    var curNavItem = event.currentTarget;
    var _curNavId = curNavItem.dataset.id;
    //设置当前navItem对应的页面
    this.setData({
      currentCategoryPage: _curNavId - 1
    });
  },
  scrollNavItem: function (curNavItemOffsetLeft) {
    //判断是否需要移动菜单，只有当菜单的总宽度大于屏幕宽度才移动
    if (this.data.topNavWidth > this.data.screenWidth) {
      var centerX = curNavItemOffsetLeft + (this.data.itemWidth - 30) / 2;
      var scrollLeft = 0;
      if (centerX > this.data.screenWidth / 2 && (centerX + this.data.screenWidth / 2 < this.data.topNavWidth)) {
        scrollLeft = centerX - this.data.screenWidth / 2;
        console.debug("2");
      }
      else if (centerX < this.data.screenWidth / 2) {
        scrollLeft = 0;
        console.debug("1");
      }
      else {
        console.debug("3");
        scrollLeft = this.data.topNavWidth - this.data.screenWidth;
      }
      this.setData({
        topNavScrollLeft: scrollLeft
      });
    }
  },
  setActiveTopNavItemBar: function (curNavItemOffsetLeft) {
    //动态设置状态条的位置 
    this.animation.translate(curNavItemOffsetLeft + (this.data.itemWidth - this.data.activeBarWidth) / 2).step()
    this.setData({
      activeBarAnimation: this.animation.export()
    });
  },
  changeActiveNavItem: function (event) {
    var curIndex = event.detail.current;
    //初始化页面的位置和隐藏回到顶部的按钮
    this.setData({
      curTopNavId: curIndex + 1,
      currentCategoryPage:curIndex,
      scrollTop: 0,
      isShowScrTopIcon: false
    });

    //获取当前高亮的topNavItem的offsetLeft
    var curNavItemOffset = this.data.topNavsOffsetLeft[curIndex];
    //判断是否需要移动菜单，只有当菜单的总宽度大于屏幕宽度才移动
    this.scrollNavItem(curNavItemOffset);
    //设置当前点击状态条的位置
    this.setActiveTopNavItemBar(curNavItemOffset);

    //判断是否要加载当前分类页面的数据

    var dataArr = this.data.categoryPagesData;
    if (curIndex > 0 && !dataArr[curIndex]) {
      //提示加载数据
      wx.showLoading({
        title: '加载中...'
      });
      setTimeout(()=> {
        dataArr[curIndex] = getIndexCategoryCom(curIndex).pageData;
        wx.hideLoading({});
        this.setData({
          categoryPagesData: dataArr
        });
      }, 500);
    }
  },
  getScreenAndNavWidth: function () {
    var _screenWidth = 0;
    var _topNavWidth = 0;
    //获取屏幕的宽度
    wx.getSystemInfo({
      success: (res) => {
        _screenWidth = res.windowWidth;
        this.setData({
          screenWidth: _screenWidth
        });
      }
    });
    //获取topNav的总宽度
    var query = wx.createSelectorQuery()
    query.selectAll('.top-nav-item').boundingClientRect();
    query.select('.activeTopNavItemBar').boundingClientRect();
    query.exec((res) => {
      var _topNavWidth = 0;
      var _activeBarWidth = 0;
      var _topNavsOffsetLeft = []
      res[0].forEach(function (rect) {
        _topNavWidth += rect.width;
        _topNavsOffsetLeft.push(rect.left);
      });
      _activeBarWidth = res[1].width;
      this.setData({
        topNavWidth: _topNavWidth,
        topNavsOffsetLeft: _topNavsOffsetLeft,
        itemWidth: res[0][0].width,
        activeBarWidth: _activeBarWidth
      });

      //初始化设置topNav状态条的位置 
      this.animation.translate((this.data.itemWidth - this.data.activeBarWidth) / 2).step();
      this.setData({
        activeBarAnimation: this.animation.export()
      });
    });
  },
  //点击分类按钮，链接到分类页面
  navigateToCategory: function () {
    wx.switchTab({
      url: '../category/category'
    });
  },
  //点击搜索框跳转到搜索页面
  onSearchInputTap: function (e) {
    wx.navigateTo({
      url: "../searchPage/searchPage?placeHolder=" + e.currentTarget.dataset.placeholder
    })
  },
  //进入商品详情页面
  toProductDetail: function (e) {
    wx.navigateTo({
      url: '../productDetail/productDetail?productId=1'
      //url: '../productDetail/productDetail?productId=' + e.currentTarget.dataset.id
    });
  },
  //切换促销tab
  switchPromoTab: function (e) {
    this.setData({
      isCurPromoItemIndex: e.currentTarget.dataset.index,
      promoListScrollLeft: 0
    });
  },
  //中间特写的产品列表的滑动变化
  productSilderCBChange: function (e) {
    this.setData({
      oldSliderCIndex: e.detail.current,
      curSliderCIndex: e.detail.current + 1
    });
  },
  //左边特写的产品列表的滑动变化
  productSilderLBChange: function (e) {
    var _curSliderLIndexArr = this.data.curSliderLIndexArr;
    _curSliderLIndexArr[this.data.currentCategoryPage] = e.detail.current + 1;
    this.setData({
      curSliderLIndexArr: _curSliderLIndexArr
    });
  },
  // 回到顶部
  onScrollTopTap: function () {
    this.setData({
      scrollTop: 0
    });
  },
  pageScroll: function (e) {
    if (e.detail.scrollTop > 600) {
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
  onLoad: function () {
    //提示加载数据
    wx.showLoading({
      title: '加载中...'
    });
    //获取页面数据
    setTimeout(() => {
      var indexData = getIndexData();
      var pagesArr = new Array(indexData.topNavs.length);
      var _curSliderLIndexArr = [];
      pagesArr[0] = indexData.pageData;
      for (var i = 0; i < pagesArr.length; i++) {
        _curSliderLIndexArr.push(1);
      }
      
      wx.hideLoading();
      this.setData({
        topNavs: indexData.topNavs,
        categoryPagesData: pagesArr,
        curSliderLIndexArr: _curSliderLIndexArr
      });
      //topNav的状态条设置动画
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
      });
      this.animation = animation;
      this.animation.opacity(1).step();
      this.setData({
        activeBarAnimation: this.animation.export()
      });
      
      this.getScreenAndNavWidth();
    }, 500);
  },
  onShow: function () {

  }
})
