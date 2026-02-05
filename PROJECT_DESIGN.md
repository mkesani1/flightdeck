# FlightDeck Design Specifications

## 🔒 DESIGN LOCKED - 2026-02-03
**Live Operations Page design is FINALIZED. Do not modify without explicit user approval.**

## Design Philosophy
Premium Scandinavian dark mode aesthetic with generous spacing and subtle visual hierarchy.

---

## Color Palette (LOCKED - 2026-02-03)

### Backgrounds
| Name | Value | Usage |
|------|-------|-------|
| Background | `var(--color-dark-bg)` / `#0D0D0D` | Main page background |
| Surface | `#1A1A1C` | Cards, panels |
| Surface 2 | `#2A2A2E` | Nested elements, icon backgrounds |
| Surface 3 | `#3A3A3E` | Hover states |

### Text
| Name | Value | Usage |
|------|-------|-------|
| Primary | `#FFFFFF` | Headings, important text |
| Secondary | `#A1A1A6` | Body text, descriptions |
| Muted | `#636366` | Labels, timestamps, section headers |
| Subtle | `#48484A` | Inactive indicators |
| Light Muted | `#8E8E93` | Secondary labels, icons |
| Description | `#9A9A9E` | Card descriptions |

### Accents
| Name | Value | Usage |
|------|-------|-------|
| Green | `var(--color-green)` / `#22C55E` | Success, active states, left borders |
| Accent (Orange) | `var(--color-accent)` / `#FF4405` | Urgent, needs attention |
| Amber | `var(--color-amber)` | Warnings |

---

## Typography (LOCKED - 2026-02-03)

### Font Sizes
- Page title: `text-2xl` (24px) font-bold
- Section headers: `text-lg` (18px) font-bold
- Card titles: `text-[15px]` to `text-[16px]` font-semibold
- Body text: `text-[14px]`
- Labels: `text-[12px]` uppercase tracking-wider
- Small labels: `text-[11px]` uppercase tracking-wider
- Stats numbers: `text-4xl` font-bold

---

## Component Specifications

### Agent Cards (LOCKED - 2026-02-03)
- Background: `#1A1A1C`
- Border: `box-shadow: 0 0 0 1px rgba(255,255,255,0.05)`
- **GREEN LEFT BORDER** for active agents: `w-1` (4px), positioned `left-0 top-3 bottom-3`, `rounded-r-full`
- Padding: `p-6` (24px)
- Border radius: `rounded-2xl` (16px)
- Emoji container: `w-11 h-11`, `bg-[#2A2A2E]`, `rounded-xl`
- Status indicator: `w-2 h-2` green dot next to agent name
- Menu button: Three vertical dots in top right corner
- Agent name: `text-[15px] font-semibold`
- Task description: `text-[14px] text-[#9A9A9E]`, min-height 44px
- Business name: `text-[12px] text-[#636366]`

### Stats Bar (LOCKED - 2026-02-03)
- Background: `#1A1A1C`
- 4-column grid
- Padding: `py-8 px-6`
- Numbers: `text-4xl font-bold tracking-tight`
- Labels: `text-[11px] uppercase tracking-wider`
- Dividers: Vertical `w-px bg-[#2A2A2E]` positioned `top-5 bottom-5`
- Margin bottom: `mb-10`

### Activity Feed Items (LOCKED - 2026-02-03)
- **Individual cards** (not list items)
- Background: `#1A1A1C`
- Padding: `p-5`
- Border: `box-shadow: 0 0 0 1px rgba(255,255,255,0.05)`
- Border radius: `rounded-2xl`
- Icon container: `w-10 h-10 rounded-xl` with colored background
- Gap between items: `space-y-4`
- Agent name: `text-white font-semibold`
- Message text: `text-[14px] text-[#A1A1A6]`
- Meta info: `text-[12px] text-[#636366]`

### Intervention Cards (LOCKED - 2026-02-03)
- Background: `#1A1A1C`
- Urgent border: `box-shadow: 0 0 0 2px rgba(255, 68, 5, 0.7), 0 4px 24px rgba(255, 68, 5, 0.15)`
- Normal border: `box-shadow: 0 0 0 1px rgba(255,255,255,0.05)`
- Padding: `p-6`
- Icon container: `w-9 h-9 rounded-xl bg-[#2A2A2E]`
- Title: `text-[16px] font-semibold`
- Context: `text-[14px] text-[#A1A1A6]`
- Business badge: `px-4 py-2 bg-[#0D0D0D] rounded-xl`
- Primary button: `bg-white text-[#0D0D0D] py-3.5 px-5 rounded-xl text-[14px] font-semibold`
- Secondary button: `bg-[#2A2A2E] text-white py-3.5 px-5 rounded-xl text-[14px] font-semibold`
- Gap between items: `space-y-5`

### Navigation (LOCKED - 2026-02-03)
- Height: `h-16` (64px)
- Background: `#0D0D0D`
- Border: `border-b border-[#1C1C1E]`
- Logo: White `F` on white `rounded-xl` background, `w-9 h-9`
- Live Operations badge: Green pill with pulsing white dot

---

## Layout Specifications (LOCKED - 2026-02-03)

### Live Operations Page
- Left panel: `flex-1` with `padding: 40px 48px`
- Right panel: `w-[460px]` with `padding: 40px 36px`, `bg-[#0A0A0C]`
- Agent grid: `grid-cols-3 gap-[20px]`
- Stats bar margin: `margin-bottom: 48px`
- Active Agents section margin: `margin-bottom: 56px`
- Section header to content gap: `margin-bottom: 24px`
- Activity feed items gap: `gap: 16px`
- Intervention cards gap: `gap: 24px`

---

## Locked Elements Log

| Element | Date Locked | Notes |
|---------|-------------|-------|
| Color palette | 2026-02-03 | iOS-inspired grays with green/orange accents |
| Typography scale | 2026-02-03 | Refined sizes with proper hierarchy |
| Agent card design | 2026-02-03 | **GREEN LEFT BORDER**, generous padding |
| Stats bar | 2026-02-03 | text-4xl numbers, py-8 padding |
| Activity feed items | 2026-02-03 | Individual cards with backgrounds |
| Intervention cards | 2026-02-03 | Urgent glow effect, button styles |
| Navigation | 2026-02-03 | 64px height, green badge |
| Layout structure | 2026-02-03 | Two-panel, px-10/px-8, gap-5 |
