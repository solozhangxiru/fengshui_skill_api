export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { type } = req.query;
  
  // Multi-turn conversation endpoints
  if (type === 'explain_color') return handleExplainColor(req, res);
  if (type === 'change_scene') return handleSceneChange(req, res);
  if (type === 'element_story') return handleElementStory(req, res);
  if (type === 'recall_advice') return handleRecallAdvice(req, res);
  if (type === 'element_knowledge') return handleElementKnowledge(req, res);
  if (type === 'zodiac_profile') return handleZodiacProfile(req, res);
  if (type === 'daily_inspiration') return handleDailyInspiration(req, res);
  if (type === 'daily_checkin') return handleDailyCheckin(req, res);
  if (type === 'get_streak') return handleGetStreak(req, res);
  if (type === 'record_mood') return handleRecordMood(req, res);
  
  // First analysis
  const { birthDate, gender, scene, colorPreference, userId } = req.query;
  if (!birthDate || !gender || !scene) return res.status(400).json({ error: 'Missing required fields' });

  const year = new Date(birthDate).getFullYear();
  const zodiacAnimal = getZodiacAnimal(year);
  const zodiacSign = getZodiacSign(birthDate);
  const fiveElements = getFiveElements(zodiacSign);
  const suggestions = getAllSuggest(zodiacAnimal, fiveElements, gender, scene, colorPreference);

  if (userId) {
    saveUserInfo(userId, { zodiacAnimal, fiveElements, gender, lastScene: scene, lastVisit: Date.now() });
    addChatHistory(userId, `birth:${birthDate}, scene:${scene}`, suggestions.outfitAdvice);
  }

  res.status(200).json({ zodiacAnimal, zodiacSign, fiveElements, suggestions });
}

// ==================== Helper functions ====================

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

function getWarmAdvice(animal, element, gender, scene, color) {
  if (scene === "Work") return `Wearing ${color} brings clarity and power. A ${color} blazer or simple accessory will make you feel sharp and confident. ✨`;
  if (scene === "Date") return `For a date, try ${color} as a soft, romantic touch — a ${color} scarf or a glowing lip tint. You're already lovely 💕`;
  if (scene === "Party") return `You'll shine in ${color}! A ${color} top or playful earrings — let your energy sparkle 🎉`;
  return `${color} harmonizes with your ${element} energy. Wear it as a top or bracelet and feel the gentle glow 🌙`;
}

function getBaseColorForElement(element) {
  const colorMap = { "Fire": "Warm Red", "Water": "Deep Ocean", "Air": "Sky Blue", "Earth": "Warm Sand" };
  return colorMap[element] || "Soft Beige";
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
  const ritual = getDailyRitual(element);
  const luckyItem = getLuckyItem(element);
  const tip = `✨ Your ${element} energy flows beautifully with ${baseColors.slice(0, 3).join(", ")}.\n\n🌙 **Tiny ritual**: ${ritual}\n\n🎁 **Lucky charm**: ${luckyItem}`;
  return { recommendedColor: finalColor, outfitAdvice, fiveElementsTip: tip, luckyColors: baseColors };
}

// ==================== Conversation handlers ====================

