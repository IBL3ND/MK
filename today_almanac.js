(async () => {
  const today = new Date();

  // 🎯 更丰富的中国节日
  const cnHolidays = [
    { name: "元旦", month: 1, day: 1 },
    { name: "小年", month: 1, day: 21 },
    { name: "春节", month: 2, day: 10 },
    { name: "元宵节", month: 2, day: 24 },
    { name: "植树节", month: 3, day: 12 },
    { name: "清明节", month: 4, day: 4 },
    { name: "劳动节", month: 5, day: 1 },
    { name: "青年节", month: 5, day: 4 },
    { name: "端午节", month: 6, day: 10 },
    { name: "建党节", month: 7, day: 1 },
    { name: "七夕节", month: 8, day: 22 },
    { name: "中元节", month: 8, day: 29 },
    { name: "中秋节", month: 9, day: 17 },
    { name: "国庆节", month: 10, day: 1 },
    { name: "重阳节", month: 10, day: 25 },
    { name: "光棍节", month: 11, day: 11 },
    { name: "平安夜", month: 12, day: 24 },
    { name: "圣诞节", month: 12, day: 25 },
  ];

  // 🌡 节气
  const solarTerms = [
    { name: "立冬", month: 11, day: 7 },
    { name: "小雪", month: 11, day: 22 },
    { name: "大雪", month: 12, day: 7 },
    { name: "冬至", month: 12, day: 22 },
    { name: "小寒", month: 1, day: 5 },
    { name: "大寒", month: 1, day: 20 },
    { name: "立春", month: 2, day: 4 },
    { name: "雨水", month: 2, day: 19 },
    { name: "惊蛰", month: 3, day: 6 },
    { name: "春分", month: 3, day: 21 },
    { name: "清明", month: 4, day: 5 },
    { name: "谷雨", month: 4, day: 20 },
    { name: "立夏", month: 5, day: 6 },
    { name: "小满", month: 5, day: 21 },
    { name: "芒种", month: 6, day: 6 },
    { name: "夏至", month: 6, day: 21 },
    { name: "小暑", month: 7, day: 7 },
    { name: "大暑", month: 7, day: 23 },
    { name: "立秋", month: 8, day: 8 },
    { name: "处暑", month: 8, day: 23 },
    { name: "白露", month: 9, day: 8 },
    { name: "秋分", month: 9, day: 23 },
    { name: "寒露", month: 10, day: 8 },
    { name: "霜降", month: 10, day: 23 }
  ];

  // 🎃 西方节日
  const westernHolidays = [
    { name: "情人节", month: 2, day: 14 },
    { name: "复活节", month: 3, day: 31 },
    { name: "万圣节", month: 10, day: 31 },
    { name: "感恩节", month: 11, day: 28 },
    { name: "平安夜", month: 12, day: 24 },
    { name: "圣诞节", month: 12, day: 25 },
    { name: "新年夜", month: 12, day: 31 }
  ];

  // 💡 计算倒计时
  const calcDays = (m, d) => {
    let target = new Date(today.getFullYear(), m - 1, d);
    if (target < today) target.setFullYear(today.getFullYear() + 1);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  };

  // 💡 获取最近 n 个节日
  const getNext = (arr, n = 3) => {
    return arr
      .map(item => ({ ...item, days: calcDays(item.month, item.day) }))
      .sort((a, b) => a.days - b.days)
      .slice(0, n);
  };

  const formatLine = arr => arr.map(h => `${h.name}${h.days ? ' ' + h.days + '天' : ''}`).join(" | ");

  const panelText = `💪 坚持住，就快放假啦！
${formatLine(getNext(cnHolidays))}
今天：${formatLine(getNext(solarTerms))}
${formatLine(getNext(westernHolidays))}`;

  $done({ title: "今日黄历", content: panelText });
})();