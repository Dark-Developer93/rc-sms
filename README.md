# Student Management System

A comprehensive web application built with Next.js for managing a 6-month tech talent program. The system facilitates interaction between students, mentors, companies, and administrators.

## Features

### Multi-Role Dashboards

- **Admin Dashboard**

  - User management (CRUD operations)
  - Program oversight and analytics
  - Workshop scheduling and management
  - Performance evaluation tracking
  - Student progress monitoring

- **Mentor Dashboard**

  - Student group tracking
  - Project evaluations
  - Weekly progress assessments
  - Technical skills evaluation

- **Student Dashboard**

  - Course progress tracking
  - Project submissions
  - Interview scheduling
  - Company matching
  - Calendar management

- **Company Dashboard**
  - Profile management
  - Internship position management
  - Candidate matching
  - Interview scheduling

### Key Functionalities

- User management and role-based access control
- Real-time progress tracking and evaluations
- Interview scheduling and management
- Workshop and event organization
- Project submission and assessment
- Company-student matching system
- Performance analytics and reporting

## Tech Stack

- **Framework**: Next.js 14 app router based
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**:
  - Radix UI
  - Shadcn/ui
  - Recharts for data visualization
- **Fonts**: Geist Sans and Geist Mono
- **Theme**: Dark/Light mode support

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm package manager

### Installation

1. Clone the repository:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Structure

```bash
├── app/
│ ├── layout.tsx # Root layout with theme provider
│ ├── page.tsx # Landing page with role selection
│ └── globals.css # Global styles
├── components/
│ ├── dashboards/ # Role-specific dashboard components
│ ├── ui/ # Reusable UI components
│ └── nav/ # Navigation components
├── types/
│ └── dashboard.ts # TypeScript interfaces
├── lib/
│ └── utils.ts # Utility functions
└── public/ # Static assets
```

## Contributing

We welcome contributions to the Student Management System! Here's how you can help:

1. **Fork the Repository**

   - Create your own fork of the code
   - Clone it to your local machine

2. **Create a Branch**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Make Your Changes**

   - Write your code
   - Follow the existing code style
   - Add or update tests as needed
   - Update documentation as needed

4. **Test Your Changes**

   ```bash
   npm run test        # Run tests
   npm run lint        # Check code style
   ```

5. **Commit Your Changes**

   ```bash
   git commit -m "feat: Add some feature"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages

6. **Push to Your Fork**

   ```bash
   git push origin feature/YourFeatureName
   ```

7. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Describe your changes and submit

### Code Style Guidelines

- Use TypeScript for type safety
- Follow the existing project structure
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused
- Write unit tests for new features

## License

This project is licensed under the MIT License

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible UI components
- [Shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind CSS
- [Recharts](https://recharts.org/) - A composable charting library for React
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Vercel](https://vercel.com/) - Platform for deploying Next.js applications
