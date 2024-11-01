export const HIGHCHARTS_CONFIG = {
  credits: { enabled: false },
  exporting: {
    buttons: {
      contextButton: {
        symbol: 'menu', // 设置按钮图标，可根据需求更改
        menuItems: [
          {
            text: '全螢幕', // 初始文本
            onclick: function () {
              this.fullscreen.toggle() // 切换全屏模式
            },
          },
          {
            text: '列印',
            onclick: function () {
              window.print()
            },
          },
        ],
      },
    },
    enabled: false,
  },
  chart: {
    events: {
      redraw: function () {
        // 更新按钮文本
        var exportBtn = this.exportSVGElements[0] // 获取导出按钮
        if (this.fullscreen.isOpen) {
          exportBtn.element.childNodes[0].textContent = '退出全螢幕'
        } else {
          exportBtn.element.childNodes[0].textContent = '全螢幕'
        }
      },
    },
  },
}

