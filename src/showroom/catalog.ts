import type { ProductId } from './events'

/** Visitor-facing copy. The English card reads `en`; `zh` stays in the catalog. */
export type Bilingual = {
  zh: string
  en: string
}

export type VisitorFactKey =
  | 'material'
  | 'finish'
  | 'sizeWeight'
  | 'structure'
  | 'useDo'
  | 'useDont'
  | 'plannedRetail'

/** English labels for the public showroom card. Internal CSV columns are not listed. */
export const visitorFactFields: readonly { key: VisitorFactKey; label: string }[] = [
  { key: 'material', label: 'Material' },
  { key: 'finish', label: 'Finish' },
  { key: 'sizeWeight', label: 'Size / weight' },
  { key: 'structure', label: 'Structure' },
  { key: 'useDo', label: 'Use · do' },
  { key: 'useDont', label: "Use · don't" },
  { key: 'plannedRetail', label: 'Planned retail' },
]

export type Product = {
  id: ProductId
  /** English product name shown on the card. */
  name: string
  /** Chinese product name. Kept in data; the English card does not render it. */
  nameZh: string
  /**
   * Draco GLB under `public/models/`. Null keeps the geometric stand-in.
   * Intended filenames: `j03-01.glb`, `j02-01.glb`.
   */
  modelFile: string | null
  position: [number, number, number]
  plinth: [number, number, number]
  hotspot: [number, number, number]
  material: Bilingual
  finish: Bilingual
  sizeWeight: Bilingual
  structure: Bilingual
  useDo: Bilingual
  useDont: Bilingual
  /**
   * Full planned-retail line from the catalog, prefix included.
   * Do not shorten to a bare amount.
   */
  plannedRetail: Bilingual
}

export const products: readonly Product[] = [
  {
    id: 'j03-01',
    name: 'Stainless desk tray',
    nameZh: '小型不锈钢置物盘',
    modelFile: null,
    position: [0.02, 0, 0.32],
    plinth: [0.74, 0.04, 0.54],
    hotspot: [0.18, 0.12, 0.3],
    material: { zh: '不锈钢（合金牌号待验，不宣称 304）', en: 'Stainless steel (alloy grade pending sample; not claimed as 304)' },
    finish: { zh: '砂光；直边本色金属感', en: 'Brushed; straight-rim metal look' },
    sizeWeight: { zh: '候选约 Ø12.5 cm；高约 2.6 cm；约 153 g（供方挂牌线索，待样核验）', en: 'Candidate approx. Ø12.5 cm; height ~2.6 cm; ~153 g (listing cue; sample-pending)' },
    structure: { zh: '小型直边圆盘；盘沿可读；无装饰堆叠', en: 'Small straight-rim round tray; readable rim; no decorative add-ons' },
    useDo: { zh: '干置物、桌面收纳：钥匙、小工具、零碎小件', en: 'Dry desk catch-all: keys, small tools, scattered bits' },
    useDont: { zh: '不宣称食品级；不宣称烤箱/洗碗机；不作电镀薄盘/派对盘叙事', en: 'Not claimed food-grade; no oven/dishwasher claims; not a thin plated party-tray story' },
    plannedRetail: { zh: '规划零售 · 价格带需实验：¥109', en: 'Planned retail · price band needs experiment: ¥109' },
  },
  {
    id: 'j02-01',
    name: 'Metal reading stand',
    nameZh: '金属阅读支架',
    modelFile: null,
    position: [0.92, 0, -0.28],
    plinth: [0.48, 0.04, 0.36],
    hotspot: [0.08, 0.12, 0.3],
    material: { zh: '全金属结构（具体钢种/是否含塑料夹件待样核验）', en: 'All-metal construction (exact steel grade / any plastic clamp parts sample-pending)' },
    finish: { zh: '金属本色/常见工业涂装向（精确涂层待样）', en: 'Bare metal or common industrial coating (exact coating sample-pending)' },
    sizeWeight: { zh: '精确外形尺寸与净重待样品核验；结构为桌面阅读架体量', en: 'Exact outer dimensions and net weight sample-pending; desk reading-stand scale' },
    structure: { zh: '双杆升降向可调架：立杆、铰链/转角、夹持可读（首样含夹持对照样）', en: 'Dual-pole height-adjustable stand: poles, hinge/pivot, and clamp readable (hero sample includes clamp control sample)' },
    useDo: { zh: '书本或平板阅读/观看；角度可调；夹持设计用于页边或设备边缘', en: 'Reading or viewing a book or tablet; settable angle; clamp designed to hold a page or device edge' },
    useDont: { zh: '非相机脚架；非重型显示器支架；非装饰雕塑；不说「永不滑落」（样品前仅 designed to hold）', en: 'Not a camera tripod; not a heavy monitor arm; not décor sculpture; do not say “never slips” (say “designed to hold” until samples)' },
    plannedRetail: { zh: '规划零售 · 价格带需实验：¥99', en: 'Planned retail · price band needs experiment: ¥99' },
  },
]

export function findProduct(id: ProductId): Product {
  const product = products.find((item) => item.id === id)
  if (!product) throw new Error(`Unknown product ${id}`)
  return product
}
