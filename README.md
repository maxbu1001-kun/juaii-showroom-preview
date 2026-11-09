# JUΛII 展厅预览

静态 3D 展厅预览站点的空壳。当前没有真正的三维场景，只提供 Vite + React + TypeScript 占位页，供后续接入 React Three Fiber。

## English summary

Phase 1 technical spike for the JUΛII showroom: an orbit view plus hotspots for two SKUs, J03-01 and J02-01. This repository is the empty shell only. Build with `npm ci && npm run build` (output in `dist/`). Vite `base` is `/juaii-showroom-preview/`. Preview: https://maxbu1001-kun.github.io/juaii-showroom-preview/. All changes merge to `main` through pull requests; do not push to `main` directly. Performance gates: interactive first screen within 5s on a mid-range Android phone; each GLB stays in the hundreds of KB to low MB after compression; lazy-load assets; no uncompressed large textures; no payments or accounts. A hotspot id matches its audio filename.

## 目的

Phase 1 是技术尖刺：环视 + 热点，覆盖两款 SKU，`J03-01` 与 `J02-01`。本仓库只搭构建与发布骨架，场景本身由后续开发者实现。

## 目录约定

| 路径 | 内容 |
| --- | --- |
| `public/models/` | Draco 压缩的 GLB，例如 `j03-01.glb`、`j02-01.glb` |
| `public/audio/` | 导览分段：`welcome`、`j03-01`、`j02-01`、`close` |
| `public/textures/` | 仅压缩贴图（可选） |
| `src/` | 应用源码 |

静态资源通过 `import.meta.env.BASE_URL` 引用，不要写死域名或省略仓库子路径。

热点 id 与音频文件名（不含扩展名）一致。例如热点 `j03-01` 对应 `public/audio/j03-01`，`welcome` 与 `close` 同理。

## 构建与预览

- Vite `base`：`/juaii-showroom-preview/`
- 安装并构建：`npm ci && npm run build`
- 产物目录：`dist/`
- 预览地址：https://maxbu1001-kun.github.io/juaii-showroom-preview/

推送到 `main` 后，GitHub Actions 将 `dist/` 部署到 GitHub Pages。Pages 的 Source 需设为 GitHub Actions。

## 合入规则

所有改动走 PR 合入 `main`，禁止直推 `main`。

## 性能门槛

- 首屏可交互 ≤ 5s（中端安卓）
- 单个 GLB 压缩后控制在百 KB～低 MB
- 模型、贴图与音频懒加载
- 禁止提交未压缩的大贴图
- 不接支付，不接账号体系
