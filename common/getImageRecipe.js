/* 计算图片大概是哪个配方 */
const getExifFromRaf = require("./getExifFromRaf.js");
const exif2SettingForm = require("./exif2SettingForm.js");
const getRecipeBySettingForm = require("../getRecipeBySettingForm.js");

async function getImageRecipe(recipeSettings, recipes, imagePath){
  return new Promise((resolve, reject)=>{
    try {
      const exif = await getExifFromRaf(imagePath);
      const settingFormFromExif = exif2SettingForm(exif, recipeSettings);
      const result = getRecipeBySettingForm(
        settingFormFromExif,
        recipeSettings,
        recipes
      );
      resolve(result);
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = exports = {
  getImageRecipe
}