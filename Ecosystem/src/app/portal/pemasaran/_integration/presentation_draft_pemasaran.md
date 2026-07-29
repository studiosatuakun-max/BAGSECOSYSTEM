# Presentation Draft: Modul Pemasaran (B2B Commercial Gas Growth & Pipeline Console)
**PT Baskara Asri Ghas — BaGS Ecosystem**
**Presented by: Lead Full Stack Architect**

---

## 1. Overview Modul Pemasaran

**Modul Pemasaran (B2B Commercial Gas Growth & Pipeline Console)** adalah portal **Marketing Director command center** yang mengelola seluruh aktivitas pipeline penjualan CNG — mulai dari campaign management, lead acquisition funnel, CRM pipeline tracking, hingga top client management. Modul ini berfungsi sebagai:

- **Campaign ROI Dashboard** — tracking 4 campaign aktif dengan ROI per bulan
- **Acquisition Funnel** — monitoring 1,240 leads dari inbound hingga closed won
- **CRM Pipeline Table** — tracking 4 pipeline stages untuk Industri B2B dan Horeca
- **Top Clients Management** — monitoring 10 client teratas berdasarkan revenue contract value

> **Target Users**: Marketing Director, Marketing Manager (Rina Santoso), Account Executive (AE), Sales Representatives, dan Direksi.

---

## 2. Rincian Komponen UI & Cara Membaca Data

### 2.1 Header — PortalHeader

```
[B2B Commercial Gas Growth & Pipeline Console]
Subtitle: Modul Pemasaran | PT Baskara Asri Ghas
Role Badge: [Marketing Director Access] (warna Pink/Indigo)
Inbox Widget: [🔔 2]
```

**Cara baca:**
- Role badge Pink = Marketing Director. Akses penuh ke pipeline penjualan dan campaign management.
- User yang login: Marketing Manager Rina Santoso (sesuai DashboardHeader).

---

### 2.2 Hero Banner

```
┌──────────────────────────────────────────────────────────────┐
│  🎯 B2B COMMERCIAL GAS GROWTH & PIPELINE CONSOLE           │
│                                                              │
│  Enterprise CRM & Account Executive (AE) Pipeline Management  │
│  untuk segmen Industrial B2B dan Commercial Horeca...         │
│                                                              │
│  [Sync AE CRM Pipeline 🔄]                                │
└──────────────────────────────────────────────────────────────┘
```

**Cara baca:**
- Banner menunjukkan branding Marketing Console. Fungsi: management pipeline B2B dan Horeca.
- **"Sync AE CRM Pipeline"** = simulasi sinkronisasi data CRM dari sistem AE ke dashboard (1.5 detik).
- Campaign Manager: Rina Santoso.

---

### 2.3 Row 1 — 4 Hero Metric Cards (Bento Grid)

#### Card 1: 📊 Total CNG Leads
```
┌─────────────────────────────────┐
│ 📊 TOTAL CNG LEADS             │
│                                 │
│ 1,240 Leads                   │
│ Q3 Target: 1,500              │
│ [████████████░░] 82.6% Achieved│
│                                 │
│ ↑ 18.4% MoM                   │
│ Pink gradient                   │
└─────────────────────────────────┘
```

**Cara baca:**
- **1,240 Leads** = total inbound leads di Q3 2026.
- **82.6%** = sudah tercapai 82.6% dari target 1,500 leads. On track.
- **+18.4% MoM** = growth month-over-month.

---

#### Card 2: 📋 SLA Conversion
```
┌─────────────────────────────────┐
│ 📋 SLA CONVERSION              │
│                                 │
│ 7.6% Win Rate                 │
│ 94 Signed Deals                │
│ 24 Months SLA Avg              │
│                                 │
│ Indigo gradient                  │
└─────────────────────────────────┘
```

**Cara baca:**
- **7.6% Win Rate** = dari 1,240 leads, 94 deal berhasil signed.
- **24 Months SLA Avg** = rata-rata kontrak yang ditandatangani = 2 tahun.

---

#### Card 3: 🌐 B2B Market Reach
```
┌─────────────────────────────────┐
│ 🌐 B2B MARKET REACH           │
│                                 │
│ 1.2M Impressions              │
│ LinkedIn & Industry Expos     │
│ High Intent Signals            │
│                                 │
│ Purple gradient                  │
└─────────────────────────────────┘
```

