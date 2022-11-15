/* 
  转换多个配方文件夹的图片大小
  用例：
  npm run resizeImgRecipes D:\Desktop\testimage\test-recipes-img 1080,720 D:\Desktop\testimage\test-ouput
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
        return ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"].includes(fileExt);
      })
      .map((name) => {
        return subDirPath + "/" + name;
      });

    for (let j = 0; j < filePaths.length; j++) {
      const filePath = filePaths[j];
      const { width, height } = await magickTool.getImageSize(filePath);
      const [l, s] = SIZE_CONFIG.split(",");
      const sizeConfig = magickTool.getSizeConfig(l, s, width, height);
      const outputFilename = `${nodeHelper.getFileNameOnly(
        filePath
      )}@${SIZE_CONFIG}.${nodeHelper.getFileExt(filePath)}`;
      const result = await magickTool.resizeImage(
        filePath,
        outputSubDirPath + "/" + outputFilename,
        sizeConfig
      );
      console.log(
        `图片已转换：${result}，当前文件夹进度:${j + 1}/${
          filePaths.length
        }，总进度：${i + 1}/${subDirPaths.length}`
      );
    }
  }
})();

/**
 * 获取控制台参数，校验，并设置默认值
 * INPUT (必填)
 * SIZE_CONFIG（必填）
 * OUTPUT (必填)
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

  if (!SIZE_CONFIG) {
    throw new Error(`未输入 SIZE_CONFIG`);
  } else {
    if (!/^\d+,\d+$/.test(SIZE_CONFIG)) {
      // 需为 l,s 格式
      throw new Error(`请输入正确的 SIZE_CONFIG，如 1080,720`);
    }
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
