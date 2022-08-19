const getImageRecipe = require("./common/getImageRecipe");
const constant = require("./common/constant.js");
const recipeSettings = require(constant.MY_EGG_SERVER_MOCK_PATH +
  "/recipeSettings.json");
const recipes = require(constant.MY_EGG_SERVER_MOCK_PATH + "/recipes.json");

(async function main() {
  const result = await getImageRecipe(
    recipeSettings,
    recipes,
    "C:/Users/alanngai/Desktop/alan/x-raw-tool/testCase/DSCF6739.RAF"
  );

  console.log(result);
})();
