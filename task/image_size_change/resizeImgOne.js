/* 
  转换单张图片的大小
  用例：
  npm run resizeImgOne D:\Desktop\testimage\recipe-images\DSCF7958.jpg 1080,720 (选填输出文件)
*/
const nodeHelper = require("alanngai-node-helper");
const magickTool = require("alanngai-image-magick-tool");
const fs = require("fs");
const path = require("path");

let INPUT = "";
let SIZE_CONFIG = "";
let OUTPUT = "";
INPUT = nodeHelper.normalizePath(INPUT);
OUTPUT = nodeHelper.normalizePath(OUTPUT);

(async function main() {
  await getParamsWithCheck();
  const { width, height } = await magickTool.getImageSize(INPUT);
  const [l, s] = SIZE_CONFIG.split(",");
  const sizeConfig = magickTool.getSizeConfig(l, s, width, height);
  const outputFilename = `${nodeHelper.getFileNameOnly(
    INPUT
  )}@${SIZE_CONFIG}.${nodeHelper.getFileExt(INPUT)}`;
  const result = await magickTool.resizeImage(
    INPUT,
    OUTPUT + "/" + outputFilename,
    sizeConfig
  );
  console.log("图片已转换：", result);
})();

/**
 * 获取控制台参数，校验，并设置默认值
 * INPUT (必填)
 * SIZE_CONFIG（必填）
 * OUTPUT (选填，默认为输入文件夹)
 */
async function getParamsWithCheck() {
  const processParams = nodeHelper.getProcessParams();
  if (processParams) {
    processParams.length > 0 &&
      (INPUT = nodeHelper.normalizePath(processParams[0]));
    processParams.length > 1 && (SIZE_CONFIG = processParams[1]);
    processParams.length > 2 &&
      (OUTPUT = nodeHelper.normalizePath(processParams[2]));
  }

  try {
    // 校验INPUT 需为 JPG 或 PNG 文件
    const stat = await fs.statSync(INPUT);
    if (stat.isDirectory()) {
      throw new Error(`错误，INPUT 路径需为文件`);
    }
    if (
      nodeHelper.getFileExt(INPUT) !== "jpg" &&
      nodeHelper.getFileExt(INPUT) !== "png"
    ) {
      throw new Error("错误，该文件需为 jpg 或 png 格式");
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

  if (OUTPUT) {
    // 校验 OUTPUT 需为文件夹
    try {
      const stat = await fs.statSync(INPUT);
      if (stat.isDirectory()) {
        throw new Error(`错误，OUTPUT 路径需为文件夹`);
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    // 若没指定 OUTPUT 则导出到 INPUT 所在的文件夹中
    OUTPUT = path.dirname(INPUT);
  }
}
