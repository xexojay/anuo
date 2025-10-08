# Research Canvas - 文档中心

欢迎来到Research Canvas文档中心！这里包含了项目的完整产品和技术文档。

---

## 📚 文档导航

### 🎯 产品文档

#### [产品需求文档 (PRD.md)](./PRD.md)
**最重要的文档** - 了解项目的完整信息

**包含内容**:
- 📋 项目背景和目标
- ⚙️ 核心功能详解
- 🏗️ 技术架构
- ✅ 已实现功能清单
- 👤 用户场景
- 🚀 未来规划

**适合人群**:
- 产品经理
- 项目利益相关者
- 新加入的开发者
- 想全面了解项目的任何人

---

#### [技术栈文档 (TECH_STACK.md)](./TECH_STACK.md)
完整的技术选型和配置说明

**包含内容**:
- 📦 完整依赖清单
- 🏗️ 项目架构
- 🔧 配置文件说明
- 🌐 第三方服务集成
- ⚡ 性能优化
- 🚀 部署架构

**适合人群**:
- 开发工程师
- DevOps工程师
- 技术架构师

---

#### [参考项目文档 (REFERENCE.md)](./REFERENCE.md)
参考的项目和灵感来源

**包含内容**:
- 🎨 设计参考（kuse.ai等）
- 🛠️ 技术参考（tldraw、Supabase）
- 💡 灵感来源
- 📊 竞品对比
- 🎯 创新点
- 🙏 致谢

**适合人群**:
- 设计师
- 产品经理
- 想了解设计思路的人

---

## 🚀 快速开始

### 我是产品经理
👉 先读 [PRD.md](./PRD.md) 了解完整产品

### 我是开发者
👉 先读 [TECH_STACK.md](./TECH_STACK.md) 了解技术架构
👉 然后看 [../QUICKSTART.md](../QUICKSTART.md) 运行项目

### 我是设计师
👉 先读 [REFERENCE.md](./REFERENCE.md) 了解设计参考
👉 然后看 [../UI_REDESIGN.md](../UI_REDESIGN.md) 查看UI升级

### 我想快速体验
👉 直接看 [../QUICKSTART.md](../QUICKSTART.md)

---

## 📖 其他文档

### 根目录文档

| 文档 | 说明 | 适合 |
|------|------|------|
| [README.md](../README.md) | 项目概览 | 所有人 |
| [QUICKSTART.md](../QUICKSTART.md) | 5分钟上手 | 新用户 |
| [DEMO.md](../DEMO.md) | 完整使用指南 | 用户 |
| [HOW_IT_WORKS.md](../HOW_IT_WORKS.md) | 技术原理 | 开发者 |
| [DEPLOYMENT.md](../DEPLOYMENT.md) | 部署指南 | 运维 |
| [PROJECT_SUMMARY.md](../PROJECT_SUMMARY.md) | 项目总结 | PM |
| [UI_REDESIGN.md](../UI_REDESIGN.md) | UI升级记录 | 设计师 |

### 组件文档

| 文档 | 说明 |
|------|------|
| [components/canvas/shapes/README.md](../components/canvas/shapes/README.md) | Shape开发指南 |
| [supabase/README.md](../supabase/README.md) | 数据库配置 |

---

## 🎯 文档使用建议

### 第一次接触项目？

**推荐阅读顺序**:
1. [README.md](../README.md) - 了解项目是什么
2. [QUICKSTART.md](../QUICKSTART.md) - 运行起来
3. [docs/PRD.md](./PRD.md) - 深入了解产品
4. [HOW_IT_WORKS.md](../HOW_IT_WORKS.md) - 理解技术实现

### 要开发新功能？

**推荐阅读**:
1. [TECH_STACK.md](./TECH_STACK.md) - 了解技术栈
2. [HOW_IT_WORKS.md](../HOW_IT_WORKS.md) - 理解架构
3. 相关组件的README

### 要部署到生产？

**推荐阅读**:
1. [DEPLOYMENT.md](../DEPLOYMENT.md) - 部署步骤
2. [TECH_STACK.md](./TECH_STACK.md) - 环境配置

---

## 🔄 文档维护

### 更新规则

- **产品变更** → 更新PRD.md
- **技术升级** → 更新TECH_STACK.md
- **新增参考** → 更新REFERENCE.md
- **UI调整** → 更新UI_REDESIGN.md

### 文档版本

当前所有文档版本：**v1.0** (2025-01-08)

---

## 💬 反馈

发现文档问题或有改进建议？

- 📧 提Issue到GitHub
- 💬 在Discussion讨论
- ✏️ 提交PR改进文档

---

## 📌 重要提示

### 环境变量

所有API密钥配置请参考：
- [.env.example](../.env.example) - 环境变量模板
- [DEPLOYMENT.md](../DEPLOYMENT.md) - 详细配置说明

### Mock vs 真实API

- ✅ **默认使用Mock数据** - 无需任何配置
- ⚡ **可切换真实API** - 配置环境变量即可
- 📖 **详见**: [HOW_IT_WORKS.md](../HOW_IT_WORKS.md)

---

## 🗺️ 文档地图

```
research-canvas/
├── 📄 README.md                    ← 项目入口
├── 📄 QUICKSTART.md                ← 快速开始
├── 📄 DEMO.md                      ← 使用指南
├── 📄 HOW_IT_WORKS.md              ← 技术原理
├── 📄 DEPLOYMENT.md                ← 部署指南
├── 📄 PROJECT_SUMMARY.md           ← 项目总结
├── 📄 UI_REDESIGN.md               ← UI升级
└── 📁 docs/                        ← 产品文档（本目录）
    ├── 📄 README.md                ← 文档导航（本文档）
    ├── 📄 PRD.md                   ← 产品需求
    ├── 📄 TECH_STACK.md            ← 技术栈
    └── 📄 REFERENCE.md             ← 参考项目
```

---

**📌 建议收藏本文档作为导航入口！**

**最后更新**: 2025-01-08
