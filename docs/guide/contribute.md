# 贡献指南

感谢你对 LtdView 的关注！我们欢迎所有形式的贡献。

## 开发环境

### 前置要求

- Node.js 18.0+
- npm 9.0+

### 本地开发

```bash
# 克隆仓库
git clone https://gitee.com/ltd_1/ltd-view.git
cd ltd-view

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 启动文档站点（另一个终端）
npm run docs:dev
```

## 项目规范

### Git 提交规范

使用 Commitlint 规范提交信息：

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式（不影响功能）
refactor: 重构
perf: 性能优化
test: 测试
chore: 构建/工具变动
```

示例：
```bash
git commit -m "feat: 添加热力图组件"
git commit -m "fix: 修复图表下钻面包屑显示异常"
```

### 分支规范

| 分支 | 用途 |
|------|------|
| main | 生产分支 |
| develop | 开发分支 |
| feature/* | 功能分支 |
| fix/* | 修复分支 |
| docs/* | 文档分支 |

### 代码规范

- **框架**：Vue 3 Composition API（`<script setup>`）
- **组件命名**：PascalCase（`BarChart.vue`）
- **工具函数**：camelCase（`dataAdapter.js`）
- **样式**：SCSS，变量统一在 `variables.scss` 管理
- **格式化**：ESLint + Prettier

### 添加新组件

1. 在 `src/components/` 对应目录创建 Vue 组件
2. 在 `src/config/components.js` 注册组件元信息
3. 在 `src/config/themes.js` 配置主题样式（如需要）
4. 编写组件文档到 `docs/components/`

组件元信息格式：
```javascript
{
  type: 'my-chart',           // 唯一标识
  name: '我的图表',            // 显示名称
  category: 'chart',          // 分类
  icon: 'chart-bar',          // 图标
  defaultProps: {},            // 默认配置
  defaultSize: { width: 600, height: 400 }
}
```

## 提交 Pull Request

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/my-feature`
3. 提交改动：`git commit -m 'feat: add my feature'`
4. 推送到远程：`git push origin feature/my-feature`
5. 创建 Pull Request

### PR 要求

- 标题简洁，描述清楚
- 包含改动说明和截图（如有 UI 变动）
- 确保 `npm run build` 通过
- 单个 PR 聚焦一个功能点

## 问题反馈

- 使用 [GitHub Issues](https://github.com/ltd-view/ltd-view/issues) 提交 Bug 报告或功能请求
- Bug 报告请包含：操作系统、浏览器版本、复现步骤、截图

## 行为准则

- 尊重每一位贡献者
- 建设性的讨论和反馈
- 关注对社区有益的事情
