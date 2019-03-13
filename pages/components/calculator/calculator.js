Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    num: {
      type: Number,
      value: 1
    },
    id: {
      type: Number,
      value: 0
    }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    num: 1
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    // 加
    add() {
      var _num = this.data.num;
      _num++;
      this.operationNum("add", _num,1);
    },
    // 减
    reduce() {
      var _num = this.data.num;
      _num--;
      if (_num < 1) {
        wx.showToast({
          title: '数量不能小于1'
        });
        _num = 1;
      }
      else
        this.operationNum("reduce", _num,1);
    },
    //设置当前数目，触发事件
    operationNum($type, $curNum,$operateNum) {
      var operationObj = {};
      operationObj.type = $type;
      operationObj.num = $operateNum;
      this.setData({
        num: $curNum
      });
      this.triggerEvent('operationNum', operationObj)
    },
    //监听键盘输入
    onInputTxt: function (e) {
      var _onInputTxt = e.detail.value;
      var oldNum = this.data.num;
      if (_onInputTxt < 1) {
        wx.showToast({
          title: '数量不能小于1'
        });
        _onInputTxt=1;
      }
      else {
        if (_onInputTxt > oldNum)
          this.operationNum("add",_onInputTxt, _onInputTxt - oldNum);
        else
          this.operationNum("reduce",_onInputTxt, oldNum - _onInputTxt);
      }
      this.setData({
        num: _onInputTxt
      });
    }
  },
  ready() {
    this.data.num = this.properties.num;
  }
})