/*
#!name=TestFlight 名额监控
#!desc=自动监控 TestFlight 是否有名额（支持面板参数输入多个 ID）
#!category=工具
#!arguments=ids:TestFlight ID 列表（用英文逗号分隔）,notifyWhenUnavailable:无名额时也通知（true/false）
*/

const args = JSON.parse($argument || "{}");

const CONFIG = {
  enableNotification: true,
  notifyWhenUnavailable: args.notifyWhenUnavailable === "true",  
  perRequestTimeout: 8000,
  apps: [],
  ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
};

// 解析用户输入的 ids
if (args.ids) {
  CONFIG.apps = args.ids
    .split(",")
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(id => ({ id }));
} else {
  console.log("未填写 TestFlight ID");
  CONFIG.apps = [];
}

function sendNotification(title, subtitle, message, url) {
  if (!CONFIG.enableNotification || typeof $notification === "undefined") return;
  try {
    $notification.post(title, subtitle, message, { url });
  } catch (e) {
    console.log("通知发送失败: " + e);
  }
}

function httpGet(url, cb) {
  let finished = false;
  const timer = setTimeout(() => {
    if (finished) return;
    finished = true;
    cb(new Error("request timeout"));
  }, CONFIG.perRequestTimeout);

  const opts = { url, headers: { "User-Agent": CONFIG.ua, Accept: "text/html" } };

  if (typeof $httpClient !== "undefined") {
    $httpClient.get(opts, function (err, resp, body) {
      if (finished) return;
      clearTimeout(timer);
      finished = true;
      cb(err, resp || {}, body || "");
    });
    return;
  }

  if (typeof $task !== "undefined") {
    $task.fetch(opts).then(res => {
      if (finished) return;
      clearTimeout(timer);
      finished = true;
      cb(null, { statusCode: res.statusCode, headers: res.headers }, res.body || "");
    }).catch(err => {
      if (finished) return;
      clearTimeout(timer);
      cb(err);
    });
    return;
  }

  if (typeof fetch !== "undefined") {
    fetch(url, { headers: { "User-Agent": CONFIG.ua } })
      .then(res => res.text().then(txt => {
        if (finished) return;
        clearTimeout(timer);
        finished = true;
        cb(null, { statusCode: res.status }, txt);
      }))
      .catch(err => {
        if (finished) return;
        clearTimeout(timer);
        cb(err);
      });
    return;
  }

  clearTimeout(timer);
  cb(new Error("no http client available"));
}

function checkApp(app, done) {
  const url = `https://testflight.apple.com/join/${app.id}`;
  console.log(`[TF Monitor] 检查 ${app.id}`);

  httpGet(url, function (err, resp, body) {
    if (err) {
      console.log(`请求失败: ${err}`);
      if (CONFIG.notifyWhenUnavailable)
        sendNotification("TestFlight 监控", `App ID: ${app.id}`, `请求失败: ${err}`, url);
      return done();
    }

    const text = (body || "").toLowerCase();

    const availableKeywords = [
      "itms-beta://", "open in testflight", "join the beta",
      "start testing", "accept invite", "加入测试",
      "开始测试", "在 testflight 中打开"
    ];
    const fullKeywords = [
      "this beta is full", "beta is full", "测试人员已满",
      "测试已满", "本次测试已满", "名额已满", "无可用名额", "full"
    ];

    let isAvailable = availableKeywords.some(k => text.includes(k));
    let isFull = fullKeywords.some(k => text.includes(k));

    if (isAvailable && !isFull) {
      console.log(`${app.id} 有名额`);
      sendNotification("TestFlight 名额可用", `App ID: ${app.id}`, "点击加入测试", url);
    } else {
      console.log(`${app.id} 暂无名额`);
      if (CONFIG.notifyWhenUnavailable)
        sendNotification("TestFlight 监控", `App ID: ${app.id}`, "当前无名额", url);
    }

    done();
  });
}

// 主程序
(function main() {
  console.log("[TF Monitor] 启动");

  if (CONFIG.apps.length === 0) {
    console.log("未添加任何 TestFlight ID");
    return;
  }

  let index = 0;
  function next() {
    if (index >= CONFIG.apps.length) {
      console.log("全部检查完成");
      return;
    }
    checkApp(CONFIG.apps[index++], next);
  }
  next();
})();
