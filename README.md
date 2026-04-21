# AI Rebels - PET CARE

# Sunny Pandit
# Ritika 
# Priya Sidhu

A modern, responsive frontend UI for the AI Rebels hackathon project - an AI-based dog disease detection system.

![AI Rebels]    

## Features

- **Hero Section** - Eye-catching introduction with animated dog illustration
- **Problem Section** - 4 icon cards explaining key challenges
- **Solution Section** - Interactive upload box with drag-and-drop and AI scanning animation
- **Features Section** - Animated feature cards with risk badges
- **Innovation Section** - QR Code Health Passport with glowing effect
- **Impact Section** - Statistics and achievements
- **Future Scope** - Timeline roadmap of upcoming features
- **Footer** - Clean minimal footer with links

## Tech Stack

- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The development server will start at `http://localhost:5173`

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Card.jsx     # Animated card component
│   ├── Navbar.jsx   # Sticky navigation bar
│   ├── QRPreview.jsx # QR code preview card
│   ├── RiskBadge.jsx # Risk level indicator
│   └── UploadBox.jsx # Drag & drop upload component
├── sections/        # Page sections
│   ├── Hero.jsx
│   ├── Problem.jsx
│   ├── Solution.jsx
│   ├── Features.jsx
│   ├── Innovation.jsx
│   ├── Impact.jsx
│   ├── FutureScope.jsx
│   └── Footer.jsx
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Design System

### Colors (Pastel Palette)
- **Pastel Blue** - Primary accent (#E3F2FD, #90CAF9)
- **Pastel Green** - Success states (#E8F5E9, #A5D6A7)
- **Pastel Lavender** - Secondary accent (#F3E5F5, #CE93D8)
- **Cream** - Background (#FAFAF5)
- **Text** - Dark gray (#2D3748, #718096)

### Animations
- Fade-in on scroll (Framer Motion whileInView)
- Hover scale and shadow on cards
- Smooth transitions (300-500ms ease-in-out)
- Button lift effect on hover
- QR code glowing effect

### Typography
- **Display** - Poppins (headings)
- **Body** - Inter (paragraphs)

## Key Components

### UploadBox
Interactive drag-and-drop upload with:
- File validation
- Image preview
- AI scanning animation
- Progress indicator

### QRPreview
Digital health passport mockup with:
- Glowing border effect
- Dog profile card
- Health history preview
- Vaccination status
- Emergency contact

### RiskBadge
Color-coded risk indicators:
- Low (green)
- Medium (amber)
- High (red)

## Responsive Design

The UI is fully responsive:
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Mobile menu for navigation
- Stacked layouts on smaller screens

## Customization

Twalwind css is used for customization




**Team:** AI Rebels  
**Tagline:** "Giving a voice to the voiceless"
