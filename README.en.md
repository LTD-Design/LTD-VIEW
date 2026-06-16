# LtdView

[中文](README.md)

A visual BI dashboard builder with drag-and-drop layout, chart configuration, and data binding. Build both large-screen displays and analytical dashboards.

## Features

- **Drag-and-Drop Layout** — Drag components from the library onto the canvas, freely move and resize
- **Chart Components** — Bar, line, pie, gauge, radar charts and more
- **Table Components** — Data tables (sort/filter/paginate), ranking lists
- **Form Components** — Input, select, date picker, cascader
- **Drill-Down** — Click-to-drill on charts and tables, breadcrumb navigation to go back
- **Data Layer** — Static JSON + API data sources with field mapping and polling refresh
- **Form Linkage** — Field visibility, option cascading, value-change triggers component refresh
- **Preview & Export** — Full-screen preview, export JSON config / standalone HTML files
- **Draft Auto-Save** — Editor state persists to localStorage, never lose your work

## Tech Stack

| Category | Choice | Version |
|----------|--------|---------|
| Framework | Vue 3 | ^3.4 |
| Build | Vite | ^5.4 |
| State Management | Pinia | ^2.1 |
| Charts | ECharts (tree-shaken) | ^5.5 |
| UI Library | Naive UI | ^2.38 |
| Styling | SCSS | ^1.77 |
| Testing | Vitest | ^4.1 |
| Docs | VitePress | ^1.3 |

## Quick Start

### Prerequisites

- Node.js 18.0+ (20.x recommended)
- npm 9.0+ (or yarn / pnpm)

### Install & Run

```bash
git clone https://gitee.com/ltd_1/ltd-view.git
cd ltd-view
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Usage

1. **Drag components** — Select from the left component library, drag onto the canvas
2. **Adjust layout** — Drag to move, drag corners to resize
3. **Configure properties** — Right panel: style, data source, interaction events
4. **Preview** — Click "Preview" in the top toolbar for full-screen mode
5. **Export** — Export as JSON config file or standalone HTML

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run analyze      # Bundle analysis
npm run lint         # Lint code
npm run format       # Format code
npm run docs:dev     # Start docs site
npm run docs:build   # Build docs
```

## Project Structure

```
ltd-view/
├── src/
│   ├── components/       # Vue components
│   │   ├── layout/       # Layout (editor three-column)
│   │   ├── charts/       # Chart components
│   │   ├── tables/       # Table components
│   │   ├── forms/        # Form components
│   │   └── base/         # Base components
│   ├── composables/      # Vue composables
│   ├── stores/           # Pinia state management
│   ├── config/           # Component registry, theme config
│   ├── utils/            # Utility functions
│   ├── __tests__/        # Unit tests
│   └── views/            # Pages (Editor / Preview)
├── docs/                 # VitePress documentation site
└── package.json
```

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Latest |
| Firefox | Latest |
| Safari | Latest |
| Edge | Latest |

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT License](LICENSE)
