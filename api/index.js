export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: "Method not allowed" });

  const { birthDate, gender, scene, colorPreference } = req.query;
  if (!birthDate || !gender || !scene) return res.status(400).json({ error: "Missing required fields" });

  const year = new Date(birthDate).getFullYear();
  const zodiacAnimal = getZodiacAnimal(year);
  const zodiacSign = getZodiacSign(birthDate);
  const fiveElements = getFiveElements(zodiacSign);
  const suggestions = getAllSuggest(zodiacAnimal, fiveElements, gender, scene, colorPreference);

  res.status(200).json({ zodiacAnimal, zodiacSign, fiveElements, suggestions });
}

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

// 闺蜜版英文建议生成器
function getWarmAdvice(animal, element, gender, scene, color) {
  const colorName = color;
  const elementLower = element.toLowerCase();
  
  // 根据场景生成不同的温暖开场
  const openings = {
    "Work": `💼 Hey gorgeous, big day ahead? Take a deep breath — you've got this! ✨\n\nBased on your ${animal} energy and ${element} element, today is your day to shine.`,
    "Date": `💕 Getting ready for a special date? Just be yourself, you're already amazing!\n\nYour ${animal} spirit and ${element} energy are glowing beautifully today.`,
    "Daily": `🌿 Hello beautiful! Ready for another wonderful day?\n\nYour ${animal} energy is flowing so peacefully today. Let's make it special.`,
    "Party": `🎉 Party time! Time to let your sparkle out!\n\nYour ${animal} energy and ${element} element are perfect for lighting up any room.`,
    "Sport": `⚡ Feeling energized? Let's get that beautiful body moving!\n\nYour ${animal} spirit loves action and movement today.`
  };
  
  const opening = openings[scene] || `✨ Hello beautiful! Let's find your perfect energy outfit today. ✨\n\nYour ${animal} energy is calling.`;
  
  // 闺蜜风格的穿搭建议
  let styleAdvice = "";
  if (gender === "Female") {
    if (element === "Fire") styleAdvice = `Wear something in **${colorName}** — it's your power color today, bestie! A cute ${colorName} scarf, a bold lip, or a flowy ${colorName} blouse will make you feel unstoppable. 🔥`;
    else if (element === "Water") styleAdvice = `Go for **${colorName}** tones — they bring out your natural calm and wisdom. Think a cozy ${colorName} sweater or a silky ${colorName} dress. You'll feel so peaceful and confident. 💙`;
    else if (element === "Air") styleAdvice = `**${colorName}** is your magic color today! Try a light ${colorName} jacket, some silver accessories, or a breezy ${colorName} top. You'll look effortlessly cool and smart. 💨`;
    else if (element === "Earth") styleAdvice = `**${colorName}** hues will ground and nurture you. A warm ${colorName} cardigan, natural fabrics, or earthy tones will make you feel safe and beautiful. 🌿`;
    else styleAdvice = `You'll look amazing in **${colorName}**! Try adding a ${colorName} accessory — a bag, a necklace, or even a ${colorName} hair tie. Small touches, big glow-up! ✨`;
  } else {
    if (element === "Fire") styleAdvice = `Rock **${colorName}** today — it's your power move! A ${colorName} tie, a ${colorName} shirt, or even ${colorName} socks will boost your confidence and charm. 🔥`;
    else if (element === "Water") styleAdvice = `**${colorName}** is your calm power color. A ${colorName} blazer, a ${colorName} watch, or a relaxed ${colorName} sweater will make you look deep and trustworthy. 💙`;
    else if (element === "Air") styleAdvice = `Go smart with **${colorName}**! A ${colorName} jacket, light ${colorName} shirt, or ${colorName} sneakers — you'll look sharp and feel free. 💨`;
    else if (element === "Earth") styleAdvice = `**${colorName}** tones bring out your reliable, warm side. A ${colorName} wool sweater, khaki pants, or a ${colorName} bag — simple, strong, handsome. 🌿`;
    else styleAdvice = `**${colorName}** is your friend today. Try a ${colorName} accessory — a watch, a belt, or a ${colorName} hat. Small details, big impact! ✨`;
  }
  
  // 结尾的暖心鼓励
  const closing = `\n\n💖 Remember, bestie: Fashion is an experiment, and you are the main character. Wear what makes you smile. You're beautiful just as you are. 🌙\n\nSending you a big hug, Luna ✨`;
  
  // 能量小贴士
  let energyTip = "";
  if (element === "Fire") energyTip = `🔥 Fire energy tip: Take 5 deep breaths before stepping out. Visualize a warm, golden light surrounding you. You are powerful and radiant.`;
  else if (element === "Water") energyTip = `💧 Water energy tip: Stay hydrated! Carry a water bottle with you. When you feel overwhelmed, pause and take a slow sip — let calm flow through you.`;
  else if (element === "Air") energyTip = `💨 Air energy tip: Stretch your arms wide and take a deep breath. Let fresh ideas flow in. You are clever and free-spirited.`;
  else if (element === "Earth") energyTip = `🌿 Earth energy tip: Stand barefoot on grass or soil if you can. Feel grounded and supported. You are stable, strong, and nurturing.`;
  else energyTip = `✨ Energy tip: Look at yourself in the mirror and say, "I am enough. I am beautiful. I am ready." Because you truly are.`;
  
  return opening + "\n\n" + styleAdvice + "\n\n" + energyTip + closing;
}

function getAllSuggest(animal, element, gender, scene, preColor) {
  // 颜色库（温暖、治愈系的颜色名称）
  const colorLib = {
    "Fire": ["Warm Red", "Sunset Orange", "Golden Amber", "Rose Pink"],
    "Earth": ["Warm Sand", "Soft Brown", "Honey Beige", "Terracotta"],
    "Air": ["Sky Blue", "Mint Green", "Silver Mist", "Cloud Grey"],
    "Water": ["Deep Ocean", "Midnight Blue", "Pearl White", "Lavender Blue"]
  };
  
  const baseColors = colorLib[element] || ["Soft Beige", "Warm Taupe", "Gentle Grey", "Creamy White"];
  const finalColor = preColor || baseColors[0];
  
  // 生成闺蜜风格的完整建议
  const outfitAdvice = getWarmAdvice(animal, element, gender, scene, finalColor);
  
  // 能量小贴士（简短版，与上面区分）
  let tip = "";
  if (element === "Fire") tip = `🔥 Your ${element} energy shines when you wear warm, bold colors like ${baseColors.slice(0, 3).join(", ")}. These colors boost your natural confidence and charisma.`;
  else if (element === "Water") tip = `💧 Your ${element} energy flows best with deep, calming hues like ${baseColors.slice(0, 3).join(", ")}. They enhance your intuition and bring inner peace.`;
  else if (element === "Air") tip = `💨 Your ${element} energy loves light, airy shades like ${baseColors.slice(0, 3).join(", ")}. They keep your mind clear and your spirit light.`;
  else if (element === "Earth") tip = `🌿 Your ${element} energy feels grounded with natural, earthy tones like ${baseColors.slice(0, 3).join(", ")}. They bring stability and warmth to your day.`;
  else tip = `✨ Your energy is unique and beautiful. Colors like ${baseColors.slice(0, 3).join(", ")} help you feel balanced and radiant.`;
  
  return {
    recommendedColor: finalColor,
    outfitAdvice: outfitAdvice,
    fiveElementsTip: tip,
    luckyColors: baseColors
  };
}
