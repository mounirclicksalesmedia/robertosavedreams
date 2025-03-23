# Roberto Save Dreams Foundation Website

This is the official website for the Roberto Save Dreams Foundation, a non-profit organization dedicated to empowering individuals and communities across Africa through education, microfinance, and sustainable development.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payment Processing**: Lenco Payment API
- **Email**: SendGrid

## Project Structure

```
roberto-save-dreams/
│
├── app/                    # Next.js App Router structure
│   ├── (public)/           # Public-facing routes
│   │   ├── page.tsx        # Homepage
│   │   ├── about/          # About Us section
│   │   ├── programs/       # Programs & Initiatives
│   │   ├── get-involved/   # Get Involved
│   │   ├── apply/          # Application forms
│   │   ├── success-stories/# Success Stories
│   │   ├── donate/         # Donation portal
│   │   ├── blog/           # Blog
│   │   └── contact/        # Contact information
│   │
│   ├── (auth)/             # Authentication routes
│   │   ├── signin/         # Login page
│   │   ├── signup/         # Registration page
│   │   └── forgot-password/# Password recovery
│   │
│   ├── dashboard/          # User dashboard (protected)
│   │   ├── overview/       # User overview
│   │   ├── applications/   # User applications
│   │   ├── donations/      # User donations
│   │   └── profile/        # User profile
│   │
│   ├── admin/              # Admin dashboard (protected)
│   │   ├── overview/       # Stats and analytics
│   │   ├── applications/   # Manage applications
│   │   ├── donations/      # Track donations
│   │   ├── content/        # Content management
│   │   ├── users/          # User management
│   │   └── settings/       # System settings
│   │
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── applications/   # Application management
│   │   ├── donations/      # Donation processing
│   │   ├── content/        # Content management
│   │   └── webhooks/       # External service webhooks
│   │
│   └── layout.tsx          # Root layout
│
├── components/             # Reusable components
│   ├── ui/                 # UI primitives
│   ├── layout/             # Layout components
│   ├── forms/              # Form components
│   ├── dashboard/          # Dashboard components
│   └── animations/         # Framer Motion animations
│
├── lib/                    # Utility functions and shared code
│   ├── prisma/             # Prisma client and schema
│   ├── auth/               # Authentication utilities
│   ├── api/                # API utilities
│   └── utils/              # Misc utilities
│
├── public/                 # Static assets
│   ├── images/             # Image files
│   │   ├── hero/           # Hero section images
│   │   ├── programs/       # Program-related images
│   │   ├── success-stories/# Success stories images
│   │   └── team/           # Team member photos
│   │
│   ├── data/               # Static JSON data
│   │   ├── programs.json   # Programs information
│   │   ├── team.json       # Team members data
│   │   ├── success-stories.json # Success stories
│   │   └── ...             # Other static content
│   │
│   └── fonts/              # Font files
│
└── styles/                 # Global styles
    └── globals.css         # Global Tailwind imports
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/roberto-save-dreams.git
   cd roberto-save-dreams
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local` and fill in the required values

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Static Content Management

The website uses JSON files in the `public/data` directory to manage static content. This approach allows for easy content updates without requiring code changes. Key content files include:

- `programs.json` - Information about foundation programs
- `team.json` - Team member profiles
- `success-stories.json` - Success stories and testimonials
- `homepage.json` - Homepage content sections
- `about.json` - About page content
- `faq.json` - Frequently asked questions
- `contact.json` - Contact information
- `application-form.json` - Application form structure
- `donation.json` - Donation page content
- `blog-posts.json` - Blog content
- `navigation.json` - Site navigation structure
- `site-settings.json` - Global site settings

## Database Schema

The database is used for:
- User authentication
- Blog content management
- Loan application system
- Grant application system
- Funding application system
- Donation tracking

See the Prisma schema in `app/lib/prisma/schema.prisma` for the complete data model.

## Deployment

The application is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set up the required environment variables
3. Deploy the application

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For questions or support, please contact the development team at dev@robertosavedreams.org.