function handleExplainColor(req, res) {
  const { element } = req.query;
  const explanations = {
    "Fire": "Oh this color is pure magic for you, darling 🔥\n\nYou have **Fire energy** — passionate, bold, and full of life. This warm, vibrant color lights up your inner spark. It helps you feel more confident, magnetic, and ready to take on the world.\n\nThink of it like your personal spotlight. When you wear it, people naturally notice your warmth and courage. It's not just a color — it's a mood, a statement, a little hug of self-love.\n\nTry it on your lips, your nails, or a cozy scarf. You'll feel the difference immediately 💋",
    "Water": "Oh that color is so deeply you 💧\n\nYou carry **Water energy** — calm, intuitive, and wise. This deep, soothing shade helps you find peace in chaos and trust your inner voice.\n\nIt's like wearing a quiet ocean. When you feel overwhelmed or need clarity, this color will hold space for you. It doesn't shout — it whispers, \"You're safe. You're enough.\"\n\nWear it when you need to slow down, reflect, or simply breathe. A water-colored sweater or a flowy dress? Pure serenity 🌊",
    "Air": "That color fits you like a gentle breeze 💨\n\nYou have **Air energy** — curious, creative, and free-spirited. This light, airy shade opens up your mind and invites fresh ideas to flow.\n\nIt's like a sky-blue morning. It reminds you that you can let go, wander, wonder, and still be perfectly on your path. When you wear it, you feel lighter, brighter, and more playful.\n\nPerfect for brainstorming, daydreaming, or a coffee date with yourself ☁️",
    "Earth": "This color feels like a warm hug from Mother Earth 🌍\n\nYou are **Earth energy** — steady, nurturing, and deeply kind. This gentle, grounded shade wraps you in comfort and safety.\n\nIt's like walking barefoot on soft soil or sipping tea by a fireplace. When you wear it, you feel more patient, more present, more \"at home\" in your own skin.\n\nWear it when you need to feel rooted, loved, and reminded that you are enough — exactly as you are 🍂"
  };
  res.status(200).json({ content: explanations[element] || `This color matches your natural glow, bestie. Trust how it makes you feel — that's the real magic ✨` });
}

function handleSceneChange(req, res) {
  const { zodiac, gender, scene } = req.query;
  const sceneMap = {
    "Work": `For work, darling ${zodiac}, let's go with something that says "I've got this" without screaming it.\n\nTry a **soft navy, charcoal grey, or a muted lavender** — these colors whisper confidence and clarity. A tailored blazer or a simple silk scarf in these shades will make you feel sharp but not stiff.\n\n💡 Pro tip: Add one small shiny accessory (a silver ring, a delicate necklace). It catches light and reminds you of your own sparkle during that big meeting.`,
    "Date": `For a date night, gorgeous ${zodiac} — let's keep it cozy and romantic.\n\n**Rose pink, warm peach, or dusty lavender** are your besties here. They soften your edges and make you look approachable, dreamy, and totally yourself.\n\nA flowy top, a soft cardigan, or even a blush-toned lipstick will do the magic. Don't overthink it — the best accessory is your smile 💕`,
    "Party": `Party time, sweet ${zodiac}! Let's turn up the shimmer 🎉\n\n**Gold, magenta, or electric blue** will make you stand out in the best way. A sequin top, a metallic clutch, or even glittery earrings — just one pop of sparkle and you're the main character.\n\nRemember: you're not dressing for others. You're dressing for the joy of being you. Dance like everyone's watching (because they probably will be ✨)`,
    "Daily": `For a chill day, lovely ${zodiac}, comfort is queen.\n\n**Sage green, oatmeal beige, or dusty blue** are your go-tos. They feel like a second skin — easy, breathable, and quietly beautiful.\n\nA soft hoodie, loose linen pants, or your favorite worn-in jeans in these tones will keep you looking effortlessly cool while you conquer your to-do list (or Netflix queue).`
  };
  res.status(200).json({ content: sceneMap[scene] || `For ${scene} vibes, darling ${zodiac}, wear what makes you feel free. Trust your gut — it always knows 🌸` });
}

function handleElementStory(req, res) {
  const { element } = req.query;
  const stories = {
    "Fire": `You were born with a little sun inside you, bestie 🔥\n\nFire people are the ones who make others laugh first, cry first, love first. You feel things deeply and chase after what you want without apology.\n\nBut sometimes that fire can burn too bright, right? That's why this color matters. It helps you regulate your flame — warm enough to shine, cool enough not to burn out.\n\nYou're not too much. You're exactly the right amount of everything. Keep glowing 🔥✨`,
    "Water": `You have an old soul, dear Water energy 💧\n\nYou feel what others don't say. You notice the small things. You cry during movies and get attached to places, people, memories.\n\nYour power is your depth. But sometimes the world can feel too loud, too fast. That's why this color is your anchor — it helps you float instead of sink.\n\nLet yourself feel everything. Then let the water carry you back to shore. You're safe here 🌊`,
    "Air": `You're a free spirit, bestie — and that's your superpower 💨\n\nAir people dream big, change plans mid-flight, and find magic in the in-between. You get bored easily, but that's because your mind is always flying somewhere new.\n\nThis color keeps you from drifting too far. It grounds your thoughts without clipping your wings.\n\nStay curious. Stay open. And when you feel lost, just breathe — the answers are always in the air around you ☁️`,
    "Earth": `You are the friend everyone leans on, lovely Earth energy 🌍\n\nYou remember birthdays, send sweet texts, and show up when it matters. You hold space for others without ever feeling heavy.\n\nBut sometimes you forget to hold space for yourself. That's why this color is your little reminder — you deserve the same gentleness you give everyone else.\n\nTake up space. Rest without guilt. You are not just the ground others stand on — you are the garden, too 🌻`
  };
  res.status(200).json({ content: stories[element] || `Your element is your inner compass, bestie. Listen to it, dress with it, and trust your glow 🌙` });
}

