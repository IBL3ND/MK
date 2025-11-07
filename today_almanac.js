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
    { name: "光棍节", month: 11, day: 11 }
  ];

  // 🌡 节气
  const solarTerms = [
    { name: "立冬", month: 11, day: 7 },
    { name: "小雪", month: 11, day: 22 },
    { name: "大雪", month: 12, day: 7 },
    { name: "冬至", month: 12, day: 22 }
  ];

  // 🎃 西方节日
  const westernHolidays = [
    { name: "感恩节", month: 11, day: 28 },
    { name: "平安夜", month: 12, day: 24 },
    { name: "圣诞节", month: 12, day: 25 }
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

  // 💡 格式化每行，条目间用 | 分隔
  const formatLine = arr => arr.map(h => `${h.name} ${h.days}天`).join(" | ");

  // 生成面板内容，每类节日单独换行
  const panelText = `💪 坚持住，就快放假啦！

${formatLine(getNext(cnHolidays))}

今天：${formatLine(getNext(solarTerms))}

${formatLine(getNext(westernHolidays))}`;

  $done({ title: "今日黄历", content: panelText });
})();