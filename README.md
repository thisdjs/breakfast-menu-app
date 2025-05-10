# Breakfast Menu App 🍳🥞☕

A simple and interactive breakfast menu application built with React, TypeScript, Vite, and Tailwind CSS. Users can browse menu items, add them to an order, and create new menu items.

**Live Demo:** [https://thisdjs.github.io/breakfast-menu-app/](https://thisdjs.github.io/breakfast-menu-app/)

## Features

- Browse menu items categorized by type (e.g., Drinks, Pastries, Entrées).
- Responsive design for desktop, tablet, and mobile views.
  - Carousel view for item categories on desktop.
  - Grid view for item categories on mobile/tablet.
- Select and deselect items to add/remove them from an order.
- View a running total of the order.
- Create new menu items via a modal form, including:
  - Name (required, max 50 chars)
  - Price (required, positive number)
  - Category (select from existing or add new)
  - Icon (single emoji, required)
  - Icon Alt Text
- Data persistence using `localStorage` for:
  - User-created menu items.
  - Current order items.
  - Total price of the order.
- Form validation with inline error messages for creating new items.
- Responsive modal for creating items (full-screen on mobile).
- Smooth scrolling carousel with fade-out effects at the edges.

## Tech Stack

- **Framework/Library:** React 18+
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Heroicons
- **Deployment:** GitHub Pages

## Local Setup Instructions

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn (or pnpm)

### Installation & Setup

1.  **Clone the repository:**
    If you haven't already, clone your repository to your local machine.

    ```bash
    git clone [https://github.com/thisdjs/breakfast-menu-app.git](https://github.com/thisdjs/breakfast-menu-app.git)
    # Or using SSH:
    # git clone git@github.com:thisdjs/breakfast-menu-app.git
    cd breakfast-menu-app
    ```

2.  **Install NPM packages:**
    Navigate to the project directory and install the dependencies.

    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

3.  **Run the development server:**
    This command will start the Vite development server, usually on `http://localhost:5173` (the port might vary if 5173 is in use).
    ```bash
    npm run dev
    # or
    # yarn dev
    # or
    # pnpm dev
    ```
    The application will open in your default web browser, and you can start interacting with it. The page will automatically reload if you make changes to the source files.
