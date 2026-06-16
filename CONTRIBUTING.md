# Contributing to LtdView

感谢你对 LtdView 的关注！以下是参与贡献的方式。

## 开发环境

```bash
git clone https://gitee.com/ltd_1/ltd-view.git
cd ltd-view
npm install
npm run dev
```

## 分支规范

| 分支 | 用途 |
|------|------|
| `main` | 生产分支 |
| `develop` | 开发分支 |
| `feature/*` | 功能分支 |
| `fix/*` | 修复分支 |
| `docs/*` | 文档分支 |

## 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

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
feat(chart): 新增散点图组件
fix(table): 修复分页切换时数据丢失问题
```

## 开发流程

1. 从 `develop` 分支创建功能分支
2. 开发完成后提交代码
3. 确保所有检查通过：`npm run lint && npm run test && npm run build`
4. 向 `develop` 分支发起 Pull Request

## 添加新组件

1. 在 `src/components/` 对应目录创建 Vue 组件
2. 在 `src/config/components.js` 注册组件元信息
3. 编写测试到 `src/__tests__/`

## 代码规范

- Vue 3 Composition API
- ESLint + Prettier 统一格式
- 组件命名 PascalCase（`BarChart.vue`）
- 工具函数 camelCase（`dataAdapter.js`）

## 问题反馈

通过 [Gitee Issues](https://gitee.com/ltd_1/ltd-view/issues) 提交 bug 报告或功能建议。
