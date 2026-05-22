export default function handler(req, res) {
  // 跨域配置
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

  // 获取参数
  const { birthDate, gender, scene, colorPreference } = req.query;
  if (!birthDate || !gender || !scene) {
    return res.status(400).json({ error: "缺少必要参数：birthDate、gender、scene" });
  }

  // 1. 新增：根据年份计算生肖
  const year = new Date(birthDate).getFullYear();
  const zodiacAnimal = getZodiacAnimal(year);
  // 2. 计算星座和五行
  const zodiacSign = getZodiacSign(birthDate);
  const fiveElements = getFiveElements(zodiacSign);
  // 3. 搭配建议（适配十二生肖+五行）
  const suggestions = getExpandedSuggestions(zodiacAnimal, fiveElements, gender, scene, colorPreference);

  res.status(200).json({
    zodiacAnimal, // 新增生肖字段，和你的主题呼应
    zodiacSign,
    fiveElements,
    suggestions
  });
}

// 计算生肖（适配你的十二生肖主题）
function getZodiacAnimal(year) {
  const animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
  return animals[(year - 4) % 12];
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
function getFiveElements(zodiacSign) {
  const map = {
    "白羊座": "火", "狮子座": "火", "射手座": "火",
    "金牛座": "土", "处女座": "土", "摩羯座": "土",
    "双子座": "风", "天秤座": "风", "水瓶座": "风",
    "巨蟹座": "水", "天蝎座": "水", "双鱼座": "水"
  };
  return map[zodiacSign] || "土";
}

// 扩展版搭配建议（适配生肖+五行+性别+场景）
function getExpandedSuggestions(zodiacAnimal, fiveElements, gender, scene, colorPref) {
  // 五行对应颜色（星空鎏金版，和图片配色呼应）
  const colorMap = {
    "火": ["赤金红", "暖橙金", "鎏金黄", "珊瑚红"],
    "土": ["焦糖棕", "米白金", "琥珀色", "驼色"],
    "风": ["星蓝银", "薄荷绿", "银灰色", "雾霾蓝"],
    "水": ["深海蓝", "墨黑金", "珍珠白", "青金蓝"]
  };

  const baseColors = colorMap[fiveElements];
  const preferredColor = colorPref || baseColors[0];

  // 场景建议（加入生肖元素，和你的主题呼应）
  const sceneSuggestions = {
    "职场": {
      "女": `作为${zodiacAnimal}生肖的${fiveElements}属性，建议选择${preferredColor}系职业套装，搭配简约鎏金配饰，凸显干练气场。`,
      "男": `作为${zodiacAnimal}生肖的${fiveElements}属性，推荐${preferredColor}系西装，版型利落，彰显专业稳重感。`
    },
    "约会": {
      "女": `作为${zodiacAnimal}生肖的${fiveElements}属性，推荐${preferredColor}系温柔风穿搭，搭配小细节设计，自带亲和星光。`,
      "男": `作为${zodiacAnimal}生肖的${fiveElements}属性，适合${preferredColor}系休闲商务风，干净清爽，自带好感度。`
    },
    "日常": {
      "女": `作为${zodiacAnimal}生肖的${fiveElements}属性，适合${preferredColor}系休闲款，兼顾舒适与星光质感。`,
      "男": `作为${zodiacAnimal}生肖的${fiveElements}属性，建议${preferredColor}系简约休闲装，百搭又不挑场合。`
    },
    "正式场合": {
      "女": `作为${zodiacAnimal}生肖的${fiveElements}属性，选择${preferredColor}系正式礼服，搭配鎏金配饰，彰显东方韵味。`,
      "男": `作为${zodiacAnimal}生肖的${fiveElements}属性，推荐${preferredColor}系正装礼服，细节精致，气场拉满。`
    },
    "运动": {
      "女": `作为${zodiacAnimal}生肖的${fiveElements}属性，建议${preferredColor}系运动套装，透气舒适又活力满满。`,
      "男": `作为${zodiacAnimal}生肖的${fiveElements}属性，选择${preferredColor}系运动服，宽松舒适，适配多种场景。`
    },
    "派对": {
      "女": `作为${zodiacAnimal}生肖的${fiveElements}属性，推荐${preferredColor}系亮色小礼服，自带星光焦点。`,
      "男": `作为${zodiacAnimal}生肖的${fiveElements}属性，适合${preferredColor}系个性衬衫，搭配休闲裤，时尚又吸睛。`
    }
  };

  const genderScene = sceneSuggestions[scene] || {
    "女": `适合${preferredColor}系穿搭，适配多种场景。`,
    "男": `推荐${preferredColor}系穿搭，百搭又实用。`
  };
  const outfitAdvice = genderScene[gender] || genderScene["女"];

  return {
    recommendedColor: preferredColor,
    outfitAdvice,
    fiveElementsTip: `${fiveElements}属性的${zodiacAnimal}生肖，搭配${baseColors.join('、')}色系，更能点亮你的专属星光运势。`,
    luckyColors: baseColors
  };
}
