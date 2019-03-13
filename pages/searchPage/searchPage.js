// pages/searchPage/searchPage.js
import { getHotKeyWords, getSearchResults } from "../../api/getData.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputs: { searchKeyWords: "", isFocus: true, disabled: false, value: '' },
    latestSearchKeyWords: [],
    hotKeyWords: [],
    isSearching: true,
    isShowClearBtn: false,
    searchResultArr: [],
    hasResults: true,
    isLoading: true,
    isShowItem01: false,
    isShowItem02: false,
    isShowMask: false,
    selectedItem01Txt: '综合',
    selectedItem03Txt: '服务',
    curSType01Index: 0,
    curSType02IndexArr: new Array(6),
    tempCurSType02IndexArr: new Array(6),
    curSType02STxtArr: new Array(6),
    tempCurSType02STxtArr: new Array(6),
    isFixedTop: false,
    isShowLoadingMore: false,
    isLoadingMore: false,
    totoalPage: 3,
    curPage: 0,
    loadingMoreTipTxt: ''
  },
  //返回上一级页面
  backTo: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  //点击进入分类页面
  navigateToCategory: function () {
    console.log("wedwe");
    wx.switchTab({
      url: '../category/category'
    });
  },
  onSearchInputTap: function () {

  },
  //监听输入内容
  onInputTxt: function (e) {
    let _isShowClearBtn;
    if (e.detail.value) {
      _isShowClearBtn = true;
    }
    else {
      _isShowClearBtn = false;
      this.backToSearchView();
    }
    this.setData({
      isShowClearBtn: _isShowClearBtn
    });
  },
  //清除输入框的内容
  clearInput: function () {
    let _inputs = this.data.inputs;
    _inputs.value = '';
    this.setData({
      inputs: _inputs,
    });
    this.backToSearchView();
  },
  //返回搜索页面
  backToSearchView: function () {
    //初始化数据
    this.setData({
      isShowClearBtn: false,
      isSearching: true,
      selectedItem01Txt: '综合',
      selectedItem03Txt: '服务',
      curPage: 0,
      curSType01Index: 0,
      curSType02IndexArr: new Array(6),
      tempCurSType02IndexArr: new Array(6),
      curSType02STxtArr: new Array(6),
      tempCurSType02STxtArr: new Array(6)
    });
  },
  //进入商品详情页面
  toProductDetail:function(e){
     wx.navigateTo({
       url:'../productDetail/productDetail?productId='+e.currentTarget.dataset.id
     });
  },
  //按‘完成’进行搜索
  onSearching: function (event) {
    //存储当前搜素记录
    var curSearchKeywords = event.detail.value;
    //显示查询的结果页面
    this.loadingSearchResults();
    //存储当前搜素记录
    this.saveSearchHistory(curSearchKeywords);
  },
  //显示查询的结果页面
  loadingSearchResults: function () {
    this.setData({
      isSearching: false,
      isLoading: true,
      searchResultArr: []
    });
    wx.showLoading({
      title: "正在搜索..."
    });
    setTimeout(() => {
      var _searchResults = getSearchResults();
      _searchResults.sort(function () { return .5 - Math.random(); });
      this.setData({
        isLoading: false,
        searchResultArr: _searchResults,
        hasResults: _searchResults.length ? true : false
      });
      wx.hideLoading();
    }, 1000);
  },
  //保存当前搜索关键词
  saveSearchHistory: function ($curSearchKeywords) {
    var tempArr = [];
    var _latestSearchKeyWords = wx.getStorageSync('latestSearchKeyWords');
    if (_latestSearchKeyWords) {
      tempArr = _latestSearchKeyWords.split(',');
    }
    else {
      tempArr = [];
    }
    //避免存储重复历史搜索数据
    var _index = tempArr.findIndex(item => { return item == $curSearchKeywords });
    if (_index == -1) {
      tempArr.push($curSearchKeywords);
      _latestSearchKeyWords = tempArr.join(",");
      wx.setStorageSync('latestSearchKeyWords', _latestSearchKeyWords);
      this.setData({
        latestSearchKeyWords: tempArr
      });
    }
  },
  //清除所有的搜索历史
  clearAll: function () {
    wx.showModal({
      title: '确定要删除"最近搜索"吗?',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync('latestSearchKeyWords');
          this.setData({
            latestSearchKeyWords: []
          });
        }
      }
    });
  },
  //清除选择的搜索历史
  delCurKeywords: function (event) {
    var curKeywords = event.currentTarget.dataset.keywords;
    var _latestSearchKeyWords = wx.getStorageSync('latestSearchKeyWords');
    var tempArr = [];
    tempArr = _latestSearchKeyWords.split(',');
    tempArr.forEach((el, index) => {
      if (el == curKeywords)
        tempArr.splice(index, 1);
    });
    _latestSearchKeyWords = tempArr.join(',');
    wx.setStorageSync('latestSearchKeyWords', _latestSearchKeyWords);
    this.setData({
      latestSearchKeyWords: tempArr
    });
  },
  // 点击‘最近搜索’和‘热门搜索’陈列的关键词进行搜索
  onKeyWordsTap: function (e) {
    var curSearchKeywords = e.target.dataset.txt;
    if (curSearchKeywords) {
      var _inputs = this.data.inputs;
      _inputs.value = curSearchKeywords;
      _inputs.isFocus = false;
      this.setData({
        inputs: _inputs,
        isShowClearBtn: true
      });
      //显示查询的结果页面
      this.loadingSearchResults();
      //存储当前搜素记录
      this.saveSearchHistory(curSearchKeywords);
    }
  },
  //点击第一个tab选项
  showFold01: function () {
    this.setData({
      isShowItem01: !this.data.isShowItem01,
      isShowItem02: false,
      isShowMask: !this.data.isShowItem01,
      tempCurSType02IndexArr: this.data.curSType02IndexArr,
      tempCurSType02STxtArr: this.data.curSType02STxtArr
    });
  },
  //点击第三个tab选项
  showFold02: function () {
    this.setData({
      isShowItem01: false,
      isShowItem02: !this.data.isShowItem02,
      isShowMask: !this.data.isShowItem02,
      tempCurSType02IndexArr: this.data.curSType02IndexArr,
      tempCurSType02STxtArr: this.data.curSType02STxtArr
    });
  },
  //点击mask背景，隐藏选项内容
  foldItems: function () {
    this.setData({
      isShowItem01: false,
      isShowItem02: false,
      isShowMask: false,
      tempCurSType02IndexArr: this.data.curSType02IndexArr,
      tempCurSType02STxtArr: this.data.curSType02STxtArr
    });
  },
  //点选第一个tabItem对应的下拉内容
  selectedFoldItemType01: function (e) {
    var curselectedTxt = e.target.dataset.txt;
    var curselectedIndex = e.target.dataset.index;
    if (curselectedIndex != this.data.curSType01Index) {
      this.setData({
        selectedItem01Txt: curselectedTxt,
        curSType01Index: curselectedIndex,
        isShowItem01: false,
        isShowMask: false
      });
      this.rankSearchResults();
    }
  },
  //点选第三个tabItem对应的下拉内容
  selectedFoldItemType02: function (e) {
    var curselectedTxt = e.target.dataset.txt;
    var curselectedIndex = e.target.dataset.index;
    var _curSType02IndexArr = this.data.tempCurSType02IndexArr;
    var _curSType02STxtArr = this.data.tempCurSType02STxtArr;
    _curSType02IndexArr[curselectedIndex] = !this.data.tempCurSType02IndexArr[curselectedIndex];
    if (_curSType02IndexArr[curselectedIndex])
      _curSType02STxtArr[curselectedIndex] = curselectedTxt;
    else
      _curSType02STxtArr[curselectedIndex] = ''
    this.setData({
      tempCurSType02IndexArr: _curSType02IndexArr,
      tempCurSType02STxtArr: _curSType02STxtArr
    });
  },
  //点击重置按钮，重置选项
  resetOptionsTap: function () {
    this.setData({
      tempCurSType02IndexArr: new Array(6),
      tempCurSType02STxtArr: new Array(6)
    });
  },
  // 点击确定按钮
  onMultiselectOKBtnTap: function () {
    var curSelectedItem03Txt = '';
    this.data.tempCurSType02STxtArr.forEach((item, index) => {
      if (item)
        curSelectedItem03Txt += item + ',';
    });
    if (!curSelectedItem03Txt)
      curSelectedItem03Txt = "服务";
    this.setData({
      selectedItem03Txt: curSelectedItem03Txt,
      curSType02IndexArr: this.data.tempCurSType02IndexArr,
      curSType02STxtArr: this.data.tempCurSType02STxtArr,
      isShowItem02: false,
      isShowMask: false
    });
    this.rankSearchResults();
  },
  rankSearchResults: function () {
    //初始化数据
    this.setData({
      searchResultArr: [],
      curPage: 0,
      isShowLoadingMore: false,
    });
    wx.showLoading({
      title: "正在搜索..."
    });
    setTimeout(() => {
      var _searchResults = getSearchResults();
      _searchResults.sort(function () { return .5 - Math.random(); });
      this.setData({
        searchResultArr: _searchResults,
        hasResults: _searchResults.length ? true : false
      });
      wx.hideLoading();
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取本地存储的最近搜索关键词
    var _latestSearchKeyWords = wx.getStorageSync('latestSearchKeyWords');
    if (_latestSearchKeyWords) {
      this.setData({
        latestSearchKeyWords: _latestSearchKeyWords.split(','),
      });
    }
    else {
      wx.setStorageSync('latestSearchKeyWords', '');
    }
    var _inputs = this.data.inputs;
    _inputs.searchKeyWords = options.placeHolder || '';
    _inputs.searchKeyWords = options.placeHolder || '';
    _inputs.value = options.value || '';
    if (_inputs.value)
      _inputs.isFocus = false;
    else
      _inputs.isFocus = true;
    this.setData({
      inputs: _inputs,
      hotKeyWords: getHotKeyWords()
    });
    if (_inputs.value) {
      this.setData({
        isShowClearBtn: true,
        inputs: _inputs,
        hotKeyWords: getHotKeyWords()
      });
      //显示查询的结果页面
      this.loadingSearchResults();
      //存储当前搜素记录
      this.saveSearchHistory(_inputs.value);
    }
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    //给正在加载数据设置开关
    if (!this.data.isLoadingMore) {
      var curPage = this.data.curPage;
      if (curPage <= this.data.totoalPage) {
        curPage++;
        this.setData({
          loadingMoreTipTxt: "正在加载数据...",
          isShowLoadingMore: true,
          isLoadingMore: true,
          curPage: curPage
        });
        setTimeout(() => {
          var originSearchResult = this.data.searchResultArr;
          var curSearchResult = originSearchResult.concat(getSearchResults());
          this.setData({
            searchResultArr: curSearchResult,
            isLoadingMore: false
          });
        }, 1500);
      }
      else {
        this.setData({
          loadingMoreTipTxt: "没有更多的商品了"
        });
      }
    }
  },
  //监听页面滚动滚动
  onPageScroll: function (e) {
    var _isFixedTop = false;
    var _isShowScrTopIcon = false;
    var st = e.scrollTop;
    if (st >= 70) {
      _isFixedTop = true;
    }
    else {
      _isFixedTop = false;
    }
    if (st > 1000) {
      _isShowScrTopIcon = true;
    }
    else {
      _isShowScrTopIcon = false;
    }
    this.setData({
      isFixedTop: _isFixedTop,
      isShowScrTopIcon: _isShowScrTopIcon
    });
  },
  onScrollTopTap: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
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

})