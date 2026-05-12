const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

/**
 * 模板云函数：返回 OPENID（当前工程以客户端直连接数据库为主；需要服务端身份时可调用此函数）。
 */
exports.main = async () => {
  const wxContext = cloud.getWXContext();
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
  };
};
