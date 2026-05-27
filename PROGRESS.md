# 科即糖 pi-web 改造进度

> 开始：2026-05-27 | 状态：✅ 完成

---

## 进度

| Phase | Task | 状态 |
|-------|------|------|
| 1 | Task 1: 页面元数据 → "科即糖 AI Agent" | ✅ |
| 1 | Task 2: 亮色主题 → 蜂蜜琥珀 | ✅ |
| 1 | Task 3: 暗色主题 → 暖黑 + 金色 | ✅ |
| 1 | Task 4: 科技点缀色 → 紫罗兰链接 | ✅ |
| 2 | Task 5: favicon（logo 中心裁方） | ✅ |
| 2 | Task 6: 顶栏 Logo + "科即糖" | ✅ |
| 3 | Task 7: 侧边栏按钮（已有圆角，跳过） | ✅ |
| 3 | Task 8: 空状态/placeholder 文案中文化 | ✅ |
| — | 额外：全部 UI 按钮/提示文案中文化 | ✅ |

---

## 已修改文件

| 文件 | 改动 |
|------|------|
| `app/layout.tsx` | title → "科即糖 AI Agent", description 中文化 |
| `app/globals.css` | 亮/暗色 22 个 CSS 变量 + `--accent-tech` 科技紫 |
| `app/favicon.ico` | logo 中心 224×224 裁方 → 多尺寸 ICO |
| `public/logo.png` | logo 副本用于 Web 引用 |
| `components/AppShell.tsx` | 顶栏 Logo+品牌名 + 空状态/引导文案中文化 |
| `components/ChatInput.tsx` | placeholder 中文化 |
| `components/SessionSidebar.tsx` | "No sessions"/"Delete"/"New session" 中文化 |
| `components/FileExplorer.tsx` | "No files found" 中文化 |
| `components/MessageView.tsx` | "New session"/"Fork" 中文化 |
| `components/SkillsConfig.tsx` | "Search"/"Install"/"Select" 中文化 |
| `components/ModelsConfig.tsx` | "Save"/"Select provider" 中文化 |
| `components/TabBar.tsx` | "Close" 中文化 |

---

## 配色速查

| 位置 | 亮色 | 暗色 |
|------|------|------|
| 背景 | `#fffbeb` 暖奶油 | `#1c1917` 暖黑 |
| 面板 | `#fef3c7` 淡蜜 | `#292524` 暖灰黑 |
| 主色 | `#d97706` 琥珀 | `#f59e0b` 金色 |
| 科技点缀 | `#7c3aed` 紫罗兰 | `#a78bfa` 淡紫 |
| 悬停 | `#fde68a` | `#44403c` |
| 选中 | `#fcd34d` | `#57534e` |

---

## 启动验证

```bash
cd E:\pi-web
npm install   # 如果还没装依赖
npm run dev   # → http://localhost:30141
```
