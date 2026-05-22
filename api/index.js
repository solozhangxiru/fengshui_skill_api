export default function handler(req, res) {
  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 从URL参数里获取用户输入
  const { birthday, gender, scene, favoriteColor } = req.query;

  // 示例逻辑：根据场景生成穿搭建议
  let suggestion = "根据你的生肖五行，推荐穿搭：";
  if (scene === "工作") {
    suggestion += "选择沉稳的深色系，搭配简约款式，提升专业感。";
  } else if (scene === "约会") {
    suggestion += "选择柔和的浅色系，搭配显气质的单品，提升亲和力。";
  } else {
    suggestion += "选择与你命理相合的颜色，比如你的幸运色：蓝色。";
  }

  res.status(200).json({
    message: "✅ 五行穿搭API 调用成功！",
    userInput: { birthday, gender, scene, favoriteColor },
    suggestion: suggestion
  });
}
