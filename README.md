# 🧠 Mind Palette – Journaling Redefined (Frontend-Only)

**Mind Palette** is a minimalist, cognitive-friendly journaling platform that helps users reflect, track moods, and organize thoughts into meaningful collections. Built with **React**, this version works entirely on the frontend — no backend, no authentication, no server setup needed.

---

## 🌟 Features

### ✍️ Rich Journal Editor
- Clean, distraction-free writing interface.
- Built with `ReactQuill` for rich text formatting.
- Save journal entries locally in browser (e.g., `localStorage` or `IndexedDB`).
- Add **mood tags** and group entries into **collections**.

### 🎭 Mood Tracking & Analytics
- Interactive **MoodChart** to track emotional trends.
- Visualizes how your mood shifts over days or weeks.

### 📅 Streak Calendar
- Track journaling consistency through a visual calendar.
- Motivates regular journaling with streaks.

### 🗂️ Collections Page
- Group entries under custom categories (e.g., "Work", "Personal", "Dreams").
- Filter and browse based on **mood**, **collection**, or **date**.

### 🧭 Dashboard Overview
- Summary of recent entries, mood analytics, and journaling streaks.
- Quick insights into your mental and writing patterns.

---

## 🚀 Tech Stack

| Layer        | Technology                         |
|--------------|-------------------------------------|
| **Frontend** | React.js, Tailwind CSS, Framer Motion |
| **Text Editor** | ReactQuill                      |
| **Charts**   | Recharts                           |
| **Storage**  | localStorage / mock data (frontend only) |
| **Calendar** | Custom Streak Calendar Component   |

---

## 📁 Folder Structure

```

mind-palette/
├── public/                 # Static assets
├── src/
│   ├── components/         # UI Components (Editor, MoodChart, Calendar, etc.)
│   ├── pages/              # Pages (Home, Journal, Collections, Dashboard)
│   ├── utils/              # Helper functions (e.g., local storage handling)
│   ├── styles/             # Tailwind config and custom styles
│   └── App.jsx             # Main app entry
├── tailwind.config.js
├── package.json
└── README.md

````

---

## 🧪 How to Run Locally

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/MindPalette.git
   cd MindPalette
````

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173` (or the port shown in your terminal).

---

## 🧩 Future Scope

* Add backend for cloud sync and multi-device access.
* AI-powered mood prediction from journal text.
* Export entries as PDF or Markdown.
* Password-protected or encrypted journals.

---
