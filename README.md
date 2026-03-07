# Captain's Chair Database Explorer

A modern, high-performance database explorer for the **Star Trek: Captain's Chair** board game by WizKids. This application allows players and fans to browse, search, and filter cards with a sleek, responsive interface.

## 🚀 Features

- **Dynamic Card Filtering**: Filter by Set (e.g., Core Set), Category (Person, Ship, Location, etc.), Species (Star Trek races), Regular Traits, and Other Traits (Attack, Surprise, Ongoing).
- **Full-Text Search**: Instantly find cards by name or traits using the integrated fuzzy search.
- **Layout Changer**: Toggle between a compact **List View** (1 per row) and a detailed **Grid View** (3 per row).
- **Progressive Web App (PWA)**: Installable on mobile devices with **Offline Support**, providing a native app-like experience.
- **Dark Mode**: Persistent theme support with a toggle to switch between light and dark modes.
- **Responsive Design**: Optimized for everything from mobile phones to large desktop monitors, featuring sticky headers and safe-area support.
- **Star Trek Themed UI**: Custom-styled badges using **Bebas Neue** typography and brand-consistent color schemes.

## 🛠️ Tech Stack

- **[Astro](https://astro.build/)**: Static site generator for extreme performance.
- **[React](https://react.dev/)**: Powering the interactive filtering and UI components.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: For modern, utility-first styling.
- **[Headless UI](https://headlessui.com/)**: Accessible, unstyled components (Combobox, Switch, Dialog).
- **[Lucide Icons](https://lucide.dev/)**: Beautifully simple, consistent iconography.
- **[Framer Motion](https://www.framer.com/motion/)**: For smooth animations and transitions.

## 💻 Development

### Prerequisites

- **Node.js**: Ensure you have Node.js installed.
- **npm**: Package manager (comes with Node.js).

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/captainschair.git
   cd captainschair
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:4321/captainschair/`.

## 🚢 Deployment

This project is configured for **GitHub Pages** using GitHub Actions.

1.  **Configure GitHub**: Ensure your repository is named `captainschair` (or update `base` in `astro.config.mjs`).
2.  **Enable GitHub Actions**:
    - Go to **Settings > Pages** in your GitHub repository.
    - Set the **Source** to **GitHub Actions**.
3.  **Push to Main**: Any push to the `main` branch will automatically trigger a build and deployment.

## ⚖️ Legal Disclaimer

This is a fan-made database and is **not** an official product.

- I do not own any rights to **Star Trek** or the **Star Trek: Captain's Chair** board game.
- Star Trek and all related marks, logos, and characters are trademarks of **CBS Studios Inc.** and/or **ViacomCBS**.
- The *Star Trek: Captain's Chair* board game is a product of **WizKids**.
- This tool is provided for educational and entertainment purposes only.

---

*Engage!* 🖖
