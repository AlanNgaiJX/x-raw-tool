/* 
  多个配方文件夹打水印
  用例：
  npm run remarkImgRecipes D:\Desktop\testimage\test-recipes-img AlanNgai D:\Desktop\testimage\test-ouput
*/
const nodeHelper = require("alanngai-node-helper");
const magickTool = require("alanngai-image-magick-tool");

const fs = require("fs");

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
  const subDirPaths = nodeHelper.getAllFileNameFromDir(INPUT).map((name) => {
    return INPUT + "/" + name;
  });

  for (let i = 0; i < subDirPaths.length; i++) {
    const subDirPath = subDirPaths[i];
    const outputSubDirPath = OUTPUT + subDirPath.replace(INPUT, "");

    await nodeHelper.createDirIfNonExist(outputSubDirPath); // 创建子文件夹

    const filePaths = nodeHelper
      .getAllFileNameFromDir(subDirPath)
      .filter((name) => {
        const fileExt = nodeHelper.getFileExt(name);
        return fileExt === "jpg" || fileExt === "png";
      })
      .map((name) => {
        return subDirPath + "/" + name;
      });

    for (let j = 0; j < filePaths.length; j++) {
      const filePath = filePaths[j];
      // 计算样式
      const { width, height } = await magickTool.getImageSize(filePath);
      const l = Math.max(width, height);
      const _FONT_CONFIG = JSON.parse(JSON.stringify(FONT_CONFIG));
      _FONT_CONFIG.size = l * 0.02; // 字体大小为长边的 2%
      _FONT_CONFIG.x = l * 0.03; // x轴偏移为长边的 3%
      _FONT_CONFIG.y = l * 0.02; // y轴偏移为长边的 2%
      _FONT_CONFIG.txt = TXT;

      // 输出文件名称
      const outputFilename = `${nodeHelper.getFileNameOnly(
        filePath
      )}@remark.${nodeHelper.getFileExt(filePath)}`;

      // 转换
      const result = await magickTool.remarkImage(
        filePath,
        outputSubDirPath + "/" + outputFilename,
        _FONT_CONFIG
      );

      console.log(
        `图片已添加水印：${result}，当前文件夹进度:${j + 1}/${
          filePaths.length
        }，总进度：${i + 1}/${subDirPaths.length}`
      );
    }
  }
})();

/**
 * 获取控制台参数，校验，并设置默认值
 * INPUT (必填)
 * TXT（必填）
 * OUTPUT (必填)
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
    if (!stat.isDirectory()) {
      throw new Error(`错误，INPUT 路径需为文件夹`);
    }
  } catch (e) {
    console.error(e);
  }

  if (!TXT) {
    throw new Error(`未输入 TXT`);
  }

  if (!OUTPUT) {
    throw new Error(`未输入 OUTPUT`);
  } else {
    try {
      const stat = await fs.statSync(INPUT);
      if (!stat.isDirectory()) {
        throw new Error(`错误，OUTPUT 路径需为文件夹`);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
