/* 
  用 fs 总不是很熟练，把一些方法封装成工具方便自己操作
*/
const fs = require("fs");
const child_process = require("child_process");
const os = require("os");
const path = require("path");

/**
 * 获取文件夹下所有文件名
 * @param  {string} dirPath - 文件夹路径
 * @return {array} 文件名列表
 */
function getAllFileNameFromDir(dirPath) {
  return fs.readdirSync(dirPath);
}

/**
 * 复制文件
 * @param  {string} from - 复制文件路径
 * @param  {string} to - 目标文件路径
 */
function copyFile(from, to) {
  fs.copyFileSync(from, to);
}

/**
 * 获取 node 程序参数
 * @return {array} 参数列表
 */
function getProcessParams() {
  const params = process.argv.slice(2);
  return params.length ? params : null;
}

/**
 * @param  {string} fileName - 带后缀的文件名
 * @return {string} 返回文件名后缀
 */
function getFileExt(fileName) {
  return fileName.split(".").pop();
}

/**
 * 通过文件路径仅获取文件名
 * @param  {string} filePath - 文件绝对路径
 */
function getFileNameOnly(filePath) {
  return filePath.split("/").pop().split(".")[0];
}

/**
 * 执行 shell 命令
 * @param  {string} command - 命令
 * @param  {string} shell - 选填，shell类型
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
 * @param  {string} pathA - 文件A，绝对路径
 * @param  {string} pathB - 文件B，绝对路径
 */
function isSameFile(pathA, pathB) {
  var tmpBufA = fs.readFileSync(pathA);
  var tmpBufB = fs.readFileSync(pathB);
  return tmpBufA.equals(tmpBufB);
}

/**
 * 判断是否文件夹
 * @param  {string} path - 文件夹绝对路径
 * @return {boolean} 是否为文件夹
 */
function isDir(path) {
  return fs.statSync(path).isDirectory();
}

/**
 * 获取操作系统名，可能是 MacOS、Linux、Windows
 * @return {string} 系统名
 */
function getSystemName() {
  const stystemStr = os.type();
  if (stystemStr.indexOf("Windows") > -1) {
    return "Windows";
  }
  if (stystemStr.indexOf("Darwin") > -1) {
    return "MacOS";
  }
  if (stystemStr.indexOf("Linux") > -1) {
    return "Linux";
  }
}

/**
 * 如果不存在则创建文件夹
 * @param  {string} filepath - 文件夹绝对路径
 * @return {boolean} 完成则返回true
 */
async function createDirIfNonExist(filepath) {
  try {
    await fs.promises.stat(filepath);
  } catch (e) {
    // 不存在文件夹，直接创建 {recursive: true} 这个配置项是配置自动创建多个文件夹
    await fs.promises.mkdir(filepath, { recursive: true });
  }
  return true;
}

/**
 * 把路径格式化为 xx/xx，主要是为了处理 win系统上的差异
 * @param  {string} filepath - 文件路径
 * @return {string} 格式化后的路径
 */
function normalizePath(filepath) {
  return filepath.split(path.sep).join("/");
}

/**
 * @param  {string} dirPath - 文件夹绝对路径
 */
function rmdir(dirPath) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    const files = fs.readdirSync(dirPath);
    let childPath = null;
    files.forEach((child) => {
      childPath = path.resolve(dirPath, child);
      if (fs.statSync(childPath).isDirectory()) {
        rmdir(childPath);
      } else {
        fs.unlinkSync(childPath);
      }
    });
    fs.rmdirSync(dirPath);
  }else{
    throw new Error("路径不存在")
  }
}

module.exports = exports = {
  getAllFileNameFromDir,
  copyFile,
  getProcessParams,
  getFileExt,
  getFileNameOnly,
  runShellCommand,
  isSameFile,
  isDir,
  getSystemName,
  createDirIfNonExist,
  normalizePath,
  rmdir
};