**Cara baca:**
- **1.2 juta impressions** = total jangkauan campaign di LinkedIn dan expo industri.
- Channel: LinkedIn B2B + Industry Expos (trade shows, conference).
- **High Intent** = leads yang menunjukkan intent tinggi untuk switching dari competitor.

---

#### Card 4: 💰 CAC Efficiency
```
┌─────────────────────────────────┐
│ 💰 CAC EFFICIENCY              │
│                                 │
│ Rp 1.45 Jt / Deal             │
│ Avg LTV: Rp 2.4 Miliar        │
│ 1,650x ROI                    │
│                                 │
│ Emerald gradient                  │
└─────────────────────────────────┘
```

**Cara baca:**
- **CAC Rp 1.45 Juta/Deal** = biaya akuisisi per deal closed.
- **LTV Rp 2.4 Miliar** = lifetime value per kontrak (revenue selama kontrak aktif).
- **1,650x ROI** = dari Rp 1.45J biaya akuisisi dapat Rp 2.4M revenue → ROI massive.

---

### 2.4 Row 2 — Charts (2:1 Grid)

#### Chart Kiri: Campaign ROI Chart (Bar Chart — 2/3 width)

```
┌──────────────────────────────────────────────────────────────┐
│ 📊 CAMPAIGN ROI ANALYSIS              Jul 2026              │
│                                                              │
│   Rp Jt  🩷 Spend Campaign  🟣 Konversi Revenue            │
│      │                                                        │
│  250├                         ████████████████████           │
│  200├     ████           ████████████████████████████       │
│  150├   ██████████████                                       │
│  100├ ████████████████████████████████████████████████       │
│   50├███████████████████████████████████████████████████████ │
│     └──────────────────────────────────────────────────→     │
│        Jan  Feb  Mar  Apr  May  Jun  Jul                    │
│                                                              │
│  ROI Pills: Jan 133%  Feb 146%  Mar 171%  Apr 136%         │
│             May 179%  Jun 161%  Jul 189%                    │
└──────────────────────────────────────────────────────────────┘
```

**Data (Jan–Jul 2026):**

| Bulan | Spend (Rp Jt) | Revenue Conversion (Rp Jt) | ROI % |
|---|---|---|---|
| Jan | 48 | 112 | 133% |
| Feb | 52 | 128 | 146% |
| Mar | 61 | 165 | 171% |
| Apr | 55 | 130 | 136% |
| May | 70 | 195 | 179% |
| Jun | 66 | 172 | 161% |
| Jul | 74 | 214 | **189%** ← Highest |

**Cara baca:**
- **Dua bar** per bulan: 🩷 Spend (biaya campaign) vs 🟣 Konversi (revenue yang dihasilkan).
- **Jul 2026 = ROI terbaik** (189%) — spend Rp 74J menghasilkan Rp 214J.
- Hover tooltip menampilkan detail per bulan.
- ROI pills: hijau jika >150%, amber jika 130-150%, rose jika <130%.

**Data Source**: Campaign tracking system. Backend endpoint: `GET /api/campaigns/roi-monthly`.

---

#### Chart Kanan: Acquisition Funnel (1/3 width)

```
┌──────────────────────────────────┐
│ 📊 ACQUISITION FUNNEL           │
│                                     │
│ [████████████] 1,240 Leads       │
│      100%                         │
│           ↘                       │
│ [████████░░░░░] 832 Contacted    │
│      67.1%         -32.9%         │
│                  ↘                │
│ [███░░░░░░░░░░░] 287 Proposal    │
│      23.1%         -65.5%        │
│                  ↘                │
│ [░░░░░░░░░░░░░░] 94 Closed Won  │
│      7.6%          -67.2%        │
│                                     │
│ Conversion Rate: 7.6% Win Rate    │
└──────────────────────────────────┘
```

**Cara baca:**
- **Funnel stages**:
  1. **1,240 Leads** — inbound leads (referral, LinkedIn, expo)
  2. **832 Contacted (67.1%)** — AE sudah hubungi, technical survey
  3. **287 Proposal (23.1%)** — quota proposal submitted
  4. **94 Closed Won (7.6%)** — SLA signed
