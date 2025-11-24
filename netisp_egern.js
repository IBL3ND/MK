// NetISP 面板脚本（Egern 兼容）
// 注意：Egern 不支持 fetch，只能用 $httpClient

function get(url) {
  return new Promise((resolve, reject) => {
    $httpClient.get(url, (err, resp, data) => {
      if (err) reject(err);
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject("JSON 解析失败");
      }
    });
  });
}

(async () => {
  try {
    let api = $arguments.api || "ipapi";

    let url =
      api === "sb"
        ? "https://api.ip.sb/geoip"
        : api === "ipapi"
        ? "https://ipapi.co/json"
        : api; // 自定义 API

    let r = await get(url);

    let ip = r.ip || r.query || "未知";
    let isp = r.org || r.organization || r.isp || "未知";
    let city = r.city || "未知";
    let country = r.country_name || r.country || "未知";

    let content = `IP：${ip}
ISP：${isp}
地区：${country} · ${city}`;

    $done({
      title: "NetISP 信息",
      content,
      icon: "network",
      "icon-color": "#4AA3FF"
    });
  } catch (e) {
    $done({
      title: "NetISP 信息",
      content: "获取失败：" + e,
      icon: "exclamationmark.triangle",
      "icon-color": "#FF3B30"
    });
  }
})();
