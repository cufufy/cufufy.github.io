import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { profiles, links } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const POST: APIRoute = async ({ request, params, cookies }) => {
  // Check auth
  if (!cookies.get('session')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = params;
  if (!id) return new Response('Missing ID', { status: 400 });

  let data;
  try {
    data = await request.json();
  } catch (e) {
    return new Response('Invalid JSON', { status: 400 });
  }

  try {
      if (process.env.DB_HOST) {
        // Update Profile
        await db.update(profiles).set({
            displayName: data.displayName,
            slug: data.slug,
            headline: data.headline,
            bio: data.bio,
            status: data.status,
            themeConfig: data.themeConfig,
            updatedAt: new Date()
        }).where(eq(profiles.id, Number(id)));

        // Update Links
        // For MVP: Delete all and re-insert to handle ordering and deletions simply
        await db.delete(links).where(eq(links.profileId, Number(id)));

        if (data.links && Array.isArray(data.links) && data.links.length > 0) {
            const linksToInsert = data.links.map((l: any, index: number) => ({
                profileId: Number(id),
                title: l.title || 'Untitled',
                url: l.url || '#',
                subtitle: l.subtitle,
                isVisible: l.isVisible !== false, // default true
                order: index
            }));

            await db.insert(links).values(linksToInsert);
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
      } else {
          // Demo mode mock success
           return new Response(JSON.stringify({ success: true, message: "Demo mode: Changes simulated (No DB connection)" }), { status: 200 });
      }
  } catch (e) {
      console.error(e);
      return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
  }
};
