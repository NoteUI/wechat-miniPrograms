// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  toEditAdrr:function(){
    wx.navigateTo({
      url:'../manageAddress/manageAddress'
    });
  },
  toMyOrderList:function(){
    wx.navigateTo({
      url:'../myOrderList/myOrderList',
      success:function(){
        wx.setNavigationBarTitle({
          title:'我的订单'
        })
      }
    });
  },
  toCoupons: function () {
    wx.navigateTo({
      url: '../coupons/coupons',
      success: function () {
        wx.setNavigationBarTitle({
          title: '优惠卡券'
        })
      }
    });
  },
  toMyCollection:function(){
    wx.navigateTo({
      url:'../myCollection/myCollection',
      success:function(){
        wx.setNavigationBarTitle({
          title:'我的收藏'
        })
      }
    });
  },
  toAboutUs:function(){
    wx.showActionSheet({
      itemList: ['拨号021-69190018'],
  success: function(res) {
     wx.makePhoneCall({
       phoneNumber: '021-69190018' 
    });
  }
})
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