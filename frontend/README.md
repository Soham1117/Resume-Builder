# Resume Builder Frontend

A modern React-based frontend for the intelligent resume builder application.

## Features

### Resume Builder
- **Job Description Analysis**: AI-powered analysis of job descriptions to extract key skills and requirements
- **Drag & Drop Interface**: Intuitive content selection and arrangement
- **Content Library**: Browse and select from predefined experiences and projects
- **Real-time Preview**: Live resume preview with slide-out panel
- **Form Management**: Comprehensive forms for personal info, education, skills, and certifications
- **Resizable Panels**: Customize the layout by dragging panel borders to adjust widths

### Preview Panel
- **Slide-out Design**: Toggle preview panel on/off without leaving the builder
- **Keyboard Shortcut**: Press `Ctrl+P` (or `Cmd+P` on Mac) to toggle preview
- **Responsive Layout**: Adapts to different screen sizes
- **Expandable View**: Switch between compact and full-width preview modes
- **PDF Export**: Generate and download professional PDF resumes
- **Print Support**: Print-friendly resume output
- **Resizable**: Drag the border to adjust preview panel width

### Content Management
- **Semantic Matching**: AI-powered content selection based on job relevance
- **Round-robin Replacement**: Intelligent content rotation for optimal resume length
- **Duplicate Prevention**: Automatic detection and prevention of duplicate content
- **Real-time Updates**: Instant preview updates as content changes

### Layout & Navigation
- **Icon-only Sidebar**: Compact navigation with tooltips on hover
- **Collapsible Panels**: Overleaf-style panels with individual collapse/expand buttons
- **Manual Resizing**: Drag panel borders to adjust widths manually
- **Visual Feedback**: Width indicators and resize handles for better UX
- **Flexible Layout**: Customize workspace to your preferences

## Usage

### Panel Management
1. **Collapse Panels**: Click the X button in each panel header to hide it
2. **Expand Panels**: Use the floating buttons (bottom right) to show hidden panels
3. **Resize Panels**: Drag the borders between panels to adjust widths
4. **Manual Control**: All resizing is manual - no automatic adjustments

### Preview Panel
1. **Show/Hide**: Click the X button in preview header or use floating button
2. **Resize**: Drag the border to adjust preview width
3. **Export PDF**: Use the export button in the preview controls
4. **Print**: Use the print button for print-friendly output

### Content Selection
1. **Drag & Drop**: Drag items from the content library to suggested sections
2. **Auto-replacement**: When sections are full, new items replace existing ones in rotation
3. **Real-time Updates**: See changes immediately in the preview panel

### Layout Customization
1. **Manual Resizing**: Drag panel borders to adjust widths
2. **Visual Feedback**: Width indicators appear while resizing
3. **Panel Visibility**: Toggle panels on/off as needed
4. **Persistent Layout**: Panel sizes and visibility are maintained during the session

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npx tsc --noEmit
```

## Keyboard Shortcuts

- `Ctrl+P` / `Cmd+P`: Toggle preview panel
- `Ctrl+S` / `Cmd+S`: Save (if implemented)
- `Ctrl+Z` / `Cmd+Z`: Undo (if implemented)

## Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+): Full layout with sidebar, main content, and content library
- Tablet (768px-1199px): Adapted layout with collapsible panels
- Mobile (<768px): Stacked layout optimized for touch interaction

## Panel Configuration

### Collapsible Panels
- **Main Builder Panel**: 400px - 2000px width, always visible
- **Preview Panel**: 300px - 800px width, collapsible
- **Content Library**: 250px - 500px width, collapsible
- **Sidebar**: Fixed 64px width (icon-only)

### Panel Controls
- **Collapse**: X button in each panel header
- **Expand**: Floating buttons (bottom right) for hidden panels
- **Resize**: Drag borders between panels
- **Manual Control**: No automatic resizing

### Sidebar Navigation
- **Icon-only Design**: Compact 64px width
- **Tooltips**: Hover to see section names
- **Count Indicators**: Badge showing number of items in each section
- **Active States**: Visual feedback for current section
