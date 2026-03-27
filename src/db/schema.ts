import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

export const municipalities = sqliteTable('municipalities', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  ineCode: text('ine_code').notNull(),
})

export const seas = sqliteTable('seas', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  jellyfishRisk: text('jellyfish_risk').notNull(),
})

export const services = sqliteTable('services', {
  id: integer('id').primaryKey(),
  serviceId: text('service_id').notNull().unique(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
})

export const activities = sqliteTable('activities', {
  id: integer('id').primaryKey(),
  activityId: text('activity_id').notNull().unique(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
})

export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey(),
  tagId: text('tag_id').notNull().unique(),
  name: text('name').notNull(),
})

export const beaches = sqliteTable(
  'beaches',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    code: text('code').notNull().unique(),
    name: text('name').notNull(),
    municipalityId: integer('municipality_id')
      .notNull()
      .references(() => municipalities.id),
    seaId: integer('sea_id')
      .notNull()
      .references(() => seas.id),
    latitude: real('latitude').notNull(),
    longitude: real('longitude').notNull(),
    soilType: text('soil_type').notNull(),
    nudist: integer('nudist', { mode: 'boolean' }).notNull(),
    promenade: integer('promenade', { mode: 'boolean' }).notNull(),
    anchorageZone: integer('anchorage_zone', { mode: 'boolean' }).notNull(),
    dogFriendly: integer('dog_friendly', { mode: 'boolean' }).notNull(),
    lifeguard: integer('lifeguard', { mode: 'boolean' }).notNull(),
    description: text('description').notNull(),
    access: text('access').notNull(),
    nearby: text('nearby').notNull(),
    orientation: text('orientation').notNull(),
    instagramHashtag: text('instagram_hashtag').notNull(),
    occupancyLevel: text('occupancy_level'),
    campingNearby: integer('camping_nearby', { mode: 'boolean' }),
    metaDescription: text('meta_description'),
    seoKeywords: text('seo_keywords'),
    certifications: text('certifications'),
    bestSeason: text('best_season'),
    district: text('district'),
    phone: text('phone'),
    email: text('email'),
    realUrl: text('real_url'),
    waves: text('waves'),
    pictures: text('pictures'),
    aemetId: text('aemet_id'),
    length: integer('length'),
    accessDifficulty: text('access_difficulty'),
    childSafe: integer('child_safe', { mode: 'boolean' }),
    naturalShade: integer('natural_shade', { mode: 'boolean' }),
    waterQuality: text('water_quality'),
  },
  (table) => [
    index('beach_code_idx').on(table.code),
    index('beach_name_idx').on(table.name),
    index('beach_municipality_idx').on(table.municipalityId),
  ],
)

export const beachServices = sqliteTable(
  'beach_services',
  {
    beachId: integer('beach_id')
      .notNull()
      .references(() => beaches.id, { onDelete: 'cascade' }),
    serviceId: integer('service_id')
      .notNull()
      .references(() => services.id),
  },
  (table) => [index('beach_services_idx').on(table.beachId, table.serviceId)],
)

export const beachActivities = sqliteTable(
  'beach_activities',
  {
    beachId: integer('beach_id')
      .notNull()
      .references(() => beaches.id, { onDelete: 'cascade' }),
    activityId: integer('activity_id')
      .notNull()
      .references(() => activities.id),
  },
  (table) => [
    index('beach_activities_idx').on(table.beachId, table.activityId),
  ],
)

export const beachTags = sqliteTable(
  'beach_tags',
  {
    beachId: integer('beach_id')
      .notNull()
      .references(() => beaches.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id),
  },
  (table) => [index('beach_tags_idx').on(table.beachId, table.tagId)],
)

export const municipalitiesRelations = relations(
  municipalities,
  ({ many }) => ({
    beaches: many(beaches),
  }),
)

export const seasRelations = relations(seas, ({ many }) => ({
  beaches: many(beaches),
}))

export const servicesRelations = relations(services, ({ many }) => ({
  beachServices: many(beachServices),
}))

export const activitiesRelations = relations(activities, ({ many }) => ({
  beachActivities: many(beachActivities),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  beachTags: many(beachTags),
}))

export const beachesRelations = relations(beaches, ({ one, many }) => ({
  municipality: one(municipalities, {
    fields: [beaches.municipalityId],
    references: [municipalities.id],
  }),
  sea: one(seas, {
    fields: [beaches.seaId],
    references: [seas.id],
  }),
  services: many(beachServices),
  activities: many(beachActivities),
  tags: many(beachTags),
}))

export const beachServicesRelations = relations(beachServices, ({ one }) => ({
  beach: one(beaches, {
    fields: [beachServices.beachId],
    references: [beaches.id],
  }),
  service: one(services, {
    fields: [beachServices.serviceId],
    references: [services.id],
  }),
}))

export const beachActivitiesRelations = relations(
  beachActivities,
  ({ one }) => ({
    beach: one(beaches, {
      fields: [beachActivities.beachId],
      references: [beaches.id],
    }),
    activity: one(activities, {
      fields: [beachActivities.activityId],
      references: [activities.id],
    }),
  }),
)

export const beachTagsRelations = relations(beachTags, ({ one }) => ({
  beach: one(beaches, {
    fields: [beachTags.beachId],
    references: [beaches.id],
  }),
  tag: one(tags, {
    fields: [beachTags.tagId],
    references: [tags.id],
  }),
}))