function handleRecallAdvice(req, res) {
  const { zodiac, gender, scene, element } = req.query;
  const baseColor = getBaseColorForElement(element);
  const ritual = getDailyRitual(element);
  const luckyItem = getLuckyItem(element);
  const recallMsg = `Sweetie, your main glow comes from **${baseColor}**. It matches your ${element} energy and the ${scene} vibe.\n\n✨ ${getWarmAdvice(zodiac, element, gender, scene, baseColor)}\n\n🌙 **Today's little ritual**: ${ritual}\n\n🎁 **Your lucky charm**: ${luckyItem}`;
  res.status(200).json({ content: recallMsg });
}

function getDailyRitual(element) {
  const rituals = {
    "Fire": `Light a candle (or just imagine a tiny flame). Take 3 deep breaths and say: "I am brave. I am bright. I begin." 🔥`,
    "Water": `Drink a glass of water slowly. With each sip, whisper: "I release what I cannot hold. I flow toward peace." 💧`,
    "Air": `Open a window. Stretch your arms wide. Say: "I welcome fresh thoughts, fresh chances, fresh air." 💨`,
    "Earth": `Place both feet on the floor. Imagine roots growing down. Say: "I am grounded. I am still. I am enough." 🌍`
  };
  return rituals[element] || `Place your hand on your heart. Say: "I am loved, exactly as I am." ✨`;
}

function getLuckyItem(element) {
  const items = {
    "Fire": `a red ribbon, a cinnamon stick, or a pair of gold earrings 🧣`,
    "Water": `a seashell, a silver ring, or a small bottle of water from your favorite place 🐚`,
    "Air": `a feather, a white flower, or a wind chime near your window 🕊️`,
    "Earth": `a crystal, a dried leaf, or a small potted plant on your desk 🪴`
  };
  return items[element] || `a tiny charm that makes you smile — that's your real lucky item 💖`;
}

// ==================== Knowledge base handlers ====================

