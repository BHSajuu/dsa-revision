<div align="center">
  <img src="public/logo.png" alt="DSA Revision Tracker Logo" width="150" height="150"/>
  <h1>DSA Revision Tracker</h1>
  <p>
    Master Data Structures & Algorithms with a smart, pattern-based learning platform featuring spaced repetition.
  </p>
  
</div>

<div align="center">
  <img src="https://i.imgur.com/your-app-demo.gif" alt="App Demo GIF" width="800"/>
</div>

---

## ✨ Features

-   **🗂️ Pattern-Based Organization**: Group DSA problems by common patterns (e.g., Sliding Window, Two Pointers) for structured learning.
-   **🧠 Spaced Repetition**: A smart scheduling system using intervals of 3, 7, 14, 30, 60, and 90 days to maximize long-term retention.
-   **📊 Progress Tracking**: A comprehensive dashboard with visual metrics to monitor your progress at a glance.
-   **📧 Review Reminders**: Automated email notifications to remind you of problems that are due for review.
-   **📝 Rich Notes**: Add detailed notes to your problems, including text and images, for better understanding and quicker recall.
-   **🎨 Sleek Dark Theme**: A beautiful and modern dark mode interface with smooth animations powered by Framer Motion.
-   **⚙️ Full CRUD Functionality**: Easily add, edit, and delete problems and patterns with full control over your data.

---

## 🛠️ Tech Stack

<div align="center">

| Category  | Technology                                                                                                                              |
| :-------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend  | ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) |
| Backend   | ![Convex](https://img.shields.io/badge/Convex-1A1A1A?style=for-the-badge&logo=convex&logoColor=white)                                     |
| Animation | ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)                     |
| Deployment| ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)                                     |

</div>

---

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

-   Node.js v18.0 or later
-   A free [Convex](https://www.convex.dev/) account

### Installation

1.  **Clone the Repository** 📥
    ```bash
    git clone https://github.com/bhsajuu/dsa-revision.git
    cd dsa-revision
    ```

2.  **Install Dependencies** 📦
    ```bash
    npm install
    ```

3.  **Set Up Convex** 🔗
    -   Install the Convex CLI globally:
        ```bash
        npm install -g convex
        ```
    -   Log in to your Convex account from the terminal:
        ```bash
        npx convex login
        ```
    -   Initialize Convex for this project. This will link the project, create a `.env.local` file, and deploy your backend functions.
        ```bash
        npx convex dev
        ```

4.  **Run the Development Server** ▶️
    -   In a **new terminal window** (keep the `convex dev` process running), start the Next.js app:
        ```bash
        npm run dev
        ```

Your application should now be running at `http://localhost:3000`.

---

## 👨‍💻 How to Use

1.  **Login**: Use your email to create an account or log in.
2.  **Add Patterns**: Start by creating patterns for different DSA topics.
3.  **Add Problems**: Add problems under each pattern, including links to platforms like LeetCode.
4.  **Add Notes**: Enhance your entries with text and image-based notes.
5.  **Mark as Solved**: Click the checkmark to mark a problem as solved, which automatically schedules your next review.
6.  **Track Progress**: Use the dashboard to see your stats and stay motivated.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
