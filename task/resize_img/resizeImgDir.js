/* 
  转换文件夹的图片大小
  用例：
  npm run resizeImgDir D:\Desktop\testimage\recipe-images 1080,720 (选填输出文件)
*/
const nodeHelper = require("alanngai-node-helper");
const magickTool = require("alanngai-image-magick-tool");
const fs = require("fs");

let INPUT = "";
let SIZE_CONFIG = "";
let OUTPUT = "";
INPUT = nodeHelper.normalizePath(INPUT);
OUTPUT = nodeHelper.normalizePath(OUTPUT);

(async function main() {
  await getParamsWithCheck();
  const filePaths = nodeHelper
    .getAllFileNameFromDir(INPUT)
    .filter((name) => {
      const fileExt = nodeHelper.getFileExt(name);
      return fileExt === "jpg" || fileExt === "png";
    })
    .map((name) => {
      return INPUT + "/" + name;
    });

  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    const { width, height } = await magickTool.getImageSize(filePath);
    const [l, s] = SIZE_CONFIG.split(",");
    const sizeConfig = magickTool.getSizeConfig(l, s, width, height);
    const outputFilename = `${nodeHelper.getFileNameOnly(
      filePath
    )}@${SIZE_CONFIG}.${nodeHelper.getFileExt(filePath)}`;
    const result = await magickTool.resizeImage(
      filePath,
      OUTPUT + "/" + outputFilename,
      sizeConfig
    );
    console.log(`图片已转换：${result}，进度:${i + 1}/${filePaths.length}`);
  }
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
    if (!stat.isDirectory()) {
      throw new Error(`错误，INPUT 路径需为文件夹`);
    }
  } catch (e) {
    console.error(e);
  }
  console.log("????????? ",SIZE_CONFIG);

  if (!SIZE_CONFIG) {
    throw new Error(`未输入 SIZE_CONFIG`);
  } else {
    if (!/^\d+,\d+$/.test(SIZE_CONFIG)) {
      console.log("????????? ",SIZE_CONFIG);
      // 需为 l,s 格式
      throw new Error(`请输入正确的 SIZE_CONFIG，如 1080,720`);
    }
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
    // 若没指定 OUTPUT 则导出到 INPUT 文件夹中
    OUTPUT = INPUT;
  }
}
