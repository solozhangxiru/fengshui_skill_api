export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { type } = req.query;
  
  // 多轮对话独立入口
  if (type === 'explain_color') return handleExplainColor(req, res);
  if (type === 'change_scene') return handleSceneChange(req, res);
  if (type === 'element_story') return handleElementStory(req, res);
  if (type === 'recall_advice') return handleRecallAdvice(req, res);
  
  // 原有首次分析入口
  const { birthDate, gender, scene, colorPreference } = req.query;
  if (!birthDate || !gender || !scene) return res.status(400).json({ error: 'Missing required fields' });

  const year = new Date(birthDate).getFullYear();
  const zodiacAnimal = getZodiacAnimal(year);
  const zodiacSign = getZodiacSign(birthDate);
  const fiveElements = getFiveElements(zodiacSign);
  const suggestions = getAllSuggest(zodiacAnimal, fiveElements, gender, scene, colorPreference);

  res.status(200).json({ zodiacAnimal, zodiacSign, fiveElements, suggestions });
}

// ---------- 多轮对话逻辑 ----------
function handleExplainColor(req, res) {
  const { element } = req.query;
  const explanation = getElementExplanation(element);
  res.status(200).json({ type: 'explain_color', content: explanation });
}

function handleSceneChange(req, res) {
  const { zodiac, gender, scene } = req.query;
  const advice = getSceneChangeAdvice(zodiac, gender, scene);
  res.status(200).json({ type: 'change_scene', content: advice });
}

function handleElementStory(req, res) {
  const { element } = req.query;
  const story = getElementStory(element);
  res.status(200).json({ type: 'element_story', content: story });
}

function handleRecallAdvice(req, res) {
  const { zodiac, gender, scene, element } = req.query;
  const baseColor = getBaseColorForElement(element);
  const recallMsg = `Oh sweetie, your main glow comes from **${baseColor}**. It matches your ${element} energy and the ${scene} vibe.\n\n✨ ${getWarmAdvice(zodiac, element, gender, scene, baseColor)}`;
  res.status(200).json({ type: 'recall_advice', content: recallMsg });
}

// ---------- 工具函数 ----------
function getZodiacAnimal(y) {
  const arr = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  return arr[(y - 4) % 12];
}

function getZodiacSign(d) {
  let date = new Date(d), m = date.getMonth() + 1, day = date.getDate();
  if ((m == 1 && day >= 20) || (m == 2 && day <= 18)) return "Aquarius";
  if ((m == 2 && day >= 19) || (m == 3 && day <= 20)) return "Pisces";
  if ((m == 3 && day >= 21) || (m == 4 && day <= 19)) return "Aries";
  if ((m == 4 && day >= 20) || (m == 5 && day <= 20)) return "Taurus";
  if ((m == 5 && day >= 21) || (m == 6 && day <= 21)) return "Gemini";
  if ((m == 6 && day >= 22) || (m == 7 && day <= 22)) return "Cancer";
  if ((m == 7 && day >= 23) || (m == 8 && day <= 22)) return "Leo";
  if ((m == 8 && day >= 23) || (m == 9 && day <= 22)) return "Virgo";
  if ((m == 9 && day >= 23) || (m == 10 && day <= 23)) return "Libra";
  if ((m == 10 && day >= 24) || (m == 11 && day <= 22)) return "Scorpio";
  if ((m == 11 && day >= 23) || (m == 12 && day <= 21)) return "Sagittarius";
  return "Capricorn";
}

function getFiveElements(z) {
  const map = {
    "Aries": "Fire", "Leo": "Fire", "Sagittarius": "Fire",
    "Taurus": "Earth", "Virgo": "Earth", "Capricorn": "Earth",
    "Gemini": "Air", "Libra": "Air", "Aquarius": "Air",
    "Cancer": "Water", "Scorpio": "Water", "Pisces": "Water"
  };
  return map[z] || "Earth";
}

function getBaseColorForElement(element) {
  const colorMap = { "Fire": "Warm Red", "Water": "Deep Ocean", "Air": "Sky Blue", "Earth": "Warm Sand" };
  return colorMap[element] || "Soft Beige";
}

function getWarmAdvice(animal, element, gender, scene, color) {
  if (scene === "Work") return `Wearing ${color} brings clarity and power. A ${color} blazer or simple accessory will make you feel sharp and confident. ✨`;
  if (scene === "Date") return `For a date, try ${color} as a soft, romantic touch — a ${color} scarf or a glowing lip tint. You're already lovely 💕`;
  if (scene === "Party") return `You'll shine in ${color}! A ${color} top or playful earrings — let your energy sparkle 🎉`;
  return `${color} harmonizes with your ${element} energy. Wear it as a top or bracelet and feel the gentle glow 🌙`;
}

function getElementExplanation(element) {
  const explanations = {
    "Fire": "Fire energy is passion, action, and charisma. This color awakens your inner warmth and makes you magnetic 🔥",
    "Water": "Water energy flows with intuition and calm. This color helps you listen to your heart and find peace 💧",
    "Air": "Air energy is creativity, clarity, and freedom. This color lifts your spirit and opens fresh perspectives 💨",
    "Earth": "Earth energy grounds you with stability and care. This color feels like a warm hug for your soul 🌍"
  };
  return explanations[element] || "This color matches your natural frequency — trust how it makes you feel ✨";
}

function getElementStory(element) {
  const stories = {
    "Fire": "You carry the spark of a thousand suns. Fire energy makes you brave, radiant, and unstoppable. Let your heat melt doubts 🔥",
    "Water": "Like the ocean, you hold depth and mystery. Water energy gives you empathy and silent strength. Let emotions flow through you 💧",
    "Air": "You're a sky dancer — curious, free, and bright. Air energy feeds your imagination and wings. Breathe deep and fly 💨",
    "Earth": "You are rooted in ancient soil — gentle, patient, loyal. Earth energy provides stillness and safety. Let your kindness bloom 🌍"
  };
  return stories[element] || "Your element is your essence. Listen to it, dress with it, and trust your glow 🌙";
}

function getSceneChangeAdvice(zodiac, gender, scene) {
  const element = "Fire"; // fallback, but we'll use generic
  let color = "soft rose";
  if (scene === "Work") color = "powder blue or crisp white";
  if (scene === "Date") color = "blush pink or lavender";
  if (scene === "Party") color = "sparkly gold or magenta";
  return `For ${scene} vibes, darling ${zodiac}, try **${color}**. It highlights your natural charm and fits the mood perfectly ✨\n${getWarmAdvice(zodiac, element, gender, scene, color)}`;
}

function getAllSuggest(animal, element, gender, scene, preColor) {
  const colorLib = {
    "Fire": ["Warm Red", "Sunset Orange", "Golden Amber", "Rose Pink"],
    "Earth": ["Warm Sand", "Soft Brown", "Honey Beige", "Terracotta"],
    "Air": ["Sky Blue", "Mint Green", "Silver Mist", "Cloud Grey"],
    "Water": ["Deep Ocean", "Midnight Blue", "Pearl White", "Lavender Blue"]
  };
  const baseColors = colorLib[element] || ["Soft Beige", "Warm Taupe", "Gentle Grey", "Creamy White"];
  const finalColor = preColor || baseColors[0];
  const outfitAdvice = getWarmAdvice(animal, element, gender, scene, finalColor);
  const tip = `✨ Your ${element} energy flows beautifully with ${baseColors.slice(0, 3).join(", ")}. These colors reflect your inner light.`;
  return { recommendedColor: finalColor, outfitAdvice, fiveElementsTip: tip, luckyColors: baseColors };
}
