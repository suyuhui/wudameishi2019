// components/star/star.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    nameId: {
      type: Number
    },
    stars:{
      type:Number,
      value:4
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    radioItems: [
      { classname: 'icon-pingxing', value: 1, checked: false },
      { classname: 'icon-pingxing', value: 2, checked: false },
      { classname: 'icon-pingxing', value: 3, checked: false },
      { classname: 'icon-pingxing', value: 4, checked: true},
      { classname: 'icon-pingxing', value: 5, checked: false }
    ],
    stars: 4
  },

  /**
   * 组件的方法列表
   */
  methods: {
    radioChange: function (e) {
      var radioItems = this.data.radioItems;
      for (var i = 0; i < e.detail.value; i++) {
        radioItems[i].checked = true;
        radioItems[i].classname = "icon-shixing";
      }
      for (var j = e.detail.value; j < radioItems.length; j++) {
        radioItems[j].checked = false;
        radioItems[j].classname = "icon-pingxing";
      }
      this.setData({
        radioItems: radioItems,
        stars: e.detail.value
      });
      this.starChange();
    },
    starChange() {
      this.triggerEvent('starChange', {
        stars: this.properties.stars,
        nameId: this.properties.nameId
      })
    },
  }
})
