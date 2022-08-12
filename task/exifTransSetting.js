/* 将 exif json 转译为相机设置项 */
const constant = require("../common/constant.js");
const getExifFromRaf = require("../common/getExifFromRaf.js");
const exif2SettingForm = require("../common/exif2SettingForm.js");
const getRecipeBySettingForm = require("../common/getRecipeBySettingForm.js");
const recipeSettings = require(constant.MY_EGG_SERVER_MOCK_PATH +
  "/recipeSettings.json");
const recipes = require(constant.MY_EGG_SERVER_MOCK_PATH + "/recipes.json");

(async function main() {
  // const exif = await getExifFromRaf("C:/Users/alanngai/Desktop/alan/x-raw-tool/testCase/DSCF6739.RAF");
  const exif = await getExifFromRaf(
    "C:/Users/alanngai/Desktop/alan/x-raw-tool/testCase/DSCF5176.RAF"
  );
  const settingFormFromExif = exif2SettingForm(exif, recipeSettings);
  const result = getRecipeBySettingForm(
    settingFormFromExif,
    recipeSettings,
    recipes
  );

  console.log(result);
})();
