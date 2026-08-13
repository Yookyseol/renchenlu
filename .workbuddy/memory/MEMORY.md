# 长期记忆

## 用户偏好

- 使用微信风格UI设计（sticky头部、居中标题、返回按钮）
- 地图默认使用现代地图，支持历史地形图层切换
- 人物数据必须从韩文原文提取，不使用中文翻译
- 梦见诸葛亮人物从精校版提取

## 项目约定

- 网站部署到 GitHub Pages: https://yookyseol.github.io/renchenlu/
- 代码仓库：https://github.com/Yookyseol/renchenlu
- 人物数据存储在 content/characters.json
- 时间线数据存储在 app.js 中的 TIMELINE_DATA 和 MENGJIAN_TIMELINE_DATA

## 技术栈

- 单页应用（SPA）+ hash路由
- Leaflet.js v1.9.4 地图库
- 高德地图API（Key: e1f4dde6fe70b3b28c121d8193016a7b）
- ESRI World Physical Map 作为历史底图
- 微信风格UI设计
