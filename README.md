# Medieval Fantasy City Generator

This is a React+TypeScript port of the [Medieval Fantasy City Generator](https://watabou.itch.io/medieval-fantasy-city-generator/). The project has been completely rewritten from Haxe/OpenFL to modern web technologies.

## Screenshots

**Small City (Default)**
![Small City](https://github.com/user-attachments/assets/8e35b62e-a47b-4ef7-aaa9-a08158f34d7a)

**Small Town**
![Small Town](https://github.com/user-attachments/assets/76f9f4ab-1214-4bd1-ab08-357997ed633e)

**Large City**
![Large City](https://github.com/user-attachments/assets/2b2dc569-b0a7-4c3b-95de-bd9f9df23cf0)

## Technologies

- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Canvas API** - For rendering the city maps

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the app
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
# Preview the production build
npm run preview
```

## Features

- **Multiple City Sizes**: Generate small towns to large cities
- **Procedural Generation**: Each city is uniquely generated with a seed
- **URL Parameters**: Share specific cities via URL (e.g., `?size=15&seed=123456`)
- **Regeneration**: Create new cities with the same size
- **Responsive Canvas**: Automatically scales to fit your screen

## URL Parameters

- `size` - Size of the city (6-40, default: 15)
- `seed` - Random seed for generation (default: random)

Example: `http://localhost:5173/?size=24&seed=682063530`

## Architecture

The project structure:
- `/src/components` - React components
- `/src/building` - City generation logic
- `/src/geom` - Geometry utilities (Point, Polygon, etc.)
- `/src/mapping` - Rendering and color palettes
- `/src/utils` - Utility functions (Random, Math)

## Original Haxe/OpenFL Version

The original Haxe/OpenFL source code is still available in the `Source/` directory. This React+TypeScript version is a simplified implementation focusing on the core city generation and rendering features.
