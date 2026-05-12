# 🗡️ 塞尔达传说：旷野之息 攻略站

> 最全面的中文游戏攻略网站 — 神庙 · 主线 · 装备 · 料理 · BOSS · 呀哈哈 · 隐藏要素

## 在线预览

👉 [brunooooooooooooooo.github.io/zelda-breath-of-the-wild-guide](https://brunooooooooooooooo.github.io/zelda-breath-of-the-wild-guide/)

## 仓库地址

[https://github.com/Brunooooooooooooooo/zelda-breath-of-the-wild-guide](https://github.com/Brunooooooooooooooo/zelda-breath-of-the-wild-guide)

## 项目结构

```
├── index.html                 首页
├── about.html                 关于 / 贡献 / 反馈
├── css/                       样式文件
│   ├── style.css              主样式
│   ├── material.css           动效素材
│   ├── guide.css              攻略页样式
│   └── illustrations.css      插图系统
├── js/
│   └── main.js                搜索 + 交互
├── images/                    11张自制SVG场景图
└── guides/                    10个攻略页面
    ├── great-plateau.html     初始台地
    ├── divine-beasts.html     四神兽主线
    ├── shrines.html           120座神庙
    ├── equipment.html         装备图鉴
    ├── cooking.html           料理配方
    ├── bosses.html            BOSS攻略
    ├── korok-seeds.html       900个呀哈哈
    ├── secrets.html           隐藏要素
    ├── regions.html           区域攻略
    └── locations.html         重要地点
```

## 部署方式

### 方式一：GitHub Pages（推荐，免费）

```bash
# 1. 在 GitHub 创建新仓库 zelda-breath-of-the-wild-guide

# 2. 初始化并推送
cd zelda-breath-of-the-wild-guide
git init
git add .
git commit -m "🎮 塞尔达攻略站 v1.0"
git branch -M main
git remote add origin https://github.com/你的用户名/zelda-breath-of-the-wild-guide.git
git push -u origin main

# 3. 在 GitHub 仓库 Settings > Pages 中
#    Source 选 "Deploy from a branch"
#    Branch 选 "main" / "/(root)"
#    点击 Save，等1分钟即可访问
```

### 方式二：Cloudflare Pages（全球CDN，免费）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单选 **Workers & Pages** > **Pages**
3. 点击 **创建项目** > **连接到 Git**
4. 选择你的 GitHub 仓库
5. 构建设置留空（纯静态HTML无需构建）
6. 部署目录填 `/`（根目录）
7. 点击 **保存并部署**

## 技术栈

- 纯 HTML/CSS/JS（零依赖，零构建）
- 响应式设计（手机/平板/桌面）
- SVG 矢量场景插图
- 深色主题 + 金色希卡风格

## 版权

© 2026 — 本站为粉丝自发攻略分享，游戏内容版权归任天堂所有。