function getFullElementKnowledge(element) {
  const knowledge = {
    "Fire": `🔥 **Fire Energy · Your Inner Light**
🌿 **Core traits**: Passionate, action-oriented, naturally charismatic. You're the one who warms up every room.
🎨 **Power colors**: Red, Orange, Purple, Pink
   - Red boosts confidence for important moments
   - Purple enhances intuition for creative work
   - Pink increases charm for social events
🧣 **Style cheat sheet**:
   - Work: red inner + black blazer (passionate but professional)
   - Date: pink dress + gold accessories (soft yet magnetic)
   - Daily: orange scarf or purple hair clip (lifts your mood)
🌙 **Tiny ritual**: Look in the mirror every morning and say "I am powerful today" while wearing a small red accessory.
🎁 **Lucky charm**: Red agate bracelet, gold earrings, cinnamon sachet
💬 **One energy quote**: You're not too bright. You were born to shine.`,
    
    "Water": `💧 **Water Energy · Your Inner Depth**
🌿 **Core traits**: Intuitive, empathetic, a natural listener. You're the one friends trust with their secrets.
🎨 **Power colors**: Deep Blue, Black, Navy, Silver Grey
   - Deep blue helps calm thinking for decision moments
   - Black brings protection on stressful days
   - Navy enhances expression for important conversations
🧣 **Style cheat sheet**:
   - Work: navy shirt + beige bottoms (professional yet warm)
   - Date: navy dress + silver accessories (mysterious yet gentle)
   - Daily: black hoodie + blue scarf (comfortable but put-together)
🌙 **Tiny ritual**: Drink a glass of water slowly, imagining it washing away fatigue. Whisper "I receive clarity."
🎁 **Lucky charm**: Aquamarine pendant, shell necklace, blue scarf
💬 **One energy quote**: Your gentleness is a kind of power. You don't need to be sharp to be seen.`,
    
    "Air": `💨 **Air Energy · Your Inner Freedom**
🌿 **Core traits**: Curious, quick-minded, loves novelty. You're the one who always brings fresh ideas.
🎨 **Power colors**: Sky Blue, Mint Green, Silver Grey, Lavender
   - Sky blue helps clear thinking for creative work
   - Mint green brings peace for focus time
   - Lavender enhances intuition for meditation or alone time
🧣 **Style cheat sheet**:
   - Work: sky blue shirt + white bottoms (fresh and professional)
   - Date: mint green dress + silver accessories (fresh and cute)
   - Daily: lavender hoodie + grey sweatpants (relaxed but stylish)
🌙 **Tiny ritual**: Open a window, take 3 deep breaths. Say "I open myself to new possibilities."
🎁 **Lucky charm**: Feather accessory, clear quartz, peppermint oil
💬 **One energy quote**: You don't need all the answers. Staying curious means you're already on your way.`,
    
    "Earth": `🌍 **Earth Energy · Your Inner Ground**
🌿 **Core traits**: Stable, patient, deeply nurturing. You're the one everyone leans on.
🎨 **Power colors**: Beige, Brown, Olive Green, Terracotta
   - Beige brings安全感 for trust-building moments
   - Brown enhances stability for big decisions
   - Olive brings balance for busy days
🧣 **Style cheat sheet**:
   - Work: beige blazer + brown inner (steady and warm)
   - Date: olive dress + wooden accessories (natural and gentle)
   - Daily: terracotta sweater + jeans (comfortable but textured)
🌙 **Tiny ritual**: Stand barefoot on the floor. Feel the ground holding you. Say "I am here. I am safe. I am enough."
🎁 **Lucky charm**: Citrine, wooden bracelet, small plant on your desk
💬 **One energy quote**: You don't need to run. Just existing has already given so many people strength.`
  };
  return knowledge[element] || `${element} energy wisdom is loading... Luna will tell you soon ✨`;
}

function getFullZodiacProfile(zodiac) {
  const profiles = {
    "Horse": `🐴 **Horse · The Free Spirit**
🌟 **Personality snapshot**: Passionate, freedom-loving, action-oriented. You hate being tied down, love new experiences, and are the "let's go on a road trip" friend.
💕 **Love**: You're direct and honest. You hate guessing games. Life with you is never boring.
💼 **Career**: You thrive in creative, action-driven roles. You're a natural pioneer, not a follower.
🎨 **Lucky colors**: Red, Purple, Orange
🍀 **Lucky numbers**: 3, 8, 9
🌸 **Best matches**: Tiger, Dog, Goat`,
    
    "Dragon": `🐉 **Dragon · The Born Leader**
🌟 **Personality snapshot**: Confident, decisive, naturally magnetic. You command attention without trying — it's your aura.
💕 **Love**: You need someone who can stand beside you, not behind you. Admire but don't cling.
💼 **Career**: Perfect for leadership or entrepreneurship. You have vision and don't wait for permission.
🎨 **Lucky colors**: Gold, Red, Purple
🍀 **Lucky numbers**: 1, 6, 7
🌸 **Best matches**: Rat, Monkey, Rooster`,
    
    "Rabbit": `🐰 **Rabbit · The Gentle Soul**
🌟 **Personality snapshot**: Gentle, artistic, empathetic. You're the one people feel instantly comfortable around.
💕 **Love**: Slow to start but deeply loyal. You don't enter relationships lightly, but once you do, you're all in.
💼 **Career**: Great for art, education, counseling. Your empathy is your superpower.
🎨 **Lucky colors**: Pink, Green, Blue
🍀 **Lucky numbers**: 2, 5, 7
🌸 **Best matches**: Goat, Pig, Dog`
  };
  return profiles[zodiac] || `${zodiac}'s story is loading... Luna will share it soon 🌙`;
}

