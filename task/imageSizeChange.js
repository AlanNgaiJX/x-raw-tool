// 依赖： image-magic image-pixels gm
const fs = require("fs");
const path = require("path");
const gm = require("gm").subClass({ imageMagick: true });

const ROOT_INPUT_DIR = "E:/xrawWorkspace/output";
const ROOT_OUTPUT_DIR = "E:/xrawWorkspace/output1080";

// 获取图片大小
function getImageSize(filePath) {
  return new Promise((resolve, reject) => {
    gm(filePath).size((err, size) => {
      if (err) {
        reject(err);
      } else {
        resolve(size);
      }
    });
  });
}

// 调整图片大小
function resizeImage(inputPath, outputPath, sizeConfig) {
  return new Promise((resolve, reject) => {
    gm(inputPath)
      .resize(sizeConfig[0], sizeConfig[1], "!")
      .write(outputPath, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(outputPath);
        }
      });
  });
}

// 判定图片版式，配置输出宽高
function getSizeConfig(l, s, w, h) {
  if (w > h) {
    return [l, s];
  } else {
    return [s, l];
  }
}

// 获取文件名
function getFileName(filePath) {
  return filePath.split("/").pop();
}

// 获取文件扩展名
function getFileExt(filePath) {
  return getFileName(filePath).split(".").pop();
}

// 获取导出路径
function getOuputPath(filePath, outputDir) {
  const fileName = getFileName(filePath);
  return outputDir + "/" + fileName;
}

// 【 单个图片转换 】
// (async function main() {
//   const filePath = "./imageTool/input/DSCF1794.jpg";
//   const outputDir = "./imageTool/output";
//   const { width, height } = await getImageSize(filePath);
//   const result = await resizeImage(
//     filePath,
//     getOuputPath(filePath, outputDir),
//     getSizeConfig(799, 533, width, height)
//   );
//   console.log("成功:", result);
// })();

// 检查文件夹是否存在，若不存在则创建
async function exitsFolderOrCreate(reaPath) {
  const absPath = path.resolve(__dirname, reaPath);
  try {
    await fs.promises.stat(absPath);
  } catch (e) {
    // 不存在文件夹，直接创建 {recursive: true} 这个配置项是配置自动创建多个文件夹
    await fs.promises.mkdir(absPath, { recursive: true });
  }
}

function getAllFileName(dirPath) {
  const files = fs.readdirSync(dirPath);
  return files;
}

// 【 多个图片转换 】
(async function main() {
  await exitsFolderOrCreate(ROOT_OUTPUT_DIR);

  const subDirNames = getAllFileName(ROOT_INPUT_DIR)
    .filter((name) => name.indexOf("No.") > -1)
    .filter((name) => {
      return name.replace("No.", "") > 1;
    })
    .sort((a, b) => {
      const _a = a.replace("No.", "");
      const _b = b.replace("No.", "");
      return _a - _b;
    });

  for (let i = 0; i < subDirNames.length; i++) {
    const subDirName = subDirNames[i];
    const inputSubDirPath = ROOT_INPUT_DIR + "/" + subDirName;
    const outputSubDirPath = ROOT_OUTPUT_DIR + "/" + subDirName;
    await exitsFolderOrCreate(outputSubDirPath);

    const filesInSubDir = getAllFileName(inputSubDirPath).filter((name) => {
      return name.indexOf(".jpg") > -1 && name.indexOf("._DSCF") === -1;
    });

    for (let j = 0; j < filesInSubDir.length; j++) {
      const imageName = filesInSubDir[j];
      const inputImagePath = inputSubDirPath + "/" + imageName;
      const { width, height } = await getImageSize(inputImagePath);
      const result = await resizeImage(
        inputImagePath,
        getOuputPath(inputImagePath, outputSubDirPath),
        // getSizeConfig(799, 533, width, height)
        getSizeConfig(1080, 720, width, height)
      );
      console.log("图片已转换:", result);

      if (j === filesInSubDir.length - 1) {
        console.log(`=========== ${subDirName} 转换成功 ============`);
      }
    }

    if (i === subDirNames.length - 1) {
      console.log("任务完成");
    }
  }
})();
