# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This project is a Chrome/Edge extension designed to improve the user experience of Hansung University's reservation system for equipment and spaces. The extension is built with React, TypeScript, and the WXT framework for building browser extensions.

The extension provides a new, interactive campus map on the new tab page, allowing users to quickly navigate to the reservation pages for different buildings. It also enhances the UI/UX of the equipment (goods) and space reservation pages by replacing the existing interface with a more modern and user-friendly one built with React.

## Building and Running

The project uses `npm` for dependency management and running scripts.

### Development

To run the extension in development mode with hot reloading:

```bash
npm run dev
```

This will create a `.output/chrome-mv3-dev` directory with the development build of the extension. You can load this directory as an unpacked extension in Chrome or Edge.

For Firefox development:

```bash
npm run dev:firefox
```

### Production Build

To create a production-ready build of the extension:

```bash
npm run build
```

This will generate a `.output/chrome-mv3` directory with the optimized production build.

For Firefox:

```bash
npm run build:firefox
```

### Packaging

To create a zip file of the production build for distribution:

```bash
npm run zip           # For Chrome
npm run zip:firefox   # For Firefox
```

### Type Checking

To run TypeScript type checking without emitting files:

```bash
npm run compile
```

## Development Conventions

### Code Style

- The project uses **TypeScript** for type safety.
- **React** components are written as functional components with hooks.
- **Styling** is primarily done using **inline styles** within the React components. This is a deliberate choice to encapsulate component styles and avoid conflicts with the host page's CSS.
- **File Naming:**
    - Components: `PascalCase.tsx` (e.g., `GoodsItem.tsx`)
    - Pages: `PascalCasePage.tsx` (e.g., `GoodsListPage.tsx`)
    - Services/APIs: `camelCase.ts` (e.g., `goodsApi.ts`)

### Project Structure

The project follows a structure that separates concerns into different directories:

- `entrypoints/`: Contains the entry points for the extension, such as content scripts (`.content.ts`), background scripts (`background.ts`), the new tab page, and the popup.
- `src/`: Contains the core source code of the React application.
    - `components/`: Reusable React components.
    - `pages/`: Top-level page components that are rendered by the content scripts.
    - `services/`: Business logic, API interactions, and data fetching.
- `wxt.config.ts`: The main configuration file for the WXT framework, where manifest properties, permissions, and other settings are defined.

## Architecture and Data Flow

### Content Script Architecture

The extension uses multiple content scripts that inject React applications into specific pages of the Hansung University website:

1. **goods.content.ts** - Injects the equipment reservation UI into `https://hansung.ac.kr/cncschool/7309/subview.do*`
2. **space.content.ts** - Injects the space reservation UI into the space reservation pages
3. **home.content.ts** - Injects UI improvements into the homepage

Each content script follows the same pattern:
1. Wait for the page to load
2. Find the target container (usually `#contents` or `.contents`)
3. Clear the existing content
4. Create a React root and render the corresponding page component

### Data Extraction and Rendering Flow

The extension scrapes data from the original Hansung University pages and re-renders it with an improved UI:

```
Hansung University Web Page (Original DOM)
    ↓
Content Script Injection (e.g., goods.content.ts)
    ↓
Data Extraction from DOM (entrypoints/content-script/fetch/*.ts)
    ├─ parseGoodsFromHTML() - Parses table structure
    └─ parseGoodsFromLendList() - Parses card/list structure
    ↓
Data Enhancement
    ├─ Match with descriptions (goodsDescription.ts)
    └─ Match with warnings (goodsWarnings.ts)
    ↓
React Page Component Rendering (src/pages/*)
    ↓
Improved UI Display
```

### Key Data Extraction Patterns

The extension handles two different HTML structures from the Hansung website:

1. **Table Structure** (`subview.do`, `lendSummary.do`):
   - Parses `<table>` elements with `data-namo-table-template` attribute
   - Handles rowspan for equipment names
   - Extracts: image, model name, count, location
   - Function: `parseGoodsFromHTML()` in `entrypoints/content-script/fetch/goodsList.ts`

2. **Card/List Structure** (`lendMhrmlList.do`):
   - Parses `.wrap-form.wrap_list` containers
   - Extracts onclick attributes for category and ID information
   - Parses availability status from text
   - Function: `parseGoodsFromLendList()` in `entrypoints/content-script/fetch/goodsList.ts`

### Router Architecture

The extension uses `react-router-dom` with `MemoryRouter` for client-side navigation within the injected React app:

- `/` - Main goods overview page (shows all equipment)
- `/category/:lendGroupSeq` - Category-specific equipment list
- `/detail/:lendGroupSeq/:lendMhrmlSeq` - Equipment detail page with reservation form
- `/my-list` - User's reservation history (placeholder)

The initial route is determined by parsing the current URL in `GoodsListPage.tsx:getInitialRoute()`.

### Dictionary-Based Content Enhancement

The extension uses dictionary files in `src/services/` to enhance the scraped data:

- **goodsWarnings.ts** - Maps equipment categories to safety warnings and usage guidelines
- **goodsDescription.ts** - Maps equipment names to detailed descriptions

These dictionaries are matched against the extracted equipment names/categories to provide additional context to users.

### Important Development Notes

1. **DOM Parsing Reliability**: The data extraction functions include extensive error handling and logging because the source HTML structure can vary. Always check console logs when debugging extraction issues.

2. **URL Matching**: The extension detects which parsing function to use based on the URL pathname. When adding support for new pages, update the URL detection logic in `fetchGoodsFromCurrentPage()`.

3. **Image URL Handling**: Relative image URLs from the source pages are automatically converted to absolute URLs by prepending `https://hansung.ac.kr`.

4. **Async vs Sync Extraction**: The codebase includes both async (`fetchGoodsFromCurrentPage()`) and sync (`fetchGoodsFromCurrentPageSync()`) versions of data extraction. The async version uses `fetch()` to retrieve clean HTML, while the sync version parses the already-modified DOM.

5. **Category Mapping**: The `lendGroupSeq` parameter maps to equipment categories:
   - '1' = VR/AR/기타
   - '2' = 3D 프린터
   - '3' = 노트북
   - '4' = 레이저 커팅기