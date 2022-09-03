/* 
  单张图片打水印
  用例：
  npm run remarkImgOne D:\Desktop\testimage\recipe-images\DSCF7958.jpg AlanNgai (选填输出文件)
*/
const nodeHelper = require("alanngai-node-helper");
const magickTool = require("alanngai-image-magick-tool");

const fs = require("fs");
const path = require("path");

const FONT_CONFIG = {
  font: "D:/Desktop/alan/mine/fujifilm/x-raw-tool/task/remark_img/assets/Savoye LET Plain.ttf",
  txt: null,
  size: null,
  x: null,
  y: null,
  gravity: "SouthEast",
  strokeWidth: null,
  strokeColor: null,
  fillColor: "rgba(0,0,0,0.3)",
};

let INPUT = "";
let TXT = "";
let OUTPUT = "";
INPUT = nodeHelper.normalizePath(INPUT);
OUTPUT = nodeHelper.normalizePath(OUTPUT);

(async function main() {
  await getParamsWithCheck();

  // 计算样式
  const { width, height } = await magickTool.getImageSize(INPUT);
  const l = Math.max(width, height);
  const _FONT_CONFIG = JSON.parse(JSON.stringify(FONT_CONFIG));
  _FONT_CONFIG.size = l * 0.02; // 字体大小为长边的 2%
  _FONT_CONFIG.x = l * 0.03; // x轴偏移为长边的 3%
  _FONT_CONFIG.y = l * 0.02; // y轴偏移为长边的 2%
  _FONT_CONFIG.txt = TXT;

  // 输出文件名称
  const outputFilename = `${nodeHelper.getFileNameOnly(
    INPUT
  )}@remark.${nodeHelper.getFileExt(INPUT)}`;

  // 转换
  const result = await magickTool.remarkImage(
    INPUT,
    OUTPUT + "/" + outputFilename,
    _FONT_CONFIG
  );
  console.log("图片已添加水印：", result);
})();

/**
 * 获取控制台参数，校验，并设置默认值
 * INPUT (必填)
 * TXT（必填）
 * OUTPUT (选填，默认为输入文件夹)
 */
async function getParamsWithCheck() {
  const processParams = nodeHelper.getProcessParams();
  if (processParams) {
    processParams.length > 0 &&
      (INPUT = nodeHelper.normalizePath(processParams[0]));
    processParams.length > 1 && (TXT = processParams[1]);
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

  if (!TXT) {
    throw new Error(`未输入 TXT`);
  }

  if (OUTPUT) {
    // 校验 OUTPUT 需为文件夹
    try {
      const stat = await fs.statSync(INPUT);
      if (!stat.isDirectory()) {
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
