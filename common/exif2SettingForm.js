/* exif 信息转 settingForm */
function exif2SettingForm(exifData, recipeSettings) {
  const settingForm = {};
  for (const settingItem in recipeSettings) {
    const settingObj = recipeSettings[settingItem];
    for (const option of settingObj.options) {
      if (option.exiftool_path) {
        const { action, key, val } = option.exiftool_path;
        switch (action) {
          case "equal":
            exifData[key] === val && (settingForm[settingItem] = option.name);
            break;

          case "include":
            exifData[key].indexOf(val) > -1 &&
              (settingForm[settingItem] = option.name);
            break;
          default:
            break;
        }
      }
    }
  }
  return settingForm;
}

module.exports = exports = exif2SettingForm;