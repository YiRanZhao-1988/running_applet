/**
 * 训练截图上传入口（chooseMedia）；Garmin / Apple Watch / Keep 为说明标签。
 */
Component({
  properties: {
    upload: {
      type: Object,
      value: {},
    },
  },

  data: {
    previewUrl: "",
    fileName: "",
  },

  methods: {
    onChooseImage() {
      wx.chooseMedia({
        count: 1,
        mediaType: ["image"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const file = res.tempFiles[0];
          const path = file.tempFilePath;
          this.setData({ previewUrl: path, fileName: "训练截图" });
          this.triggerEvent("changed", {
            tempPath: path,
            sizeBytes: file.size,
          });
        },
      });
    },

    onClear() {
      this.setData({ previewUrl: "", fileName: "" });
      this.triggerEvent("changed", { tempPath: "", sizeBytes: 0 });
    },
  },
});
