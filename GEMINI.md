# GEMINI.md

## Project Overview

This project is a Chrome/Edge extension designed to improve the user experience of Hansung University's reservation system for equipment and spaces. The extension is built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and the [WXT](https://wxt.dev/) framework for building browser extensions.

The extension provides a new, interactive campus map on the new tab page, allowing users to quickly navigate to the reservation pages for different buildings. It also enhances the UI/UX of the equipment (goods) and space reservation pages by replacing the existing interface with a more modern and user-friendly one built with React.

## Building and Running

The project uses `npm` for dependency management and running scripts.

### Development

To run the extension in development mode with hot reloading, use the following command:

```bash
npm run dev
```

This will create a `.output/chrome-mv3-dev` directory with the development build of the extension. You can load this directory as an unpacked extension in Chrome or Edge.

### Production Build

To create a production-ready build of the extension, run:

```bash
npm run build
```

This will generate a `.output/chrome-mv3` directory with the optimized production build.

### Packaging

To create a zip file of the production build for distribution, use:

```bash
npm run zip
```

This will create a zip file in the project's root directory.

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

### Data Flow

1.  A **content script** (e.g., `entrypoints/goods.content.ts`) is injected into the target page on the Hansung University website.
2.  The content script **scrapes** the necessary data from the page's DOM.
3.  The scraped data is then passed as props to a **React page component** (e.g., `src/pages/goods/GoodsListPage.tsx`).
4.  The React component renders a new user interface, replacing the original page content.
5.  **Services** (e.g., `src/services/goodsApi.ts`) are used to handle data fetching, parsing, and any other business logic.
