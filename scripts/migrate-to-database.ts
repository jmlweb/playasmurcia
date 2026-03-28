import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { sql } from 'drizzle-orm'
import * as schema from '../src/db/schema'

type JsonBeach = {
  code: string
  name: string
  municipality: number
  soilType: string
  anchorageZone: boolean
  nudist: boolean
  sea: number
  promenade: boolean
  access: string
  coordinates: [number, number]
  nearby: Array<string>
  description: string
  orientation: string
  instagramHashtag: string
  dogFriendly: boolean
  lifeguard: boolean
  services: Array<number>
  length?: number
  tags: Array<number>
  activities: Array<number>
  bestSeason?: Array<string>
  certifications?: Array<string>
  occupancyLevel?: string
  campingNearby?: boolean
  metaDescription?: string
  seoKeywords?: Array<string>
  district?: string
  phone?: string
  email?: string
  realUrl?: string
  waves?: string
  pictures?: Array<string>
  pictureQualityScore?: 0 | 1 | 2 | 3
  aemetId?: string
  accessDifficulty?: string
  childSafe?: boolean
  naturalShade?: boolean
  waterQuality?: string
}

type JsonMunicipality = {
  name: string
  id: string
}

type JsonSea = {
  name: string
  jellyfishRisk: string
}

type JsonService = {
  id: string
  name: string
  icon: string
}

type JsonActivity = {
  id: string
  name: string
  icon: string
}

type JsonTag = {
  id: string
  name: string
}

function loadJsonFile<T>(filename: string): T {
  const filePath = join(process.cwd(), 'data', filename)
  const content = readFileSync(filePath, 'utf-8')
  return JSON.parse(content) as T
}

function serializeArray(arr: Array<unknown> | undefined): string | undefined {
  if (!arr || arr.length === 0) return undefined
  return JSON.stringify(arr)
}