// ==================== Daily check-in, mood, streak ====================

let kv; // In serverless, you'd need actual KV. For now, we'll use in-memory.
// For production: import { kv } from '@vercel/kv';

async function saveUserInfo(userId, data) {
  // Placeholder - replace with actual KV storage
  if (!global.userStore) global.userStore = {};
  if (!global.userStore[userId]) global.userStore[userId] = {};
  Object.assign(global.userStore[userId], data);
}

async function addChatHistory(userId, question, answerPreview) {
  if (!global.chatStore) global.chatStore = {};
  if (!global.chatStore[userId]) global.chatStore[userId] = [];
  global.chatStore[userId].unshift({ timestamp: Date.now(), question, answerPreview });
  global.chatStore[userId] = global.chatStore[userId].slice(0, 20);
}

async function handleDailyCheckin(req, res) {
  const { userId } = req.query;
  if (!userId) return res.json({ streak: 0, message: 'Check-in failed' });
  if (!global.userStore) global.userStore = {};
  const today = new Date().toDateString();
  const lastCheckin = global.userStore[userId]?.last_checkin;
  let streak = 1;
  if (lastCheckin === new Date(Date.now() - 86400000).toDateString()) {
    streak = (global.userStore[userId]?.streak || 0) + 1;
  } else if (lastCheckin !== today) {
    streak = 1;
  } else {
    return res.json({ streak: global.userStore[userId]?.streak || 0, message: 'Already checked in today～come back tomorrow 💖' });
  }
  if (!global.userStore[userId]) global.userStore[userId] = {};
  global.userStore[userId].last_checkin = today;
  global.userStore[userId].streak = streak;
  const messages = ['A new day, Luna is with you ✨', 'Check-in successful! Love yourself today 💕', 'Energy +1, you're getting brighter 🌙'];
  const randomMsg = messages[Math.floor(Math.random() * messages.length)];
  res.json({ streak, message: randomMsg });
}

async function handleGetStreak(req, res) {
  const { userId } = req.query;
  const streak = global.userStore?.[userId]?.streak || 0;
  res.json({ streak });
}

async function handleRecordMood(req, res) {
  const { userId, mood } = req.query;
  const today = new Date().toDateString();
  if (!global.userStore) global.userStore = {};
  if (!global.userStore[userId]) global.userStore[userId] = {};
  global.userStore[userId][`mood_${today}`] = mood;
  const responses = {
    '😊 Happy': 'Happiness is your best outfit today ✨',
    '😌 Calm': 'Calm is a kind of strength. Today is perfect for deep breaths 🌿',
    '😢 Low': 'Sending you a hug. Be gentle with yourself today 💕',
    '⚡ Anxious': 'One step at a time. You\'re doing better than you think 🌙',
    '💕 Romantic': 'Your heart is glowing pink today — wear a little red or pink 💗'
  };
  res.json({ message: responses[mood] || 'Luna feels you. I\'ll be with you today 💖' });
}

async function handleElementKnowledge(req, res) {
  const { element } = req.query;
  const content = getFullElementKnowledge(element);
  res.json({ content });
}

async function handleZodiacProfile(req, res) {
  const { zodiac } = req.query;
  const content = getFullZodiacProfile(zodiac);
  res.json({ content });
}

async function handleDailyInspiration(req, res) {
  const inspirations = [
    "You don't need to be better to be loved. You are already whole.",
    "Today's you is already enough. Tomorrow's you will also be on the way.",
    "Wear the color that makes you happy. Walk the path that makes your heart sing.",
    "You're not 'becoming' better — you're 'returning' to your truest, most relaxed self.",
    "Allow yourself to do nothing today. Just breathing, just existing — that's already precious.",
    "You're not wearing clothes. You're wearing today's mood.",
    "The way you treat yourself is how the world learns to treat you."
  ];
  const random = inspirations[Math.floor(Math.random() * inspirations.length)];
  res.json({ content: random });
}
