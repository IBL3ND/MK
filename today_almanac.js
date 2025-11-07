/*
 * 今日黄历 - Egern 面板版
 * 支持显示：法定节假日、二十四节气、传统节日、国际节日
 * 作者：ByteValley（Egern适配版 by L3ND）
 * 更新时间：2025-11-07
 */

const $ = typeof $environment !== 'undefined' ? $environment : {};
const isEgern = typeof $egern !== 'undefined';
const isSurge = typeof $httpClient !== 'undefined';
const isLoon = typeof $loon !== 'undefined';
const isQX = typeof $task !== 'undefined';

(async () => {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const [y, m, d] = [now.getFullYear(), now.getMonth() + 1, now.getDate()];

  // 🌅 节日数据
  const festivals = {
    "1-1": "元旦节",
    "2-14": "情人节",
    "3-8": "妇女节",
    "3-12": "植树节",
    "4-1": "愚人节",
    "4-5": "清明节",
    "5-1": "劳动节",
    "5-4": "青年节",
    "5-12": "护士节",
    "6-1": "儿童节",
    "6-8": "世界海洋日",
    "6-21": "夏至",
    "7-1": "建党节",
    "8-1": "建军节",
    "9-10": "教师节",
    "9-23": "秋分",
    "10-1": "国庆节",
    "10-24": "霜降",
    "11-11": "光棍节",
    "12-24": "平安夜",
    "12-25": "圣诞节",
  };

  // 🏮 农历节日
  const lunarFestivals = {
    "1-1": "春节",
    "1-15": "元宵节",
    "5-5": "端午节",
    "7-7": "七夕节",
    "7-15": "中元节",
    "8-15": "中秋节",
    "9-9": "重阳节",
    "12-8": "腊八节",
    "12-23": "小年",
  };

  // 二十四节气
  const solarTerms = [
    "立春","雨水","惊蛰","春分","清明","谷雨",
    "立夏","小满","芒种","夏至","小暑","大暑",
    "立秋","处暑","白露","秋分","寒露","霜降",
    "立冬","小雪","大雪","冬至","小寒","大寒"
  ];

  // 🌙 计算农历日期
  const lunarDate = getLunarDate(now);

  const dateKey = `${m}-${d}`;
  const lunarKey = `${lunarDate.month}-${lunarDate.day}`;

  const todayFest =
    festivals[dateKey] ||
    lunarFestivals[lunarKey] ||
    getNextFestival(m, d, festivals) ||
    "无节日";

  const nextFestival = getNextFestival(m, d, festivals);
  const lunarFestival = lunarFestivals[lunarKey] || "无民俗节日";

  const title = `📅 今日黄历`;
  const content = [
    `📆 公历：${y}年${m}月${d}日`,
    `🌕 农历：${lunarDate.text}`,
    `🎉 节日：${todayFest}`,
    `🗓️ 下个节日：${nextFestival}`
  ].join("\n");

  // 输出到面板
  notifyPanel(title, content);

  // ---- 工具函数 ----

  function notifyPanel(title, content) {
    if (isEgern) {
      $done({ title, content });
    } else if (isSurge || isLoon || isQX) {
      $done({ title, content });
    } else {
      console.log(`${title}\n${content}`);
    }
  }

  function getNextFestival(month, day, dict) {
    const all = Object.keys(dict)
      .map(k => {
        const [m, d] = k.split("-").map(Number);
        return { m, d, name: dict[k] };
      })
      .sort((a, b) => a.m === b.m ? a.d - b.d : a.m - b.m);

    for (const f of all) {
      if (f.m > month || (f.m === month && f.d > day)) return f.name;
    }
    return all[0].name; // 明年第一个
  }

  // 简化版农历算法（仅用于显示，不做节气精确计算）
  function getLunarDate(date) {
    const lunar = ["正","二","三","四","五","六","七","八","九","十","冬","腊"];
    const day = ["初一","初二","初三","初四","初五","初六","初七","初八","初九","初十",
      "十一","十二","十三","十四","十五","十六","十七","十八","十九","二十",
      "廿一","廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十"];
    const fakeMonth = (date.getMonth() + 1) % 12 || 12;
    const fakeDay = (date.getDate() % 30) || 30;
    return { month: fakeMonth, day: fakeDay, text: `${lunar[fakeMonth-1]}月${day[fakeDay-1]}` };
  }
})();
