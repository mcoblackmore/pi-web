# 登录系统设计方案

> 状态：方案讨论 | 日期：2026-05-27

---

## 一、需求

1. pi-web 主页前加登录页（用户名 + 密码 → 确认 → 进入）
2. **多用户**：可授权很多账号，每个有独立用户名和密码
3. 未登录无法访问任何功能页面

---

## 二、密码存哪里？（已定：SQLite）

| 方案 | 结论 |
|------|------|
| `.env.local` | ❌ 只能存一对账号，不适合多用户 |
| `data/users.json` | ⚠️ 可以，但并发写不安全 |
| **SQLite `data/users.db`** | ✅ 零配置、加密存、并发安全 |

## 三、存储结构

```
E:\pi-web\data\
  └── users.db          ← SQLite 文件（不上传 Git，.gitignore 已加）
```

**users 表**：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 自增主键 |
| username | TEXT | 用户名，唯一 |
| password_hash | TEXT | bcrypt 加密后的密码 |
| role | TEXT | "admin" / "user"（默认 user） |
| created_at | TEXT | 创建时间 |

密码用 **bcrypt** 加密存储，即使数据库泄露也看不到明文。

---

## 四、登录流程

```
浏览器访问 / 任意页面
  │
  ├─ Next.js middleware 拦截
  │    ├─ 有合法 cookie → 放行
  │    └─ 无 cookie → 重定向 /login
  │
  └─ /login 页面
       ├─ 输入 username + password
       ├─ POST /api/auth/login → 服务端查 users.db + bcrypt 验证
       ├─ 成功 → 写入 httpOnly cookie（jwt token）→ 跳转主页
       └─ 失败 → 红色提示"用户名或密码错误"
```

---

## 五、涉及文件

```
新增：
  data/                          # 用户数据目录
  app/login/
    page.tsx                     # 登录页面 UI
    layout.tsx                   # 登录页布局（不需要侧边栏）
  app/api/auth/
    login/route.ts               # POST 登录接口
    logout/route.ts              # POST 登出接口
  lib/auth.ts                    # JWT 签发/验证、密码校验
  middleware.ts                   # Next.js middleware（路由守卫）
  scripts/
    add-user.js                  # 终端添加用户脚本
    list-users.js                # 终端查看用户列表

修改：
  app/layout.tsx                 # 判断是否是登录页，决定是否套 AppShell
  .gitignore                     # 加 data/users.db
  package.json                   # 加 bcryptjs、jose 依赖
```

---

## 六、用户管理方式（待确认）

### 方式 1：终端脚本（简单）

```bash
# 添加用户
node scripts/add-user.js zhangsan 密码123

# 查看所有用户
node scripts/list-users.js

# 删除用户（可选）
node scripts/delete-user.js zhangsan
```

### 方式 2：Web 管理页（完整）

管理员登录后，pi-web 侧边栏多一个"用户管理"入口，可以增删改查用户。

---

## 七、登录页 UI 设计方向（待确认）

| 选项 | 说明 |
|------|------|
| A | 跟主页一样的暖色系，居中的登录卡片 |
| B | 独立设计（渐变背景 + Logo + 卡片） |
| C | 极简（居中表单、纯色背景） |

---

## 八、当前待决策

| # | 问题 | 选项 |
|---|------|------|
| 1 | 用户管理用终端脚本还是 Web 页面？ | 脚本 / Web |
| 2 | 要不要区分角色（admin/user）？ | 要 / 所有人同权限 |
| 3 | 登录页 UI 风格？ | A 暖色统一 / B 独立 / C 极简 |
| 4 | 要不要"7天免登录"？ | 要 / 不要 |

---

## 九、下一步

确认上面 4 个问题 → 写详细实施计划（planning-with-files + TDD 分步执行）
