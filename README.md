# URL Shortener - Frontend

Welcome to the **URL Shortener Frontend**, a sleek, fast, and modern web application built with **Next.js 14**. This project provides a user-friendly interface for shortening long URLs and managing them efficiently.

## 🚀 Features

- **Quick Shortening**: Instantly turn any long URL into a manageable short link.
- **Analytics Dashboard**: (Planned/Integrated) View click stats and performance for your links.
- **Modern UI**: Built with Shadcn/UI for a premium, accessible experience.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- **reCAPTCHA Integration**: Security against bots and spam.
- **Docker Support**: Containerized for easy deployment.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Containerization**: Docker

## 🏁 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Local Development

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd short-url/frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env.local` file in the root directory and add:
    ```env
    URL_BACKEND=http://your-backend-api/api/v1
    NEXT_PUBLIC_URL_BASE=http://localhost:3000
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
    RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production Build

```bash
npm run build
npm start
```

## 🐳 Docker Deployment

You can run the application using Docker:

```bash
# Build the image
docker build -t short-url-frontend .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_URL_BASE=http://localhost:3000 \
  -e NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key \
  short-url-frontend
```

Alternatively, use `docker-compose`:
```bash
docker-compose up -d
```

## ⚙️ Environment Variables

| Variable | Description |
| :--- | :--- |
| `URL_BACKEND` | The base URL of the backend API. |
| `NEXT_PUBLIC_URL_BASE` | The base URL of the frontend application. |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Public key for Google reCAPTCHA v3. |
| `RECAPTCHA_SECRET_KEY` | Secret key for Google reCAPTCHA v3 validation. |

## 📂 Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions and clients.
- `src/types`: TypeScript definitions.
- `public`: Static assets (images, icons).

---

Developed with ❤️ for a faster web.
