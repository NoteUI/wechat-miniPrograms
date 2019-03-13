Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     * 用于组件自定义设置
     */
    properties: {
        sliderData:{
            type:Array,
            default:[]
        }
    },

    /**
     * 私有数据,组件的初始数据
     * 可用于模版渲染
     */
    data: {
        // 弹窗显示控制
        curRecommendIndex:0
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
        //切换推荐列表
        moveRecommendListStart: function (e) {
            this.data.startX = e.touches[0].clientX;
        },
        moveRecommendListEnd: function (e) {
            var curIndex = this.data.curRecommendIndex;
            var diffX = e.changedTouches[0].clientX - this.data.startX;
            if (Math.abs(diffX) > 50) {
                if (diffX < 0 && curIndex < this.data.sliderData.length - 1) {
                    this.setData({
                        curRecommendIndex: curIndex + 1
                    });
                }
                else if (diffX > 0 && curIndex > 0) {
                    this.setData({
                        curRecommendIndex: curIndex - 1
                    });
                }
            }
        },
    },
    ready() {

    }
})