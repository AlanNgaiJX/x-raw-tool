/* 通过 settingForm 推算 是哪一个配方 */
function getRecipeBySettingForm(
  settingForm,
  recipeSettings,
  recipes,
  coating_array = "X-Trans-4"
) {
  const recipeGroup = recipes.filter(
    (recipe) => recipe.coating_array === coating_array
  );
  const scoreList = [];

  // 计算每个配方的得分
  recipeGroup.forEach((recipe, index) => {
    let score = 0;
    const recipeSettingForm = recipe.setting_form;
    for (const settingItem in recipeSettingForm) {
      const exiftool_accuracy =
        recipeSettings[settingItem].exiftool_accuracy || 100;
      recipeSettingForm[settingItem] === settingForm[settingItem] &&
        (score += exiftool_accuracy);
    }
    scoreList.push(score);
  });

  // 计算最高分
  let max = 0;
  scoreList.forEach((score, index) => {
    if (score >= max) {
      max = score;
    }
  });

  // 获得最高分的配方
  const targetIndexes = [];
  scoreList.forEach((score, index) => {
    if (score === max) {
      targetIndexes.push(index);
    }
  });

  const targetRecipes = recipeGroup.filter((recipe, index) => {
    return targetIndexes.includes(index);
  });

  return {
    recipes: targetRecipes,
    score: max,
    recipes_name: targetRecipes.map((recipe) => {
      return `No.${recipe.recipe_id} ${recipe.name}`;
    }),
  };
}

module.exports = exports = getRecipeBySettingForm;
