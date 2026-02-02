import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;

  // Protect dashboard routes
  if (url.pathname.startsWith('/dashboard')) {
    const session = cookies.get('session');

    // Basic session check - in production verify signature/db
    if (!session || !session.value) {
      return redirect('/login');
    }
  }

  return next();
});
