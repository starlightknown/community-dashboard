This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Deployment (Vercel)

This project is configured to use **Vercel Postgres** for production.

1. **Push your code** to a GitHub repository.
2. **Import your project** into Vercel.
3. **Storage Setup**: In the Vercel Dashboard, go to the **Storage** tab and create a new **Postgres** database. Connect it to your project.
4. **Environment Variables**: Vercel will automatically add `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`. You must manually add these from your `.env.local`:
   - `DISCORD_CLIENT_ID`
   - `DISCORD_CLIENT_SECRET`
   - `DISCORD_BOT_TOKEN`
   - `DISCORD_GUILD_ID`
   - `NEXTAUTH_SECRET` (Generate a random string)
   - `NEXTAUTH_URL` (Set to your production domain, e.g., `https://your-app.vercel.app`)
5. **Build & Deploy**: Vercel will run `prisma generate` during the build. You may need to run `npx prisma db push` once locally or via a Vercel script to initialize the schema in your new Postgres instance.

## Local Development

The project is currently set to use **PostgreSQL** in `schema.prisma` for production compatibility.

### Option 1: Using Local SQLite (Recommended for dev)
If you don't have a local Postgres instance, you can temporarily switch back to SQLite:

1. In `prisma/schema.prisma`, change the `db` block to:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```
2. Update your `.env.local`:
   ```env
   DATABASE_URL="file:./dev.db"
   ```
3. Run `npx prisma generate`.

### Option 2: Using the Development Server
First, run the development server:

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
