# graph-viz-lite

**单文件离线 SVG 关系图**：给定节点与边，用简单**环形布局**把节点均匀摆在圆周上，边画成连线，渲染成一个 SVG 关系图。内置示例数据，双击 `index.html` 即可打开。配套 `test.js` 用 Node 断言校验连通性与布局。

## 功能简介

- 节点按环形布局均匀分布在圆周上。
- 边用 SVG `<line>` 连接两端节点。
- 内置示例：5 节点、5 条边的连通图。
- 完全离线，无任何外部依赖。

## 快速开始

```bash
# 浏览器打开
open index.html
```

运行断言测试：

```bash
node test.js
```

输出形如：

```
PASS: 节点数 = 5
PASS: 边数 = 5
PASS: 图连通（从起点可到达所有节点）
全部断言通过
```

## 如何替换数据

编辑 `index.html` 里 `<script id="graph-data" type="application/json">` 块：
- `nodes`：`[{id}, ...]`；
- `edges`：`[{from, to}, ...]`。

## 目录说明

```
graph-viz-lite/
├── index.html   # 单文件 SVG 关系图
├── test.js      # Node 断言（连通性 + 布局）
├── README.md
├── LICENSE
└── .gitignore
```

## License

MIT License，Copyright (c) 2026 ljiang9。
