# R00k Documentation Platform

A modern documentation platform built with React, TypeScript, and Vite, featuring persistent storage, markdown editing, and dynamic navigation.

## Features

### Content Management
- Dynamic page rendering from database
- Markdown editing with live preview
- Automatic content persistence
- Toast notifications for save operations

### Navigation
- Drag-and-drop section and topic reordering
- Editable titles and descriptions
- Persistent navigation configuration
- Automatic breadcrumb generation

### User Interface
- Dark mode optimized
- Responsive layout
- Keyboard shortcuts
- Toast notifications
- Loading states and animations

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components
│   ├── sidebar-editor/  # Navigation editor components
│   ├── ui/             # Shared UI components
│   └── ...             # Other components
├── contexts/           # React contexts
├── pages/             # Page components
├── services/          # Service layer
└── types/            # TypeScript types
```

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Storage**: IndexedDB (Dexie.js)
- **Styling**: TailwindCSS
- **UI Components**: Radix UI
- **Drag and Drop**: react-beautiful-dnd

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Data Persistence

The application uses IndexedDB through Dexie.js for client-side storage:

### Database Schema

```typescript
interface PageContent {
  path: string
  content: string
  lastModified: Date
}

interface SidebarConfig {
  id: string
  items: SidebarItems
  lastModified: Date
}

interface SiteContent {
  id: string
  content: string
  lastModified: Date
}
```

## Key Components

### DynamicDocPage
- Renders documentation pages dynamically
- Loads content from database
- Syncs with navigation configuration
- Handles content updates

### Navigation Editor
- Drag-and-drop interface
- Section and topic management
- Description editing
- Automatic persistence

### Markdown Editor
- Live preview
- Keyboard shortcuts
- Toolbar for common actions
- Automatic saving

## Keyboard Shortcuts

- `⌘/Ctrl + K`: Open search
- `⌘/Ctrl + P`: Toggle preview
- `⌘/Ctrl + B`: Bold text
- `⌘/Ctrl + I`: Italic text
- `Alt + ←/→`: Navigate between pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Browser Support

- Chrome/Edge 76+
- Firefox 65+
- Safari 14.1+

Requires browsers with IndexedDB support for content persistence.

## License

MIT License - see LICENSE file for details
