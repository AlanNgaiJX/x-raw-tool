/* 使用exiftool 从raf中抓取exif信息 */
const nodeHelper = require("alanngai-node-helper");

function getExifFromRaf(rafUri) {
  return new Promise((resolve, reject) => {
    return nodeHelper
      .runShellCommand(`exiftool -json ${rafUri}`)
      .then((res) => {
        resolve(JSON.parse(res)[0]);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = exports = getExifFromRaf;
