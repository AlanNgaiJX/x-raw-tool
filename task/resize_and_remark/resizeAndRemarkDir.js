const nodeHelper = require("alanngai-node-helper");
const path = require("path");
const fs = require("fs");

const RESIZE_IMG_DIR_JS = path.resolve("./task/resize_img/resizeImgDir.js");
const REMARK_IMG_DIR_JS = path.resolve("./task/remark_img/remarkImgDir.js");

let INPUT = "";
let SIZE_CONFIG = "";

INPUT = nodeHelper.normalizePath(INPUT);

(async function main() {
  const processParams = nodeHelper.getProcessParams();
  if (processParams.length !== 2) {
    throw new Error("请输入正确参数");
  }
  INPUT = processParams[0];
  SIZE_CONFIG = processParams[1];

  try {
    // 校验INPUT 需为 JPG 或 PNG 文件
    const stat = await fs.statSync(INPUT);
    if (!stat.isDirectory()) {
      throw new Error(`错误，INPUT 路径需为文件夹`);
    }
  } catch (e) {
    console.error(e);
  }
  if (!SIZE_CONFIG) {
    throw new Error(`未输入 SIZE_CONFIG`);
  } else {
    if (!/^\d+,\d+$/.test(SIZE_CONFIG)) {
      // 需为 l,s 格式
      throw new Error(`请输入正确的 SIZE_CONFIG，如 1080,720`);
    }
  }

  // // 压缩图片
  const tempDir = path.resolve(INPUT, "temp");
  await nodeHelper.createDirIfNonExist(tempDir);
  console.log(`node ${RESIZE_IMG_DIR_JS} "${INPUT}" ${SIZE_CONFIG} "${tempDir}"`);
  const resultStep1 = await nodeHelper.runShellCommand(
    `node ${RESIZE_IMG_DIR_JS} "${INPUT}" ${SIZE_CONFIG} "${tempDir}"`
  );
  console.log(resultStep1);
  console.log("======step 1 ，resize 完成======");

  // 加水印
  const outputDir = path.resolve(
    INPUT,
    "output_resize_and_remark_" + SIZE_CONFIG
  );
  await nodeHelper.createDirIfNonExist(outputDir);
  const resultStep2 = await nodeHelper.runShellCommand(
    `node ${REMARK_IMG_DIR_JS} "${tempDir}" AlanNgai "${outputDir}"`
  );
  console.log(resultStep2);
  console.log("======step 2 ，remark 完成======");

  // // 删除临时文件夹
  nodeHelper.rmdir(tempDir);
  console.log("======step 3 ，删除临时文件夹 完成======");
})();
