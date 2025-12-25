# Deployment Guide: Sharing Your Website

To make your website work on other laptops and phones, you need to "Deploy" it. Here is the easiest way using GitHub and Vercel.

## Step 1: Push to GitHub
1.  Create a new repository on [GitHub](https://github.com/new) named `artisan-launchpad`.
2.  Open your terminal in the project folder.
3.  Run these commands:
    ```powershell
    git add .
    git commit -m "Final polish and ready for deployment"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/artisan-launchpad.git
    git push -u origin main
    ```

## Step 2: Connect to Vercel
1.  Go to [Vercel](https://vercel.com) and sign in with GitHub.
2.  Click **"Add New"** -> **"Project"**.
3.  Import your `artisan-launchpad` repository.
4.  **CRITICAL**: Under **Environment Variables**, you must add the keys from your `.env.local` file:
    - `NEXT_PUBLIC_SUPABASE_URL`: (Copy the value from your `.env.local`)
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Copy the value from your `.env.local`)
5.  Click **"Deploy"**.

## Step 3: Get Your Public Link
Once finished, Vercel will give you a link like `artisan-launchpad.vercel.app`. 
**This link will work on ANY laptop, anywhere in the world!**

## Troubleshooting Build Errors
If Vercel shows a "Build Failed" error:
1.  Click on the "Deployment" and view the "Build Logs".
2.  Look for lines marked **Error** or **Warning**.
3.  Most common errors (like unescaped apostrophes) have been fixed, but if you see new ones, they will be listed clearly in the Vercel dashboard.

> [!TIP]
> After deploying, don't forget to update your QR code or share links if they were pointing to `localhost:3000`. Public deployments are much better for testing with real users!
