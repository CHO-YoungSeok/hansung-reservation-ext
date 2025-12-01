# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This project is a Chrome/Edge extension designed to improve the user experience of Hansung University's reservation system for equipment and spaces. The extension is built with React, TypeScript, and the WXT framework for building browser extensions.

The extension enhances the UI/UX of the equipment (goods) and space reservation pages by replacing the existing interface with a more modern and user-friendly one built with React.

## WXT Framework

This extension uses [WXT](https://wxt.dev/), a modern framework for building browser extensions. Key WXT concepts:

- **Content Scripts**: Defined in `wxt.config.ts` with URL match patterns
- **Auto-imports**: WXT provides `defineContentScript()` without explicit imports
- **Hot Reload**: Development mode (`npm run dev`) supports hot module replacement
- **Multi-browser Support**: Single codebase builds for Chrome, Firefox, Edge via `-b` flag
- **Type Safety**: Automatic TypeScript types generation in `.wxt/types/`

The extension's manifest is automatically generated from `wxt.config.ts`. To add new content scripts or permissions, edit this file.

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

- `entrypoints/`: Contains the entry points for the extension
    - `*.content.ts` - Content scripts that inject into Hansung University pages
    - `content-script/fetch/` - DOM parsing and data extraction utilities
    - `hansungHomePage/` - Side panel React components for homepage
    - `newtab/` - New tab page implementation
    - `popup/` - Browser extension popup
- `src/`: Contains the core source code of the React application
    - `components/` - Reusable React components
        - `common/` - Shared UI components (Button, Card, etc.)
        - `goods/` - Equipment-specific components (GoodsItem, CategoryMenu, ReservationForm)
        - `space/` - Space reservation components
        - `layout/` - Layout components
    - `pages/` - Top-level page components that are rendered by the content scripts
        - `goods/` - GoodsListPage, GoodsDetailPage, MyReservation
        - `space/` - SpaceListPage, SpaceDetailPage, SpaceRouter
        - `home/` - HomePage
    - `services/` - Business logic, API interactions, and data dictionaries
        - `goodsApi.ts` - Equipment data types and API functions
        - `goodsDescription.ts` - Dictionary mapping equipment names to detailed descriptions
        - `goodsWarnings.ts` - Dictionary mapping equipment categories to safety warnings
        - `reservationApi.ts` - Reservation-related API functions
    - `utils/` - Utility functions
        - `authUtils.ts` - Login status detection and authentication helpers
        - `pageDataExtractor.ts` - Generic page data extraction utilities
        - `spaceFormAutoFill.ts` - Form auto-fill utilities
        - `calendarEvents.ts` - Calendar integration utilities
- `wxt.config.ts`: WXT framework configuration (manifest properties, permissions, content script matches)

## Architecture and Data Flow

### Content Script Architecture

The extension uses multiple content scripts that inject React applications into specific pages of the Hansung University website:

1. **goods.content.ts** - Injects the equipment reservation UI into `https://hansung.ac.kr/cncschool/7309/subview.do*`
   - **CRITICAL ORDER**: Extracts data BEFORE clearing DOM to preserve scraped information
   - Uses `parseGoodsFromHTML()` from `entrypoints/content-script/fetch/goodsList.ts`
   - Passes `initialGoods` prop to `GoodsListPage` component
   - Clears the DOM only AFTER data extraction is complete

2. **space.content.ts** - Injects the space reservation UI into the space reservation pages

3. **home.content.ts** - Injects a floating side panel on the Hansung homepage
   - Creates a floating toggle button (fixed position, right side)
   - Renders a slide-in side panel with reservation system shortcuts
   - Uses `getUserInfo()` from `authUtils.ts` to extract user information from DOM
   - Panel can be toggled with button click or ESC key
   - All styling is inline to avoid conflicts with host page CSS

4. **custom_reservation_page.content.ts** - Custom reservation page modifications

5. **portal.content.ts** - Portal page modifications

Each content script follows the same critical pattern:
1. Wait for the page to load (check `document.readyState`)
2. Find the target container (usually `#contents` or `.contents`)
3. **CRITICAL**: Extract data from DOM BEFORE clearing (for goods/space pages)
4. Clear the existing content AFTER extraction
5. Create a React root and render the corresponding page component

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
   - Handles rowspan for equipment names (equipment name can span multiple rows)
   - Each row can contain multiple "sets" of 4 cells: image, model name, count, location
   - Function: `parseGoodsFromHTML()` in `entrypoints/content-script/fetch/goodsList.ts`
   - Extracts: image URL, model name, count, location for each equipment

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
- `/my-list` - User's reservation history

The initial route is determined by parsing the current URL in `GoodsListPage.tsx:getInitialRoute()`.

### Dictionary-Based Content Enhancement

The extension uses dictionary files in `src/services/` to enhance the scraped data:

- **goodsWarnings.ts** - Maps equipment categories to safety warnings and usage guidelines
- **goodsDescription.ts** - Maps equipment names to detailed descriptions

These dictionaries are matched against the extracted equipment names/categories to provide additional context to users.

### Important Development Notes

1. **DOM Parsing Reliability**: The data extraction functions include extensive error handling and logging because the source HTML structure can vary. Always check console logs when debugging extraction issues.

2. **URL Matching**: The extension detects which parsing function to use based on the URL pathname. When adding support for new pages, update the URL detection logic in the content script's `main()` function.

3. **Image URL Handling**: Relative image URLs from the source pages are automatically converted to absolute URLs by prepending `https://hansung.ac.kr`.

4. **Data Extraction Timing**: Always extract data BEFORE clearing the DOM. The pattern is:
   ```typescript
   // STEP 1: Extract data BEFORE clearing DOM
   const { parseGoodsFromHTML } = await import('~/entrypoints/content-script/fetch/goodsList');
   const extractedGoods = parseGoodsFromHTML(document.documentElement.outerHTML);

   // STEP 2: NOW clear DOM (safe - we have the data)
   contentArea.innerHTML = '';

   // STEP 3: Render React with extracted data as props
   reactRoot.render(React.createElement(GoodsListPage, { initialGoods: extractedGoods }));
   ```

5. **Category Mapping**: The `lendGroupSeq` parameter maps to equipment categories:
   - '1' = VR/AR/기타
   - '2' = 3D 프린터
   - '3' = 노트북
   - '4' = 레이저 커팅기

6. **Authentication Detection**: The extension uses DOM-based authentication checking:
   - `authUtils.ts` provides `isUserLoggedIn()`, which calls `checkLoginStatus()` from `components/common/authChecker.ts`
   - Login/logout URLs and redirect functions are centralized in `authUtils.ts`
   - User info is extracted from the page DOM structure via `getUserInfo()` in `authUtils.ts`

7. **Inline Styling Philosophy**: All React components use inline styles to avoid CSS conflicts with the host page. This is especially important in content scripts where the host page's CSS could interfere with the extension's UI.

## Testing the Extension

### Loading in Browser

1. Build the extension: `npm run dev` (for development) or `npm run build` (for production)
2. Open Chrome/Edge and navigate to `chrome://extensions/` or `edge://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked" and select the `.output/chrome-mv3-dev` (or `.output/chrome-mv3` for production) directory
5. Navigate to `https://hansung.ac.kr/cncschool/7309/subview.do` to test the goods page
6. Navigate to `https://www.hansung.ac.kr/sites/hansung/index.do` to test the homepage side panel

### Debugging

- Open Chrome DevTools on the Hansung University pages to see console logs
- The data extraction functions include extensive `console.log` statements for debugging
- Check the "Errors" tab in `chrome://extensions/` for content script errors
- Use `console.log` statements liberally in the data extraction functions to trace parsing issues
- Look for messages like `[Goods Content] Extracted X items` to verify data extraction succeeded
