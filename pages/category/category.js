// pages/category/category.js
import { getCategoryData} from "../../api/getData.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight:0,
    leftNavHeight:0,
    itemHight:0,
    topNavsOffsetTop:[],
    categoryData:{},
    curLeftNavIndex:0,
    initScrollTopNumber:0,
    duration:330
  },
  onLeftNavItemTap:function(e){
    var curLeftNavIndex=e.currentTarget.dataset.index;
    this.setData({
      initScrollTopNumber:0,
      curLeftNavIndex:curLeftNavIndex
    });
    //判断是否要移动左侧的导航菜单
    this.scrollNavItem(e.currentTarget.offsetTop);
  },
  scrollNavItem: function (curNavItemOffsetTop) {
    //判断是否需要移动菜单，只有当菜单的总宽度大于屏幕高度才移动
    if (this.data.leftNavHeight > this.data.winHeight) {
      var centerY = curNavItemOffsetTop + this.data.itemHight/ 2;
      var scrollTop = 0;
      if (centerY > this.data.winHeight / 2 && (centerY + this.data.winHeight / 2 < this.data.leftNavHeight)) {
        scrollTop = centerY - this.data.winHeight / 2;
        console.debug("2");
      }
      else if (centerY < this.data.winHeight / 2) {
        scrollTop = 0;
        console.debug("1");
      }
      else {
        console.debug("3");
        scrollTop = this.data.leftNavHeight - this.data.winHeight;
      }
      this.setData({
        topNavScrollTop: scrollTop
      });
    }
  },
  //点击右侧的列表内容，进入搜索页面
  onCategoryContItemTap:function(e){
    wx.navigateTo({
      url:"../searchPage/searchPage?value="+e.currentTarget.dataset.txt
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title:'正在加载...'
    });
    setTimeout(()=>{
      var categoryData=getCategoryData();
      wx.hideLoading();
      this.setData({
        categoryData:categoryData.pageData
      });
      wx.getSystemInfo({
        success: (res)=>{
          this.setData({
            winHeight:res.windowHeight
          })
        }
      });
      var query = wx.createSelectorQuery()
      query.selectAll('.left-category-item').boundingClientRect((res)=>{
        var _leftNavHeight=0;
        res.forEach(el => {
          _leftNavHeight+=el.height;
        });
        this.setData({
          itemHight:res[0].height,
          leftNavHeight:_leftNavHeight
        });
      }).exec();
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
    this.setData({
      initScrollTopNumber:0
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