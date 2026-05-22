export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: "请求方式不允许" });

  const { birthDate, gender, scene, colorPreference } = req.query;
  if (!birthDate || !gender || !scene) return res.status(400).json({ error: "缺失必填参数" });

  const year = new Date(birthDate).getFullYear();
  const zodiacAnimal = getZodiacAnimal(year);
  const zodiacSign = getZodiacSign(birthDate);
  const fiveElements = getFiveElements(zodiacSign);
  const suggestions = getAllSuggest(zodiacAnimal,fiveElements,gender,scene,colorPreference);

  res.status(200).json({zodiacAnimal,zodiacSign,fiveElements,suggestions});
}

function getZodiacAnimal(y){
  const arr=["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"];
  return arr[(y-4)%12];
}
function getZodiacSign(d){
  let date=new Date(d),m=date.getMonth()+1,day=date.getDate();
  if((m==1&&day>=20)||(m==2&&day<=18))return "水瓶座";
  if((m==2&&day>=19)||(m==3&&day<=20))return "双鱼座";
  if((m==3&&day>=21)||(m==4&&day<=19))return "白羊座";
  if((m==4&&day>=20)||(m==5&&day<=20))return "金牛座";
  if((m==5&&day>=21)||(m==6&&day<=21))return "双子座";
  if((m==6&&day>=22)||(m==7&&day<=22))return "巨蟹座";
  if((m==7&&day>=23)||(m==8&&day<=22))return "狮子座";
  if((m==8&&day>=23)||(m==9&&day<=22))return "处女座";
  if((m==9&&day>=23)||(m==10&&day<=23))return "天秤座";
  if((m==10&&day>=24)||(m==11&&day<=22))return "天蝎座";
  if((m==11&&day>=23)||(m==12&&day<=21))return "射手座";
  return "摩羯座";
}
function getFiveElements(z){
  const map={
    "白羊座":"火","狮子座":"火","射手座":"火",
    "金牛座":"土","处女座":"土","摩羯座":"土",
    "双子座":"风","天秤座":"风","水瓶座":"风",
    "巨蟹座":"水","天蝎座":"水","双鱼座":"水"
  };
  return map[z]||"土";
}
function getAllSuggest(animal,ele,sex,scene,preColor){
  const colorLib={
    "火":["赤金红","暖橙金","鎏金黄","珊瑚红"],
    "土":["焦糖棕","米白金","琥珀色","驼色"],
    "风":["星蓝银","薄荷绿","银灰色","雾霾蓝"],
    "水":["深海蓝","墨黑金","珍珠白","青金蓝"]
  };
  const baseColor=colorLib[ele];
  const useColor=preColor||baseColor[0];
  const sceneTxt={
    "职场":{"女":`${animal}生肖${ele}属性，优选${useColor}系正装穿搭，简约配饰凸显干练气场，助力事业顺遂`,"男":`${animal}生肖${ele}属性，搭配${useColor}系商务装束，版型沉稳大气，提升职场人缘`},
    "约会":{"女":`${animal}生肖${ele}属性，选用${useColor}系柔和穿搭，温婉造型拉近人际好感`,"男":`${animal}生肖${ele}属性，${useColor}系休闲穿搭清爽大方，提升个人魅力`},
    "日常":{"女":`${animal}生肖${ele}属性，${useColor}系舒适穿搭，自在随性贴合日常氛围`,"男":`${animal}生肖${ele}属性，简约${useColor}系服饰，百搭耐看适配生活场景`},
    "正式场合":{"女":`${animal}生肖${ele}属性，${useColor}系典雅礼服，质感穿搭彰显沉稳气度`,"男":`${animal}生肖${ele}属性，${useColor}系正装造型，庄重得体适配正式场面`},
    "运动":{"女":`${animal}生肖${ele}属性，${useColor}系透气运动装，活力穿搭舒展身心`,"男":`${animal}生肖${ele}属性，宽松${useColor}系运动服饰，轻松适配各类运动`},
    "派对":{"女":`${animal}生肖${ele}属性，${useColor}系亮色穿搭，亮眼造型成为场合焦点`,"男":`${animal}生肖${ele}属性，个性${useColor}系穿搭，潮流风格适配聚会氛围`},
    "节日":{"女":`${animal}生肖${ele}属性，${useColor}系喜庆穿搭，烘托节日吉祥氛围感`,"男":`${animal}生肖${ele}属性，${useColor}系国风穿搭，寓意平安顺遂`}
  };
  const advice=sceneTxt[scene]?.[sex]||`适配${useColor}系穿搭，契合${ele}五行气场`;
  const tip=`${ele}五行${animal}生肖，日常穿搭优先选择${baseColor.join("、")}色系，可稳步提升自身整体运势`;
  return {recommendedColor:useColor,outfitAdvice:advice,fiveElementsTip:tip,luckyColors:baseColor};
}
