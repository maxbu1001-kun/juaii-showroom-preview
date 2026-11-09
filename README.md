# JUΛII 展厅预览

Phase 2：环视展角、两个几何占位商品、访客事实卡，以及英文导览音频。尚未替换真实 GLB，无结账、无账号。

## English summary

Phase 2 of the JUΛII showroom: an orbit view, one hotspot each for J03-01 and J02-01, visitor fact cards, and the English guide. Products stay geometric stand-ins until Draco GLBs land in `public/models/`. Build with `npm ci && npm run build` (output in `dist/`). Vite `base` is `/juaii-showroom-preview/`. Preview: https://maxbu1001-kun.github.io/juaii-showroom-preview/. All changes merge to `main` through pull requests; do not push to `main` directly. Performance gates: interactive first screen within 5s on a mid-range Android phone; each GLB stays in the hundreds of KB to low MB after compression; lazy-load assets; no uncompressed large textures; no payments or accounts. Hotspot ids stay lowercase. Guide files keep the archive names `welcome.mp3`, `J03-01.mp3`, `J02-01.mp3`, and `close.mp3`.

## 目的

环视 + 热点，覆盖两款 SKU：`J03-01`（Stainless desk tray）与 `J02-01`（Metal reading stand）。几何体仍是占位。事实卡只展示访客字段的英文：Material、Finish、Size / weight、Structure、Use · do、Use · don't、Planned retail。规划零售整句保留目录原文（`Planned retail · price band needs experiment: ¥109` / `¥99`）。`internal_*` 与证据等级不进界面，也不进 `catalog.ts`。中文文案留在 catalog 数据里。把 Draco GLB 放到 `public/models/` 后，在 `src/showroom/catalog.ts` 里把对应的 `modelFile` 设为文件名即可替换占位。

## 目录约定

| 路径 | 内容 |
| --- | --- |
| `public/models/` | Draco 压缩的 GLB，例如 `j03-01.glb`、`j02-01.glb` |
| `public/audio/` | 导览分段：`welcome.mp3`、`J03-01.mp3`、`J02-01.mp3`、`close.mp3` |
| `public/textures/` | 仅压缩贴图（可选） |
| `src/` | 应用源码 |

静态资源通过 `import.meta.env.BASE_URL` 引用，不要写死域名或省略仓库子路径。

热点 id 仍是小写 `j03-01` / `j02-01`。音频文件名用归档原样：`J03-01.mp3`、`J02-01.mp3`（另有 `welcome.mp3`、`close.mp3`）。未重编码。

## 场景与事件

- 环视（`OrbitControls`），不可走动。像素比限制在 1–1.5，按需渲染，无后期处理。
- 每个商品一个细环热点。点按后高亮物体并打开事实卡，英文标签见上。表面处理对应 **Finish**。使用边界拆成 **Use · do** 与 **Use · don't**。
- 事件：`onHotspotOpen(productId)`、`onCardClose(productId)`，定义在 `src/showroom/events.ts`。展厅自己订阅这两处：打开热点时播放对应产品音频，关卡时先停掉当前音频。同一时间只有一条 `HTMLAudioElement`。换热点会停掉上一条再播下一条。
- 欢迎语在首次进入时尝试播放 `welcome.mp3`。若浏览器拦截自动播放，左上角按钮变为 **Play welcome**（显式开始）。
- 关掉事实卡（Close、Escape，或再点当前热点）会接着播放 `close.mp3`。未打开卡片时，用 **Closing note** 播放同一条。正在听欢迎语或结束语时，再点对应按钮会停止。换到另一个热点不会插播结束语。
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
