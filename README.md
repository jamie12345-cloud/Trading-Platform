# Trading Journal Web App

A web-based trading journal inspired by Tradervue.

This app lets traders import their trades via **CSV uploads**, track performance, review detailed reports, and keep a structured trading journal with dashboards, calendars, and analytics – all in one place.

> **Note:** In this first version, trades are imported **only via CSV uploads**. Broker API auto-connect and syncing are planned for later versions.

---

## Features

### Trade Import

- Import trades via **CSV files** exported from your broker.
- Support for multiple asset types (e.g. stocks, options, futures, forex, crypto – depending on your CSV).
- Basic validation and error feedback for malformed CSV rows. *(Planned in early versions.)*

### Dashboard

- Overview of your trading performance at a glance.
- Key metrics such as:
  - Total and average P&L
  - Win rate
  - Number of trades over selected periods
- Customizable widgets and panels. *(Planned: configurable dashboard layouts.)*

### Trades

- Central list of all imported trades.
- View trade details: symbol, side, size, entry/exit, P&L, fees, etc.
- Filter and search by:
  - Date range  
  - Symbol  
  - Side (long/short)  
  - Account / strategy / tags *(planned)*  
- Quick links into the journal and reports views for each trade.

### Journal

- Attach **notes** to individual trades.
- Daily journaling: record thoughts and observations for each trading day. *(Planned)*
- Keep a written record of:
  - Trade rationale
  - Emotions and psychology
  - Lessons learned and rule violations

### Reports & Analytics

- Performance reports to help you understand your edge and weaknesses.
- Example metrics (current + planned):
  - Daily / weekly / monthly P&L
  - Win rate, average R, profit factor
  - Volume and trade count over time
  - Distribution of results by strategy, symbol, time of day, etc. *(planned)*
- Drill-down from high-level reports into individual trades.

### Calendar View

- P&L calendar showing performance by day.
- Quickly see:
  - Green/red days
  - Flat days
  - Days with no trades
- Click through from a day to the corresponding trades and journal entries. *(Planned)*

### Search & Filtering

- Search across trades and notes. *(Planned)*
- Filter by:
  - Tags (strategy, setup, session, etc.) *(planned)*
  - Symbol
  - Date range
  - Side (long/short)

### Multi-Account (Planned)

- Support for multiple broker accounts within one journal.
- Filter and report by account.

---

## Tech Stack

### Current

- **Framework:** Next.js (App Router)
- **UI:** React (client components where needed)
- **Language:** JavaScript (TypeScript-ready)
- **Runtime & tooling:** Node.js, npm
- **Styling:** CSS (global or CSS modules for components)

### Planned / Roadmap Stack

These are planned pieces that will be added as the app matures:

- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** Auth.js / NextAuth for user authentication
- **Deployment:** Vercel (or similar) for hosting the Next.js app

---

## Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (comes with Node)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd <your-project-folder>

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open your browser and go to:

```text
http://localhost:3000
```

You should see the trading journal dashboard skeleton with sidebar navigation.

---

## CSV Import Format

To import trades, export a CSV from your broker and map it to the app’s expected format.

A simple example format:

| Column        | Description                               | Example            |
|---------------|-------------------------------------------|--------------------|
| `timestamp`   | Date/time the trade was executed          | `2025-01-02 14:35` |
| `symbol`      | Ticker or instrument name                 | `AAPL`             |
| `side`        | `long` or `short`                         | `long`             |
| `quantity`    | Number of shares/contracts                | `100`              |
| `entry_price` | Entry price for the trade                 | `182.50`           |
| `exit_price`  | Exit price for the trade                  | `185.10`           |
| `fees`        | Commissions/fees for the trade (optional) | `3.50`             |
| `account`     | Account identifier (optional)             | `IBKR-Main`        |
| `notes`       | Free text notes (optional)                | `Opening range breakout` |

> **Planned:** A mapping step to match different broker CSV formats into this internal format.

---

## Project Structure

A rough overview of the project layout:

```text
/app
  /dashboard        # Main dashboard view
  /trades           # Trades list and trade detail pages
  /journal          # Journal views (per trade / per day)
  /reports          # Analytics and reporting views
  /api              # (Planned) API routes for trades, imports, stats

/components
  Sidebar.tsx       # Main sidebar navigation
  Layout.tsx        # App layout
  TradeTable.tsx    # Trades table component
  StatCard.tsx      # Dashboard metric cards
  ...

/styles
  globals.css       # Global styles
  ...               # Component or page-specific styles

/lib
  trades.ts         # (Planned) Trade data helpers and DB access
  stats.ts          # (Planned) Performance/statistics helpers

/README.md
```

---

## Roadmap

Short-term:

- [ ] Implement in-memory trade storage for CSV uploads (dev phase).
- [ ] Build basic Trades page (table + filtering).
- [ ] Build initial Dashboard metrics based on imported trades.
- [ ] Per-trade journaling (notes attached to trades).

Medium-term:

- [ ] Add PostgreSQL + Prisma for persistent storage.
- [ ] Implement Reports (daily/monthly P&L, win rate, etc.).
- [ ] Add Calendar P&L view.
- [ ] Add tagging, search, and advanced filtering.

Long-term:

- [ ] User authentication and multi-user support.
- [ ] Broker API integrations for auto-import (Interactive Brokers, etc.).
- [ ] Strategy-level analytics and comparison reports.
- [ ] Sharing and social features (mentors, coaches, public trade sharing).

---

## License

TBD – choose a license (e.g. MIT) once you’re ready to make the project public.