- **Drop-off rates**: Stage 1→2 drop 32.9%, 2→3 drop 65.5%, 3→4 drop 67.2%.
- Conversion rate keseluruhan: **7.6%** — industry standard B2B = 5-10%.

---

### 2.5 Row 3 — Top Clients Table

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 🏢 TOP 10 B2B & HORECA CLIENTS                   [🔍 Search...] [+10 Clients/Dossier] │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Company / Industry              │ Key Contact    │ Contract Value │ SLA Status │ Tier   │
├───────────────────────────────┼────────────────┼────────────────┼────────────┼────────┤
│ PT Krakatau Baja Smelter       │ Platinum     │ Rp 4.85B │ 🟢 Active | Up ↑ │
│ Smelter & Heavy Metallurgy     │              │ 18.4% Share│            │        │
├───────────────────────────────┼────────────────┼────────────────┼────────────┼────────┤
│ PT Unilever Foods & Beverages  │ Gold        │ Rp 3.62B │ 🟢 Active | Up ↑ │
│ F&B Manufacturing              │              │ 13.7% Share│            │        │
├───────────────────────────────┼────────────────┼────────────────┼────────────┼────────┤
│ PT Indocement Tunggal Prakarsa │ Gold        │ Rp 2.98B │ 🟢 Active | Stable │
│ Cement & Building Minerals     │              │ 11.3% Share│            │        │
├───────────────────────────────┼────────────────┼────────────────┼────────────┼────────┤
│ Grand Hyatt Hotel Jakarta      │ Gold        │ Rp 2.54B │ 🟢 Active | Up ↑ │
│ Horeca & Commercial VGL        │              │ 9.6% Share │            │        │
├───────────────────────────────┼────────────────┼────────────────┼────────────┼────────┤
│ PT Toyota Motor Mfg            │ Silver      │ Rp 1.98B │ 🔴 At Risk| Down ↓│
│ Automotive Paint Shop          │              │ 7.5% Share │            │        │
├───────────────────────────────┼────────────────┼────────────────┼────────────┼────────┤
│ PT Pabrik Kertas Tjiwi Kimia   │ Silver      │ Rp 1.75B │ 🟢 Active | Up ↑ │
│ Paper & Pulp Processing        │              │ 6.6% Share │            │        │
├───────────────────────────────┼────────────────┼────────────────┼────────────┼────────┤
│ RS Pondok Indah Group          │ Bronze      │ Rp 1.18B │ 🔴 Inactive| Down↓│
│ Medical Boiler & Laundry       │              │ 4.5% Share │            │        │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**10 Klien Teratas:**

| Rank | Company | Industry | Revenue | Share | Tier | Status |
|---|---|---|---|---|---|---|
| 1 | PT Krakatau Baja Smelter | Smelter & Heavy Metallurgy | Rp 4.85B | 18.4% | Platinum | Active ↑ |
| 2 | PT Unilever Foods & Beverages | F&B Manufacturing | Rp 3.62B | 13.7% | Gold | Active ↑ |
| 3 | PT Indocement Tunggal Prakarsa | Cement & Building Minerals | Rp 2.98B | 11.3% | Gold | Active → |
| 4 | Grand Hyatt Hotel Jakarta | Horeca & Commercial VGL | Rp 2.54B | 9.6% | Gold | Active ↑ |
| 5 | PT Toyota Motor Mfg | Automotive Paint Shop | Rp 1.98B | 7.5% | Silver | **At Risk ↓** |
| 6 | PT Pabrik Kertas Tjiwi Kimia | Paper & Pulp | Rp 1.75B | 6.6% | Silver | Active ↑ |
| 7 | PT Duta Pertiwi | Commercial Estate Power | Rp 1.42B | 5.4% | Silver | Active → |
| 8 | RS Pondok Indah Group | Medical Boiler | Rp 1.18B | 4.5% | Bronze | **Inactive ↓** |
| 9 | Pemko Surabaya - Dinas Hubbard | Public Transport CNG Fleet | Rp 980M | 3.7% | Bronze | Active ↑ |
| 10 | PT Sinar Mas Agrobusiness | Agri-Processing Boiler | Rp 760M | 2.9% | Bronze | Active → |

