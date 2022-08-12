/* 抓取文件夹下多个raf的exif信息，并记录为json */
const fs = require("fs");
const getExifFromRaf = require("./getExifFromRaf.js");
const nodeHelper = require("alanngai-node-helper");

let FROM = "../../images/WhiteBalanceFineTune";
let TO = "../../exif/WhiteBalanceFineTune";

(async function main() {
  const fileList = nodeHelper.getAllFileNameFromDir(FROM).map((fileName) => {
    return FROM + "/" + fileName;
  });
  for (const filePath of fileList) {
    const name = nodeHelper.getFileNameOnly(filePath);
    const outputPath = TO + "/" + name + ".json";
    const json = await getExifFromRaf(filePath);
    fs.writeFileSync(outputPath, JSON.stringify(json, null, 2));
    console.log(`操作成功:${name}`);
  }
})();
