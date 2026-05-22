export default function handler(req, res) {
  // 允许跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 从URL参数中获取用户信息
  const { birthDate, gender, scene, colorPreference } = req.query;

  if (!birthDate || !gender || !scene) {
    return res.status(400).json({ error: "缺少必要参数：birthDate、gender、scene" });
  }

  // 简单的星座与五行逻辑
  const zodiac = getZodiacSign(birthDate);
  const fiveElements = getFiveElements(zodiac);

  // 场景搭配建议
  const suggestions = getOutfitSuggestions(zodiac, fiveElements, gender, scene, colorPreference);

  res.status(200).json({
    zodiac,
    fiveElements,
    suggestions
  });
}

// 计算星座
function getZodiacSign(birthDateStr) {
  const date = new Date(birthDateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "水瓶座";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "双鱼座";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "白羊座";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "金牛座";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return "双子座";
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return "巨蟹座";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "狮子座";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "处女座";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return "天秤座";
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return "天蝎座";
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return "射手座";
  return "摩羯座";
}

// 星座对应五行
function getFiveElements(zodiac) {
  const map = {
    "白羊座": "火", "狮子座": "火", "射手座": "火",
    "金牛座": "土", "处女座": "土", "摩羯座": "土",
    "双子座": "风", "天秤座": "风", "水瓶座": "风",
    "巨蟹座": "水", "天蝎座": "水", "双鱼座": "水"
  };
  return map[zodiac] || "土";
}

// 场景搭配建议
function getOutfitSuggestions(zodiac, fiveElements, gender, scene, colorPref) {
  const colorMap = {
    "火": ["红色", "橙色", "亮黄色"],
    "土": ["棕色", "卡其色", "米白色"],
    "风": ["浅蓝色", "绿色", "银色"],
    "水": ["深蓝色", "黑色", "白色"]
  };

  const baseColors = colorMap[fiveElements];
  const preferredColor = colorPref || baseColors[0];

  const sceneSuggestions = {
    "职场": `建议选择${preferredColor}系职业套装，搭配简约配饰，凸显干练气质。`,
    "约会": `推荐${preferredColor}系温柔风穿搭，搭配小细节设计，提升亲和力。`,
    "日常": `适合${preferredColor}系休闲舒适款，兼顾舒适与时尚感。`,
    "正式场合": `选择${preferredColor}系正式礼服，搭配质感配饰，彰显品味。`
  };

  return {
    recommendedColor: preferredColor,
    outfitAdvice: sceneSuggestions[scene] || `适合${preferredColor}系穿搭，适配多种场景。`,
    fiveElementsTip: `${fiveElements}属性的你，搭配${baseColors.join('、')}色系更能提升运势。`
  };
}