**Fitur Table:**
- Sortable columns (nama, revenue, share, activity)
- Filter by status: All / Active SLA / SLA Review / Expired
- Pagination: 7 per page, 2 pages total
- Action: `[Dossier]` — view client dossier

---

### 2.6 Row 4 — CRM Pipeline Tracking (Full Width)

#### Tab Industri B2B

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 📈 CRM PIPELINE TRACKING                         [🔍 Search...] [Add Lead ➕]    │
│ [● Industri B2B] [○ Horeca Commercial]                                            │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ Company Name          │ PIC & Contact       │ Est. Volume  │ Sales Rep │ Pipeline Stage │
├──────────────────────┼─────────────────────┼──────────────┼───────────┼────────────────┤
│ PT ABC Manufacturing │ Bapak Budi (Plant Mgr)│ 5,000 MMBTU │ Rudi S.  │ 🟣 Penawaran  │
│                      │ 📞 0812-3456-7890    │              │           │                │
├──────────────────────┼─────────────────────┼──────────────┼───────────┼────────────────┤
│ PT DEF Chemical      │ Ibu Siti (Purchasing)│ 12,000 MMBTU│ Rudi S.  │ 🟢 Closed Won │
│                      │ 📞 0813-9876-5432    │              │           │                │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

#### Tab Horeca Commercial

```
│ Horeca Outlet        │ PIC & Contact       │ Cluster/Area   │ Competitor │ Pipeline Stage │
├──────────────────────┼─────────────────────┼───────────────┼───────────┼────────────────┤
│ Rumah Makan Padang Jaya│ Bapak Andi (Owner)  │ Kawasan Wisata│ LPG Biru │ 🔵 Perkenalan  │
│                      │ 📞 0857-1111-2222   │ Batu          │ End: Okt26│               │
├──────────────────────┼─────────────────────┼───────────────┼───────────┼────────────────┤
│ Hotel Bintang Lima    │ Ibu Rina (Chef)     │ Surabaya Pusat│ PGN       │ 🔵 Penyampaian │
│                      │ 📞 0811-2233-4455   │               │ End: —    │ Kontrak        │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Pipeline Stages:**
- 🔵 Perkenalan_Awal → 🟣 Penawaran → 🟡 Follow_Up → 🔵 Penyampaian_Kontrak → 🩵 Negosiasi → 🟢 Closed Won / 🔴 Closed Lost

**Business Rule (Anti-Fraud):**
- Horeca leads dengan `current_vendor` WAJIB punya `competitor_contract_end_date` (Zod validation). Ini mencegah fake lead entry.

---

## 3. Campaign Management

### Active Campaigns

| ID | Campaign | Platform | Status | Budget | Leads | Conversion |
|---|---|---|---|---|---|---|
| CMP-01 | B2B Smelter & Metallurgy Q3 Retargeting | LinkedIn | 🟢 Running | Rp 45.0J | 412 | 12.4% |
| CMP-02 | Horeca & Commercial VGL Promo Merdeka | Instagram | 🟢 Running | Rp 28.5J | 320 | 9.8% |
| CMP-03 | Industrial Bulk CNG Awareness Push | Google Ads | 🟡 Paused | Rp 60.0J | 280 | 7.1% |
| CMP-04 | Skid Tube Trailer Milk-Run Expansion | Email B2B | ⚪ Draft | Rp 15.0J | 128 | 14.2% |

### B2B Proposals
- **23 proposals** generated Jul 2026
- Sent: 23, Reviewed: 14, Stalled: **4** ⚠️
- ⚠️ **4 proposals stalled >14 days** — perlu follow-up segera

---

## 4. SOP Terintegrasi

### SOP 1: Lead-to-Contract Pipeline
```
1. Lead masuk (inbound: referral, LinkedIn, expo, website)
       ↓
2. AE hubungi lead → Technical survey → "Contacted" (67.1%)
       ↓
3. AE buat quota proposal → "Proposal Submitted" (23.1%)
       ↓
4. Negosiasi terms → "Penyampaian Kontrak"
       ↓
5. Kontrak signed → "Closed Won" → aktif di Modul Industrial / Modul Horeca
       ↓
