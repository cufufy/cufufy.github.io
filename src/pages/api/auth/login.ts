import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { users, sessions } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return redirect('/login?error=missing');
  }

  try {
      // 1. Real Database Authentication
      // Only attempt if DB_HOST is configured to avoid crashes in dev/demo without DB
      if (process.env.DB_HOST) {
          const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
          if (result.length > 0) {
              const user = result[0];
              // Verify password hash
              const match = await bcrypt.compare(password, user.passwordHash);
              if (match) {
                  // Generate random session ID
                  const sessionId = crypto.randomUUID();
                  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 1 week

                  // Store session in DB
                  await db.insert(sessions).values({
                      id: sessionId,
                      userId: user.id,
                      expiresAt: expiresAt
                  });

                  cookies.set('session', sessionId, {
                    path: '/',
                    httpOnly: true,
                    secure: import.meta.env.PROD,
                    expires: expiresAt
                  });
                  return redirect('/dashboard');
              }
          }
      }
  } catch (e) {
      console.error("DB Login Error", e);
  }

  // 2. Fallback for DEV environment ONLY (No DB connection)
  // This is strictly for demonstration purposes in local development.
  // It is disabled in Production to prevent unauthorized access if DB config is missing.
  if (import.meta.env.DEV && !process.env.DB_HOST && email === 'admin@example.com' && password === 'password') {
       console.warn("⚠️ Using Demo Admin Login (No Database Connection Detected) ⚠️");
       cookies.set('session', 'demo-token', {
          path: '/',
          httpOnly: true,
          secure: false,
          maxAge: 60 * 60 * 24 // 1 day
        });
        return redirect('/dashboard');
  }

  return redirect('/login?error=invalid');
};