async function main() {
  console.log('Starting migration...')

  // Initialize database client
  const isProduction = process.env.NODE_ENV === 'production'
  const client = createClient({
    url: isProduction
      ? process.env.TURSO_DATABASE_URL!
      : process.env.DATABASE_URL || 'file:./local.db',
    authToken: isProduction ? process.env.TURSO_AUTH_TOKEN : undefined,
  })
  const db = drizzle(client, { schema })

  try {
    // Load all JSON files
    console.log('\n📂 Loading JSON files...')
    const municipalitiesData = loadJsonFile<Array<JsonMunicipality>>(
      'municipalities.json',
    )
    const seasData = loadJsonFile<Array<JsonSea>>('seas.json')
    const servicesData = loadJsonFile<Array<JsonService>>('services.json')
    const activitiesData = loadJsonFile<Array<JsonActivity>>('activities.json')
    const tagsData = loadJsonFile<Array<JsonTag>>('tags.json')
    const beachesData = loadJsonFile<Array<JsonBeach>>('beaches.json')

    console.log(`  ✓ Loaded ${municipalitiesData.length} municipalities`)
    console.log(`  ✓ Loaded ${seasData.length} seas`)
    console.log(`  ✓ Loaded ${servicesData.length} services`)
    console.log(`  ✓ Loaded ${activitiesData.length} activities`)
    console.log(`  ✓ Loaded ${tagsData.length} tags`)
    console.log(`  ✓ Loaded ${beachesData.length} beaches`)

    // Clear existing data (in reverse order of dependencies)
    console.log('\n🗑️  Clearing existing data...')
    await db.delete(schema.beachTags)
    await db.delete(schema.beachActivities)
    await db.delete(schema.beachServices)
    await db.delete(schema.beaches)
    await db.delete(schema.tags)
    await db.delete(schema.activities)
    await db.delete(schema.services)
    await db.delete(schema.seas)
    await db.delete(schema.municipalities)
    console.log('  ✓ Tables cleared')

    // Reset autoincrement counters
    await db.run(sql`DELETE FROM sqlite_sequence`)

    // Insert municipalities
    console.log('\n📍 Inserting municipalities...')
    const municipalityIdMap = new Map<number, number>()
    for (let i = 0; i < municipalitiesData.length; i++) {
      const mun = municipalitiesData[i]
      const result = await db
        .insert(schema.municipalities)
        .values({
          name: mun.name,
          ineCode: mun.id,
        })
        .returning({ id: schema.municipalities.id })

      municipalityIdMap.set(i, result[0].id)
      console.log(`  ✓ ${mun.name} (index ${i} → id ${result[0].id})`)
    }

    // Insert seas
    console.log('\n🌊 Inserting seas...')
    const seaIdMap = new Map<number, number>()
    for (let i = 0; i < seasData.length; i++) {
      const sea = seasData[i]
      const result = await db
        .insert(schema.seas)
        .values({
          name: sea.name,
          jellyfishRisk: sea.jellyfishRisk,
        })
        .returning({ id: schema.seas.id })

      seaIdMap.set(i, result[0].id)
      console.log(`  ✓ ${sea.name} (index ${i} → id ${result[0].id})`)
    }

    // Insert services
    console.log('\n🛟 Inserting services...')
    const serviceIdMap = new Map<number, number>()
    for (let i = 0; i < servicesData.length; i++) {
      const service = servicesData[i]
      const result = await db
        .insert(schema.services)
        .values({
          serviceId: service.id,
          name: service.name,
          icon: service.icon,
        })
        .returning({ id: schema.services.id })

      serviceIdMap.set(i, result[0].id)
      console.log(`  ✓ ${service.name} (index ${i} → id ${result[0].id})`)
    }

    // Insert activities
    console.log('\n🏄 Inserting activities...')
    const activityIdMap = new Map<number, number>()
    for (let i = 0; i < activitiesData.length; i++) {
      const activity = activitiesData[i]
      const result = await db
        .insert(schema.activities)
        .values({
          activityId: activity.id,
          name: activity.name,
          icon: activity.icon,
        })
        .returning({ id: schema.activities.id })

      activityIdMap.set(i, result[0].id)
      console.log(`  ✓ ${activity.name} (index ${i} → id ${result[0].id})`)
    }

    // Insert tags
    console.log('\n🏷️  Inserting tags...')
    const tagIdMap = new Map<number, number>()
    for (let i = 0; i < tagsData.length; i++) {
      const tag = tagsData[i]
      const result = await db
        .insert(schema.tags)
        .values({
          tagId: tag.id,
          name: tag.name,
        })
        .returning({ id: schema.tags.id })

      tagIdMap.set(i, result[0].id)
      console.log(`  ✓ ${tag.name} (index ${i} → id ${result[0].id})`)
    }

    // Insert beaches
    console.log('\n🏖️  Inserting beaches...')
    const beachIdMap = new Map<string, number>()

    for (const beach of beachesData) {
      const municipalityId = municipalityIdMap.get(beach.municipality)
      const seaId = seaIdMap.get(beach.sea)

      if (!municipalityId) {
        throw new Error(
          `Municipality index ${beach.municipality} not found for beach ${beach.code}`,
        )
      }
      if (!seaId) {
        throw new Error(
          `Sea index ${beach.sea} not found for beach ${beach.code}`,
        )
      }

      const result = await db
        .insert(schema.beaches)
        .values({
          code: beach.code,
          name: beach.name,
          municipalityId,
          seaId,
          latitude: beach.coordinates[0],
          longitude: beach.coordinates[1],
          soilType: beach.soilType,
          nudist: beach.nudist,
          promenade: beach.promenade,
          anchorageZone: beach.anchorageZone,
          dogFriendly: beach.dogFriendly,
          lifeguard: beach.lifeguard,
          description: beach.description,
          access: beach.access,
          nearby: JSON.stringify(beach.nearby),
          orientation: beach.orientation,
          instagramHashtag: beach.instagramHashtag,
          occupancyLevel: beach.occupancyLevel || null,
          campingNearby: beach.campingNearby ?? null,
          metaDescription: beach.metaDescription || null,
          seoKeywords: serializeArray(beach.seoKeywords) || null,
          certifications: serializeArray(beach.certifications) || null,
          bestSeason: serializeArray(beach.bestSeason) || null,
          district: beach.district || null,
          phone: beach.phone || null,
          email: beach.email || null,
          realUrl: beach.realUrl || null,
          waves: beach.waves || null,
          pictures: serializeArray(beach.pictures) || null,
          pictureQualityScore:
            typeof beach.pictureQualityScore === 'number'
              ? beach.pictureQualityScore
              : null,
          aemetId: beach.aemetId || null,
          length: beach.length || null,
          accessDifficulty: beach.accessDifficulty || null,
          childSafe: beach.childSafe ?? null,
          naturalShade: beach.naturalShade ?? null,
          waterQuality: beach.waterQuality || null,
        })
        .returning({ id: schema.beaches.id })

      beachIdMap.set(beach.code, result[0].id)
      console.log(`  ✓ ${beach.name} (${beach.code})`)
    }

    // Insert beach-service relationships
    console.log('\n🔗 Inserting beach-service relationships...')
    let serviceRelationCount = 0
    for (const beach of beachesData) {
      const beachId = beachIdMap.get(beach.code)
      if (!beachId) continue

      for (const serviceIndex of beach.services) {
        const serviceId = serviceIdMap.get(serviceIndex)
        if (!serviceId) {
          console.warn(
            `  ⚠️  Service index ${serviceIndex} not found for beach ${beach.code}`,
          )
          continue
        }

        await db.insert(schema.beachServices).values({
          beachId,
          serviceId,
        })
        serviceRelationCount++
      }
    }
    console.log(`  ✓ Inserted ${serviceRelationCount} service relationships`)

    // Insert beach-activity relationships
    console.log('\n🔗 Inserting beach-activity relationships...')
    let activityRelationCount = 0
    for (const beach of beachesData) {
      const beachId = beachIdMap.get(beach.code)
      if (!beachId) continue

      for (const activityIndex of beach.activities) {
        const activityId = activityIdMap.get(activityIndex)
        if (!activityId) {
          console.warn(
            `  ⚠️  Activity index ${activityIndex} not found for beach ${beach.code}`,
          )
          continue
        }

        await db.insert(schema.beachActivities).values({
          beachId,
          activityId,
        })
        activityRelationCount++
      }
    }
    console.log(`  ✓ Inserted ${activityRelationCount} activity relationships`)

    // Insert beach-tag relationships
    console.log('\n🔗 Inserting beach-tag relationships...')
    let tagRelationCount = 0
    for (const beach of beachesData) {
      const beachId = beachIdMap.get(beach.code)
      if (!beachId) continue

      for (const tagIndex of beach.tags) {
        const tagId = tagIdMap.get(tagIndex)
        if (!tagId) {
          console.warn(
            `  ⚠️  Tag index ${tagIndex} not found for beach ${beach.code}`,
          )
          continue
        }

        await db.insert(schema.beachTags).values({
          beachId,
          tagId,
        })
        tagRelationCount++
      }
    }
    console.log(`  ✓ Inserted ${tagRelationCount} tag relationships`)

    console.log('\n✨ Migration completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`  - ${municipalitiesData.length} municipalities`)
    console.log(`  - ${seasData.length} seas`)
    console.log(`  - ${servicesData.length} services`)
    console.log(`  - ${activitiesData.length} activities`)
    console.log(`  - ${tagsData.length} tags`)
    console.log(`  - ${beachesData.length} beaches`)
    console.log(`  - ${serviceRelationCount} beach-service relationships`)
    console.log(`  - ${activityRelationCount} beach-activity relationships`)
    console.log(`  - ${tagRelationCount} beach-tag relationships`)
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    throw error
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
