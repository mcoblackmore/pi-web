# pi-web

[pi 编程智能体](https://github.com/badlogic/pi-mono) 的网页界面。在浏览器中浏览会话、与智能体对话、分叉对话、切换消息分支。

## 快速开始

**无需安装，直接运行：**

```bash
npx @mcoblackmore/pi-web@latest
```

**或全局安装后使用：**

```bash
npm install -g @mcoblackmore/pi-web
pi-web
```

启动后打开 [http://localhost:30141](http://localhost:30141)。

> **国内用户推荐先配置 npm 镜像**，否则安装可能很慢或失败：
>
> ```bash
> npm config set registry https://mirrors.cloud.tencent.com/npm/
> ```
>
> 也可用阿里云镜像 `https://registry.npmmirror.com/`。此配置全局生效，不影响其他项目。

**可选参数：**

```bash
pi-web --port 8080               # 自定义端口
pi-web --hostname 127.0.0.1      # 仅本机访问
pi-web -p 8080 -H 127.0.0.1     # 组合使用

PORT=8080 pi-web                 # 也支持环境变量
```

---

## 发布指南（维护者用）

如果你是项目维护者，发布新版本的步骤：

### 1. 登录 npm

```bash
npm login
```

按提示输入 npmjs.com 的账号、密码和邮箱。可先运行 `npm whoami` 确认登录成功。

### 2. 发布

```bash
npm run release
```

这条命令会依次执行：自动递增版本号 → 构建 → 发布到 npm。

### 3. 验证

```bash
npm info @mcoblackmore/pi-web version
```

发布后 1–2 小时内国内各大镜像会自动同步。用户配好镜像源后即可快速安装。

### 手动指定版本号

```bash
npm version minor    # 0.6.x → 0.7.0，有功能新增时用
npm version major    # 0.x.x → 1.0.0，有破坏性变更时用
npm version patch    # x.x.0 → x.x.1，仅修复 bug 时用（npm run release 默认用这个）
```

---

## 功能介绍

- **会话浏览器** — 按工作目录分组展示所有 pi 会话
- **实时对话** — 通过 SSE 流式输出与智能体实时交互
- **会话分叉** — 从任意用户消息创建独立的新会话分支
- **会话内分支** — 回退到任意节点继续对话，在同一文件内创建分支
- **分支导航器** — 可视化切换同一会话内的各个分支
- **模型切换** — 对话中途随时切换模型
- **工具面板** — 控制智能体可使用的工具
- **压缩会话** — 对长会话进行摘要，节省上下文窗口
- **引导 / 追加** — 打断正在运行的智能体，或在其完成后追加消息

## 注意事项

- **数据目录** — 默认读取 `~/.pi/agent/sessions` 下的会话文件。可通过环境变量 `PI_CODING_AGENT_DIR` 指定其他目录。
- **模型配置** — 从智能体数据目录下的 `models.json` 读取可用模型，可在侧边栏的「Models」面板中编辑。
- **文件浏览** — 侧边栏内置文件浏览器，可在标签页中查看当前工作目录下的文件。

## 常见问题

### 安装很慢或失败

国内用户务必先配置镜像源（见上方快速开始），否则 npm 官方源在国内极慢。如腾讯云镜像同步不及时，可换阿里云：

```bash
npm config set registry https://registry.npmmirror.com/
```

### npx 提示找不到包

国内镜像有 1–2 小时同步延迟。可以临时指定官方源运行：

```bash
npx --registry https://registry.npmjs.org/ @mcoblackmore/pi-web@latest
```

### 设置了镜像但安装报错

可能是该镜像尚未同步最新版本。可在 [npmmirror.com](https://npmmirror.com/package/@mcoblackmore/pi-web) 手动触发一次同步。

### 启动后页面空白

检查是否已安装 `@earendil-works/pi-coding-agent`，该项目依赖此包才能正常运行。正常情况下 `npm install` 会自动安装，如果跳过了，手动执行：

```bash
npm install @earendil-works/pi-coding-agent
```

## 开发

```bash
npm install
npm run dev   # 端口 30141
```

## 项目结构

```
app/
  api/
    sessions/      # 读写会话文件
    agent/         # 发送命令、SSE 事件流
    files/         # 文件内容读取
    models/        # 可用模型列表与默认模型
    models-config/ # 读写 models.json
components/        # UI 组件
lib/
  session-reader.ts  # 解析 .jsonl 会话文件
  rpc-manager.ts     # 管理 AgentSession 生命周期
  normalize.ts       # 规范化 toolCall 字段名
  types.ts
```

会话文件存储路径：`~/.pi/agent/sessions/<编码后的工作目录>/<时间戳>_<uuid>.jsonl`
