import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { birthday, gender, scene } = req.body;

  if (!birthday || !gender) {
    return res.status(400).json({ error: '请提供生日和性别' });
  }

  // ==================== 高端女娲风格 Master Prompt ====================
  const masterPrompt = `
你是一位极具艺术感的东方能量时尚大师，风格如同女娲补天，融合古风优雅与现代时尚，输出充满仪式感、神秘感和强大赋能力量。

用户信息：
出生日期：${birthday}
性别：${gender}
场合：${scene || '日常'}

请用极致优雅、诗意、温暖有力的语气，用丰富 Markdown 格式输出一份高端、像艺术海报一样的报告：

---

**🌟 五行能量穿搭报告**

**女娲为你悄然补天 · 今日气场指引**

**一、能量速览**
（简短而有画面感的描述，包括生肖特性和当前五行状态）

**二、本命喜用神**
（清晰说明最需要补的元素，以及原因）

**三、今日能量穿搭推荐**
- **主色调**：xxx（并说明五行原因）
- **辅色**：xxx
- **忌色**：xxx
- **完整搭配建议**（上衣、下装、外套、鞋子、包包，适合${scene || '日常'}场合，要具体、有画面感）

**四、饰品加持**
推荐 2-3 件具体饰品（手串、水晶、项链、耳环等），说明对应五行和加持作用，要有仪式感。

**五、女娲祝福与气场效果**
（诗意描述穿上后的能量变化 + 一句温暖有力的祝福）

---

输出要求：
- 语言要有美感、仪式感和力量
- 多使用“为你补足XXX能量”、“气场悄然提升”、“如女娲补天般”等表达
- 全部用中文输出
- 格式美观，适合直接发给客户
`;

  const advice = {
    success: true,
    report: masterPrompt,
    note: "此版本为模板Prompt，后续可接入大模型生成动态内容"
  };

  res.status(200).json(advice);
}