6. Revenue MTD di-update di dashboard marketing
```

### SOP 2: Campaign ROI Management
```
1. Planning campaign: LinkedIn / Google Ads / Instagram / Email B2B
       ↓
2. Set budget dan target leads
       ↓
3. Monitoring ROI bulanan via Campaign ROI Chart
       ↓
4. IF ROI < 100% → review spend allocation, pause/reallocate budget
       ↓
5. Jul 2026: 189% ROI → best performing month ✅
```

### SOP 3: Stalled Proposal Follow-Up
```
1. Monitoring proposals via B2B Proposals Card
       ↓
2. Proposal stalled > 14 hari → amber warning alert
       ↓
3. AE follow-up via telepon/email
       ↓
4. IF no response after 30 hari → escalate ke Marketing Director
       ↓
5. IF deal closed → update pipeline stage
```

### SOP 4: Client Retention & Risk Management
```
1. Monitoring Top Clients table untuk "At Risk" / "Inactive" status
       ↓
2. PT Toyota Motor Manufacturing (At Risk) → koordinasi AE untuk retention
       ↓
3. RS Pondok Indah Group (Inactive) → investigasi churn reason
       ↓
4. Competitor end date monitoring → prep switch strategy
       ↓
5. Target: Maintain Platinum/Gold client satisfaction
```

---

## 5. Ringkasan Teknis

| Aspek | Detail |
|---|---|
| **Framework** | Next.js 15 App Router (TypeScript) |
| **Styling** | Tailwind CSS + Frosted Glassmorphism (Pink/Purple palette) |
| **Charts** | Recharts (`BarChart`, funnel via custom CSS bars) |
| **Icons** | Lucide React + Heroicons via AppIcon |
| **State Management** | React `useState` + `useMemo` (client-side) |
| **Data** | Mock data (4 campaigns, 10 clients, 4 leads) |
| **Dark/Light Mode** | Supported via Tailwind `dark:` |
| **Validation** | Zod schemas (`schema.ts`) with Horeca competitor date rule |
| **Database Schema** | PostgreSQL DDL + RLS policies (`migration.sql`) |

---

## 6. ⚠️ Technical Notes (for Developer)

### Bug 1: Broken Modal CRUD
Modal JSX dan state (`isModalOpen`, `setIsModalOpen`, `campaigns`, `setCampaigns`) tidak dideklarasikan. Handler functions (`handleOpenModal`, `handleSave`, `handleDelete`) ada tapi modal tidak bisa di-render.

### Bug 2: Dead Code Components
Old light-themed components (`DashboardHeader`, `MetricCardsRow`, `MarketingReachCard`, `B2BProposalsCard`, `CreateCampaignCard`) ada di folder `components/` tapi TIDAK di-import di `page.tsx`. Sebaiknya dihapus atau diintegrasikan.

### Bug 3: Unused Wrapper Components
`AcquisitionFunnel`, `TopClientsTable`, `CampaignROIChart` adalah wrapper thin yang pass-through ke client versions. Ini OK tapi perlu dipertimbangkan konsolidasi.

### Action Item
Deklarasikan modal state dan render modal JSX. Bersihkan dead code components.

---

## 7. Checklist Kelayakan Presentasi

- [x] Overview & Business Context jelas (B2B + Horeca pipeline)
- [x] Header PortalHeader dijelaskan
- [x] Hero Banner + CRM Sync button dijelaskan
- [x] 4 Hero Metric Cards dijelaskan (1,240 leads, 7.6% conversion, 1.2M reach, 1,650x ROI)
- [x] Campaign ROI Bar Chart dijelaskan (Jan-Jul, ROI 133%-189%)
- [x] Acquisition Funnel dijelaskan (4 stages, 7.6% overall conversion)
- [x] Top 10 Clients Table dijelaskan (Platinum to Bronze tier, At Risk monitoring)
- [x] CRM Pipeline Table (dual-tab: Industri + Horeca) dijelaskan
- [x] Campaign Management (4 campaigns, stalled proposal alert) dijelaskan
- [x] 4 SOP terintegrasi dijelaskan
- [x] Bahasa Indonesia konsisten

---

*Dokumen ini siap digunakan sebagai naskah presentasi untuk Marketing Director dan Direksi.*
*Last updated: 2026-07-29*
