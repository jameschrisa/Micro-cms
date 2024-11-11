# R00kDoc Site

A modern documentation site built with React, TypeScript, and Vite, featuring persistent storage, markdown editing, and dynamic navigation.

## Technical Architecture

### Core Technologies
- **React 18** with TypeScript for UI components
- **Vite** for build tooling and development server
- **Dexie.js** for IndexedDB persistence
- **React Router** for client-side routing
- **TailwindCSS** for styling
- **Radix UI** for accessible component primitives

### Data Persistence
The application uses IndexedDB through Dexie.js for client-side storage:

```typescript
// Database Schema
pageContents: 'path' // Stores markdown content by URL path
sidebarConfig: 'id'  // Stores navigation structure
```

Key features of the persistence layer:
- Automatic content saving with 1-second debounce
- Path-based content storage
- Sidebar configuration persistence
- Automatic schema versioning

### Component Architecture

#### Core Components
- `MarkdownEditor`: Rich markdown editor with preview
- `SidebarProvider`: Navigation state management with persistence
- `DocumentDatabase`: IndexedDB wrapper for data storage

#### State Management
- React Context for global state
- Dexie.js for persistent storage
- Component-local state for UI interactions

## Development Setup

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

## Key Features

### Markdown Editor
- Real-time preview
- Keyboard shortcuts
- Automatic content saving
- Toolbar for common formatting
- Support for GitHub Flavored Markdown

### Navigation
- Drag-and-drop section reordering
- Nested navigation structure
- Persistent configuration
- Breadcrumb navigation

### Data Persistence
The application uses IndexedDB for client-side storage:

```typescript
interface PageContent {
  path: string;
  content: string;
  lastModified: Date;
}

interface SidebarConfig {
  id: string;
  items: SidebarItems;
  lastModified: Date;
}
```

Data is automatically persisted:
- Content changes are saved after 1 second of inactivity
- Sidebar configuration is saved immediately on changes
- All data persists across browser sessions

### Keyboard Shortcuts
- `⌘/Ctrl + P`: Toggle preview
- `⌘/Ctrl + B`: Bold
- `⌘/Ctrl + I`: Italic
- `⌘/Ctrl + K`: Insert link
- `⌘/Ctrl + 1/2/3`: Heading levels

## Component API Reference

### MarkdownEditor
```typescript
interface MarkdownEditorProps {
  content: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
}
```

### SidebarProvider
```typescript
interface SidebarProviderProps {
  initialItems: SidebarItems;
  children: React.ReactNode;
}
```

### Database Service
```typescript
class DocumentDatabase {
  async savePageContent(path: string, content: string): Promise<void>;
  async getPageContent(path: string): Promise<string | null>;
  async saveSidebarConfig(items: SidebarItems): Promise<void>;
  async getSidebarConfig(): Promise<SidebarItems | null>;
}
```

## Browser Support
The application requires browsers with IndexedDB support:
- Chrome/Edge 76+
- Firefox 65+
- Safari 14.1+

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
MIT License - see LICENSE file for details
