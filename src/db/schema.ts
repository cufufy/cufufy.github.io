import { int, text, boolean, mysqlTable, timestamp, varchar, serial, json } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const profiles = mysqlTable('profiles', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  displayName: varchar('display_name', { length: 255 }),
  headline: text('headline'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  status: varchar('status', { length: 20 }).default('draft'), // draft, published
  // Theme config stores background, buttons, fonts settings
  themeConfig: json('theme_config'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').onUpdateNow(),
});

export const links = mysqlTable('links', {
  id: serial('id').primaryKey(),
  profileId: int('profile_id').notNull(), // Foreign key to profiles
  title: varchar('title', { length: 255 }).notNull(),
  url: text('url').notNull(),
  subtitle: varchar('subtitle', { length: 255 }),
  icon: varchar('icon', { length: 50 }),
  type: varchar('type', { length: 20 }).default('url'), // url, email, etc
  isVisible: boolean('is_visible').default(true),
  order: int('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  links: many(links),
}));

export const linksRelations = relations(links, ({ one }) => ({
  profile: one(profiles, {
    fields: [links.profileId],
    references: [profiles.id],
  }),
}));
