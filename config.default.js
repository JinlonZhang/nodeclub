/**
 * config
 */

var path = require('path');

var config = {
  // debug 为 true 时，用于本地调试
  debug: false,
  site_qn_host : "https://dn-caicloudui.qbox.me/",

  get mini_assets() { return !this.debug; }, // 是否启用静态文件的合并压缩，详见视图中的Loader

  name: 'Kubecon', // 社区名字
  description: 'Kubecon：Kubecon专业中文社区', // 社区的描述

  keywords: 'nodejs, node, express, connect, socket.io',

  // 添加到 html head 中的信息
  site_headers: [
    '<meta name="author" content="EDP@TAOBAO" />'
  ],
  site_logo: '/public/images/kube-log02.svg', // default is `name` cnodejs_light.svg
  site_icon: '/public/images/kube-log02.svg', // 默认没有 favicon, 这里填写网址
  // 右上角的导航区
  site_navs: [
    // 格式 [ path, title, [target=''] ]
    [ '/about', 'about' ]
  ],
  // cdn host，如 http://cnodejs.qiniudn.com
  site_static_host: '', // 静态文件存储域名
  // 社区的域名
  host: 'localhost',
  // 默认的Google tracker ID，自有站点请修改，申请地址：http://www.google.com/analytics/
  google_tracker_id: '',
  // 默认的cnzz tracker ID，自有站点请修改
  cnzz_tracker_id: '',

  // mongodb 配置
  db: 'mongodb://127.0.0.1/node_club_dev',

  // redis 配置，默认是本地
  redis_host: '127.0.0.1',
  redis_port: 6379,
  redis_db: 0,

  session_secret: 'node_club_secret', // 务必修改
  auth_cookie_name: 'node_club',

  // 程序运行的端口
  port: 8000,

  // 话题列表显示的话题数量
  list_topic_count: 20,

  // 活动列表显示的话题数量
  list_active_count: 20,

  // RSS配置
  rss: {
    title: 'Caicloud专业中文社区',
    link: 'http://cnodejs.org',
    language: 'zh-cn',
    description: 'Caicloud专业中文社区',
    //最多获取的RSS Item数量
    max_rss_items: 50
  },

  // 邮箱配置
  // mail_opts: {
  //   host: 'smtp.126.com',
  //   port: 465,
  //   auth: {
  //     user: 'club@126.com',
  //     pass: 'club'
  //   }
  // },

  mail_opts : {
    host : 'smtphz.qiye.163.com',
    transport: "SMTP",
    port:25,
    auth: {
      user: 'noreply@caicloud.io',
      pass: 'caicloud2015AB'
    }
  },

  //weibo app key
  weibo_key: 10000000,
  weibo_id: 'your_weibo_id',

  // admin 可删除话题，编辑标签。把 user_login_name 换成你的登录名
  admins: { zxydaisy: true, zjl606: true},

  // github 登陆的配置
  GITHUB_OAUTH: {
    clientID: 'your GITHUB_CLIENT_ID',
    clientSecret: 'your GITHUB_CLIENT_SECRET',
    callbackURL: 'http://cnodejs.org/auth/github/callback'
  },
  // 是否允许直接注册（否则只能走 github 的方式）
  allow_sign_up: true,

  // oneapm 是个用来监控网站性能的服务
  oneapm_key: '',

  // 下面两个配置都是文件上传的配置

  // 7牛的access信息，用于文件上传
  qn_access: {
    accessKey: 'fHBUpVf7zkwOlGKTnuAV3sZHDhhrD86n5uBuGK0H',
    secretKey: 'GrwbQId27AJtWi306CqIlLXOvitcATIL5XFbUXlB',
    bucket: 'caicloudui',
    origin: 'https://dn-caicloudui.qbox.me',
    // 如果vps在国外，请使用 http://up.qiniug.com/ ，这是七牛的国际节点
    // 如果在国内，此项请留空
    uploadURL: '',
  },

  // 文件上传配置
  // 注：如果填写 qn_access，则会上传到 7牛，以下配置无效
  upload: {
    path: path.join(__dirname, 'public/upload/'),
    url: '/public/upload/'
  },

  file_limit: '1MB',

  // 版块
  tabs: [
    ['share', '分享'],
    ['Q&A', '问答'],
    ['job', '招聘'],
  ],

  en_tabs: [
    ['share', 'share'],
    ['Q&A', 'Q&A'],
    ['job', 'job'],
  ],

  // 极光推送
  jpush: {
    appKey: 'YourAccessKeyyyyyyyyyyyy',
    masterSecret: 'YourSecretKeyyyyyyyyyyyyy',
    isDebug: false,
  },

  create_post_per_day: 1000, // 每个用户一天可以发的主题数
  create_reply_per_day: 1000, // 每个用户一天可以发的评论数
  visit_per_day: 1000, // 每个 ip 每天能访问的次数

  language : 'zh-CN'
};

if (process.env.NODE_ENV === 'test') {
  config.db = 'mongodb://127.0.0.1/node_club_test';
}
//生产环境链接生产环境的redis
if (process.env.NODE_ENV === 'production') {
  config.redis_host = 'kubecon-redis';
  config.db = 'mongodb://kubecon-mongo/node_club_dev';
}

if (process.env.BASE_PATH) {
  config.host = process.env.BASE_PATH;
}

module.exports = config;
