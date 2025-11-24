// ====== NetISP (Egern Version) ======
// 不依赖 httpAPI，不使用 Surge API
// 仅使用 fetch 获取出口IP + ISP 信息

let api = $arguments.api || "ipapi";

async function run(){
  try {
    let url = "";

    if(api === "ipapi") {
      url = "https://ipapi.co/json";
    } else if(api === "sb") {
      url = "https://api.ip.sb/geoip";
    } else {
      url = api; // 自定义 API
    }

    let r = await fetch(url);
    let j = await r.json();

    let ip   = j.ip || j.query || "未知";
    let isp  = j.org || j.isp || "未知";
    let city = j.city || "未知";
    let country = j.country_name || j.country || "未知";

    let content = `IP：${ip}
ISP：${isp}
地区：${country} · ${city}`;

    $done({
      title: "NetISP 信息",
      content,
      icon: "network",
      "icon-color": "#4AA3FF"
    });

  } catch(e) {
    $done({
      title: "NetISP 信息",
      content: "获取失败：" + e,
      icon: "exclamationmark.triangle",
      "icon-color": "#FF3B30"
    });
  }
}

run();
