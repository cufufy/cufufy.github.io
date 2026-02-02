import { defineMiddleware } from 'astro:middleware';
import { db } from './db';
import { sessions } from './db/schema';
import { eq, and, gt } from 'drizzle-orm';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;

  // Protect dashboard routes
  if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/api/profiles')) {
    const sessionCookie = cookies.get('session');

    if (!sessionCookie || !sessionCookie.value) {
      return redirect('/login');
    }

    const sessionId = sessionCookie.value;

    // Check if it's the demo token in DEV mode
    if (import.meta.env.DEV && sessionId === 'demo-token') {
        // Allow access
        return next();
    }

    // Verify session against DB
    if (process.env.DB_HOST) {
        try {
            const result = await db.select()
                .from(sessions)
                .where(and(
                    eq(sessions.id, sessionId),
                    gt(sessions.expiresAt, new Date())
                ))
                .limit(1);

            if (result.length === 0) {
                // Invalid or expired session
                cookies.delete('session', { path: '/' });
                return redirect('/login');
            }
        } catch (e) {
            console.error("Session verification error", e);
            // In production, fail closed
            if (import.meta.env.PROD) {
                 return redirect('/login');
            }
        }
    }
  }

  return next();
});
