# JUΛII 展厅预览

Phase 1 技术尖刺：环视展角、两个几何占位商品，以及热点事实卡。尚未接入真实 GLB、导览音频、结账或账号。

## English summary

Phase 1 technical spike for the JUΛII showroom: an orbit view plus one hotspot each for J03-01 and J02-01. Products are geometric stand-ins until Draco GLBs land in `public/models/`. Build with `npm ci && npm run build` (output in `dist/`). Vite `base` is `/juaii-showroom-preview/`. Preview: https://maxbu1001-kun.github.io/juaii-showroom-preview/. All changes merge to `main` through pull requests; do not push to `main` directly. Performance gates: interactive first screen within 5s on a mid-range Android phone; each GLB stays in the hundreds of KB to low MB after compression; lazy-load assets; no uncompressed large textures; no payments or accounts. A hotspot id matches its audio filename.

## 目的

Phase 1 是技术尖刺：环视 + 热点，覆盖两款 SKU，`J03-01`（不锈钢托盘）与 `J02-01`（金属阅读架）。当前用几何体占位，事实卡字段均为 `TBD`。把 Draco GLB 放到 `public/models/` 后，在 `src/showroom/catalog.ts` 里把对应的 `modelFile` 设为文件名即可替换占位。

## 目录约定

| 路径 | 内容 |
| --- | --- |
| `public/models/` | Draco 压缩的 GLB，例如 `j03-01.glb`、`j02-01.glb` |
| `public/audio/` | 导览分段：`welcome`、`j03-01`、`j02-01`、`close` |
| `public/textures/` | 仅压缩贴图（可选） |
| `src/` | 应用源码 |

静态资源通过 `import.meta.env.BASE_URL` 引用，不要写死域名或省略仓库子路径。

热点 id 与音频文件名（不含扩展名）一致。例如热点 `j03-01` 对应 `public/audio/j03-01`，`welcome` 与 `close` 同理。本阶段不播放音频。

## 场景与事件

- 环视（`OrbitControls`），不可走动。像素比限制在 1–1.5，按需渲染，无后期处理。
- 每个商品一个细环热点。点按后高亮物体并打开事实卡：Material / Size / Structure / Use boundary / Planned retail。值均为占位 `TBD`。
- 事件：`onHotspotOpen(productId)`、`onCardClose(productId)`，定义在 `src/showroom/events.ts`。后续英文导览可 `subscribeShowroomEvents(...)`，或把同名回调传给 `<Showroom />`。`productId` 与音频文件名一致。
- Draco 路径：`useGLTF(url, DRACO_DECODER_PATH, false)`，见 `src/showroom/ProductModel.tsx`。解码器只在真正加载 GLB 时请求。

## 构建与预览

- Vite `base`：`/juaii-showroom-preview/`
- 安装并构建：`npm ci && npm run build`
- 产物目录：`dist/`
- 本地开发：`npm run dev`（地址含 `/juaii-showroom-preview/`）
- 本地预览构建产物：`npm run preview`
- 线上预览：https://maxbu1001-kun.github.io/juaii-showroom-preview/

推送到 `main` 后，GitHub Actions 将 `dist/` 部署到 GitHub Pages。Pages 的 Source 需设为 GitHub Actions。

## 合入规则

所有改动走 PR 合入 `main`，禁止直推 `main`。

## 性能门槛

- 首屏可交互 ≤ 5s（中端安卓）
- 单个 GLB 压缩后控制在百 KB～低 MB
- 模型、贴图与音频懒加载
- 禁止提交未压缩的大贴图
- 不接支付，不接账号体系
