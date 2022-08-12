/* 抓取单个raf的exif信息，并记录为json */
const fs = require("fs");
const getExifFromRaf = require("./getExifFromRaf.js");
const nodeHelper = require("alanngai-node-helper");

let FROM = "../../images/filmMode/DSCF6886.RAF"; // 照片路径 // D:/我的硬盘将储/c1/微距/Capture/微距00064.raf
let TO = "../../exif"; // 输出到文件夹路径 // E:/xrawWorkspace\tool\test

(function main() {
  const processParams = nodeHelper.getProcessParams();
  if (processParams && processParams.length === 2) {
    FROM = processParams[0];
    TO = processParams[1];
  }
  getExifFromRaf(FROM)
    .then((json) => {
      const name = nodeHelper.getFileNameOnly(FROM);
      const outputPath = TO + "/" + name + ".json";
      fs.writeFileSync(outputPath, JSON.stringify(json));
      console.log("操作成功");
    })
    .catch((err) => {
      console.log("操作失败");
      throw err;
    });
})();
