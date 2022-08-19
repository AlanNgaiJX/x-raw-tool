/*  
  capture one 选片后 复制照片到x-raw工作台
  命令: node copyFromC1.js 参数1:c1文件夹 参数2:目标文件夹
*/
const nodeHelper = require("alanngai-node-helper");

let FROM = "E:/c1workspace/2022.7.31-傍晚-同福西洲头咀公园/Capture";
let ORIGIN = "E:/照片存档/fujifilm-2022.7.31-傍晚-同福西洲头咀公园";
let TO = "E:/xrawWorkspace/2022.7.31-同福西洲头咀公园";

(function main() {
  const processParams = nodeHelper.getProcessParams();
  if (processParams && processParams.length === 2) {
    FROM = processParams[0];
    ORIGIN = processParams[1];
    TO = processParams[2];
  }

  getAllRaf().forEach((fullFileName) => {
    const _from = ORIGIN + "/" + fullFileName;
    const _to = TO + "/" + fullFileName;
    nodeHelper.copyFile(_from, _to);
  });
  console.log("操作成功");
})();

function getAllRaf() {
  return nodeHelper
    .getAllFileNameFromDir(FROM)
    .filter((fullFileName) => fullFileName.indexOf(".RAF") > -1);
}
