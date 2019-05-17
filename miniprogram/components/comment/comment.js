// components/comment/comment.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder:{
      type: String
    },
    is_port:{
      type: Number
    },
    nameId: {
      type: Number
    },
    firstId: {
      type: Number
    },
    value:{
      type: String,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindTextAreaBlur: function (e) {
      this.properties.value = e.detail.value;
      this.commentChange();
      // this.setData({
      //   concent: e.detail.value,
      // })
    },
    commentChange() {
      if (this.properties.is_port)
      this.triggerEvent('commentChange', {
        is_port: this.properties.is_port,
        value: this.properties.value,
        nameId: this.properties.nameId,
        firstId: this.properties.firstId,
      })
      else{
        this.triggerEvent('commentChange', {
          is_port: this.properties.is_port,
          value: this.properties.value,
          nameId: this.properties.nameId,
          firstId: this.properties.firstId,
        })
      }
    },
  }
})
