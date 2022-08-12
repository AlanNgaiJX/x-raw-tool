/* 
  用 fs 总不是很熟练，把一些方法封装成工具方便自己操作
*/
const fs = require("fs");
const child_process = require("child_process");

/**
 * 获取文件夹下所有文件名
 * @param  { string } dirPath - 文件夹路径
 * @return { array } 文件名列表
 */
function getAllFileNameFromDir(dirPath) {
  return fs.readdirSync(dirPath);
}

/**
 * 复制文件
 * @param  { string } from - 复制文件路径
 * @param  { string } to - 目标文件路径
 */
function copyFile(from, to) {
  fs.copyFileSync(from, to);
}

/**
 * 获取 node 程序参数
 * @return { array } 参数列表
 */
function getProcessParams() {
  const params = process.argv.slice(2);
  return params.length ? params : null;
}

/**
 * @param  { string } fileName 带后缀的文件名
 * @return { string } 返回文件名后缀
 */
function getFileExt(fileName) {
  return fileName.split(".").pop();
}

/**
 * 通过文件路径仅获取文件名
 * @param  { string } filePath 文件路径
 */
function getFileNameOnly(filePath) {
  return filePath.split("/").pop().split(".")[0];
}

/**
 * 执行 shell 命令
 * @param  { string } command 命令
 * @param  { string } shell 选填，shell类型
 */
function runShellCommand(command, shell) {
  if (process.platform === "win32") {
    child_process.execSync("cmd /c chcp 65001>nul"); // 防止控制台乱码
  }

  return new Promise((resolve, reject) => {
    try {
      const result = child_process.execSync(command, {
        // shell: shell || "powershell.exe",
        encoding: "utf8",
      });
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 比对两个文件（如json）（格式和内容）是否全等
 * @param  { string } pathA 文件A
 * @param  { string } pathB 文件B
 */
function isSameFile(pathA, pathB) {
  var tmpBufA = fs.readFileSync(pathA);
  var tmpBufB = fs.readFileSync(pathB);
  return tmpBufA.equals(tmpBufB);
}

module.exports = exports = {
  getAllFileNameFromDir,
  copyFile,
  getProcessParams,
  getFileExt,
  getFileNameOnly,
  runShellCommand,
  isSameFile
};
