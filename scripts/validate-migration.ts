import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { eq, sql } from "drizzle-orm"
import { db } from "../src/db/client"
import {
  activities,
  beachActivities,
  beachServices,
  beachTags,
  beaches,
  municipalities,
  seas,
  services,
  tags,
} from "../src/db/schema"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface BeachJSON {
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
  tags: Array<number>
  activities: Array<number>
  length?: number
  pictures?: Array<string>
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
  aemetId?: string
}

interface ValidationResult {
  category: string
  passed: boolean
  message: string
  details?: Record<string, unknown>
}

const results: Array<ValidationResult> = []

function addResult(
  category: string,
  passed: boolean,
  message: string,
  details?: Record<string, unknown>,
): void {
  results.push({ category, passed, message, details })
}

function loadJSONData(): Array<BeachJSON> {
  const dataPath = join(__dirname, "..", "data", "beaches.json")
  const data = readFileSync(dataPath, "utf-8")
  return JSON.parse(data) as Array<BeachJSON>
}

async function validateRecordCounts(jsonBeaches: Array<BeachJSON>): Promise<void> {
  console.log("\n📊 Validating record counts...")

  // Count beaches
  const [beachCount] = await db.select({ count: sql<number>`count(*)` }).from(beaches)
  const expectedBeachCount = jsonBeaches.length
  const beachCountMatch = beachCount.count === expectedBeachCount
  addResult(
    "Counts",
    beachCountMatch,
    `Beaches: ${beachCount.count}/${expectedBeachCount}`,
    { actual: beachCount.count, expected: expectedBeachCount },
  )

  // Count municipalities (unique in JSON)
  const uniqueMunicipalities = new Set(jsonBeaches.map((b) => b.municipality))
  const [municipalityCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(municipalities)
  const municipalityCountMatch = municipalityCount.count === uniqueMunicipalities.size
  addResult(
    "Counts",
    municipalityCountMatch,
    `Municipalities: ${municipalityCount.count}/${uniqueMunicipalities.size}`,
    { actual: municipalityCount.count, expected: uniqueMunicipalities.size },
  )

  // Count seas (unique in JSON)
  const uniqueSeas = new Set(jsonBeaches.map((b) => b.sea))
  const [seaCount] = await db.select({ count: sql<number>`count(*)` }).from(seas)
  const seaCountMatch = seaCount.count === uniqueSeas.size
  addResult(
    "Counts",
    seaCountMatch,
    `Seas: ${seaCount.count}/${uniqueSeas.size}`,
    { actual: seaCount.count, expected: uniqueSeas.size },
  )

  // Count services
  const allServices = new Set<number>()
  jsonBeaches.forEach((b) => b.services.forEach((s) => allServices.add(s)))
  const [serviceCount] = await db.select({ count: sql<number>`count(*)` }).from(services)
  const serviceCountMatch = serviceCount.count >= allServices.size
  addResult(
    "Counts",
    serviceCountMatch,
    `Services: ${serviceCount.count} (min ${allServices.size})`,
    { actual: serviceCount.count, minExpected: allServices.size },
  )

  // Count activities
  const allActivities = new Set<number>()
  jsonBeaches.forEach((b) => b.activities.forEach((a) => allActivities.add(a)))
  const [activityCount] = await db.select({ count: sql<number>`count(*)` }).from(activities)
  const activityCountMatch = activityCount.count >= allActivities.size
  addResult(
    "Counts",
    activityCountMatch,
    `Activities: ${activityCount.count} (min ${allActivities.size})`,
    { actual: activityCount.count, minExpected: allActivities.size },
  )

  // Count tags
  const allTags = new Set<number>()
  jsonBeaches.forEach((b) => b.tags.forEach((t) => allTags.add(t)))
  const [tagCount] = await db.select({ count: sql<number>`count(*)` }).from(tags)
  const tagCountMatch = tagCount.count >= allTags.size
  addResult(
    "Counts",
    tagCountMatch,
    `Tags: ${tagCount.count} (min ${allTags.size})`,
    { actual: tagCount.count, minExpected: allTags.size },
  )

  // Count junction table records
  const totalBeachServices = jsonBeaches.reduce((sum, b) => sum + b.services.length, 0)
  const [beachServiceCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(beachServices)
  const beachServiceCountMatch = beachServiceCount.count === totalBeachServices
  addResult(
    "Counts",
    beachServiceCountMatch,
    `Beach-Services: ${beachServiceCount.count}/${totalBeachServices}`,
    { actual: beachServiceCount.count, expected: totalBeachServices },
  )

  const totalBeachActivities = jsonBeaches.reduce((sum, b) => sum + b.activities.length, 0)
  const [beachActivityCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(beachActivities)
  const beachActivityCountMatch = beachActivityCount.count === totalBeachActivities
  addResult(
    "Counts",
    beachActivityCountMatch,
    `Beach-Activities: ${beachActivityCount.count}/${totalBeachActivities}`,
    { actual: beachActivityCount.count, expected: totalBeachActivities },
  )

  const totalBeachTags = jsonBeaches.reduce((sum, b) => sum + b.tags.length, 0)
  const [beachTagCount] = await db.select({ count: sql<number>`count(*)` }).from(beachTags)
  const beachTagCountMatch = beachTagCount.count === totalBeachTags
  addResult(
    "Counts",
    beachTagCountMatch,
    `Beach-Tags: ${beachTagCount.count}/${totalBeachTags}`,
    { actual: beachTagCount.count, expected: totalBeachTags },
  )
}

async function validateBeachCodes(jsonBeaches: Array<BeachJSON>): Promise<void> {
  console.log("\n🔍 Validating beach codes...")

  const allBeaches = await db.select({ code: beaches.code }).from(beaches)
  const dbCodes = new Set(allBeaches.map((b) => b.code))
  const jsonCodes = new Set(jsonBeaches.map((b) => b.code))

  const missingInDb = [...jsonCodes].filter((code) => !dbCodes.has(code))
  const extraInDb = [...dbCodes].filter((code) => !jsonCodes.has(code))

  const codesMatch = missingInDb.length === 0 && extraInDb.length === 0
  addResult(
    "Beach Codes",
    codesMatch,
    codesMatch ? "All beach codes match" : "Beach code mismatch",
    {
      missingInDb: missingInDb.length > 0 ? missingInDb : undefined,
      extraInDb: extraInDb.length > 0 ? extraInDb : undefined,
    },
  )
}

async function validateSampleBeaches(jsonBeaches: Array<BeachJSON>): Promise<void> {
  console.log("\n🔎 Validating sample beaches...")

  // First beach
  const firstJSON = jsonBeaches[0] as BeachJSON | undefined
  if (firstJSON) {
    const firstDB = await db.query.beaches.findFirst({
      where: eq(beaches.code, firstJSON.code),
      with: {
        municipality: true,
        sea: true,
        services: { with: { service: true } },
        activities: { with: { activity: true } },
        tags: { with: { tag: true } },
      },
    })

    if (!firstDB) {
      addResult("Sample Beaches", false, `First beach not found: ${firstJSON.code}`)
    } else {
      const nameMatch = firstDB.name === firstJSON.name
      const latMatch = Math.abs(firstDB.latitude - firstJSON.coordinates[0]) < 0.000001
      const lonMatch = Math.abs(firstDB.longitude - firstJSON.coordinates[1]) < 0.000001
      const soilMatch = firstDB.soilType === firstJSON.soilType
      const servicesMatch = firstDB.services.length === firstJSON.services.length
      const activitiesMatch = firstDB.activities.length === firstJSON.activities.length
      const tagsMatch = firstDB.tags.length === firstJSON.tags.length

      const allMatch =
        nameMatch && latMatch && lonMatch && soilMatch && servicesMatch && activitiesMatch && tagsMatch

      addResult(
        "Sample Beaches",
        allMatch,
        `First beach (${firstJSON.code}): ${allMatch ? "OK" : "Mismatch"}`,
        allMatch
          ? undefined
          : {
              name: { db: firstDB.name, json: firstJSON.name, match: nameMatch },
              coordinates: {
                db: [firstDB.latitude, firstDB.longitude],
                json: firstJSON.coordinates,
                match: latMatch && lonMatch,
              },
              soil: { db: firstDB.soilType, json: firstJSON.soilType, match: soilMatch },
              services: {
                db: firstDB.services.length,
                json: firstJSON.services.length,
                match: servicesMatch,
              },
              activities: {
                db: firstDB.activities.length,
                json: firstJSON.activities.length,
                match: activitiesMatch,
              },
              tags: { db: firstDB.tags.length, json: firstJSON.tags.length, match: tagsMatch },
            },
      )
    }
  }

  // Last beach
  const lastJSON = jsonBeaches[jsonBeaches.length - 1] as BeachJSON | undefined
  if (lastJSON) {
    const lastDB = await db.query.beaches.findFirst({
      where: eq(beaches.code, lastJSON.code),
      with: {
        municipality: true,
        sea: true,
        services: { with: { service: true } },
        activities: { with: { activity: true } },
        tags: { with: { tag: true } },
      },
    })

    if (!lastDB) {
      addResult("Sample Beaches", false, `Last beach not found: ${lastJSON.code}`)
    } else {
      const nameMatch = lastDB.name === lastJSON.name
      const latMatch = Math.abs(lastDB.latitude - lastJSON.coordinates[0]) < 0.000001
      const lonMatch = Math.abs(lastDB.longitude - lastJSON.coordinates[1]) < 0.000001
      const allMatch = nameMatch && latMatch && lonMatch

      addResult(
        "Sample Beaches",
        allMatch,
        `Last beach (${lastJSON.code}): ${allMatch ? "OK" : "Mismatch"}`,
        allMatch
          ? undefined
          : {
              name: { db: lastDB.name, json: lastJSON.name, match: nameMatch },
              coordinates: {
                db: [lastDB.latitude, lastDB.longitude],
                json: lastJSON.coordinates,
                match: latMatch && lonMatch,
              },
            },
      )
    }
  }

  // Random middle beach
  const middleIndex = Math.floor(jsonBeaches.length / 2)
  const middleJSON = jsonBeaches[middleIndex] as BeachJSON | undefined
  if (middleJSON) {
    const middleDB = await db.query.beaches.findFirst({
      where: eq(beaches.code, middleJSON.code),
    })

    if (!middleDB) {
      addResult("Sample Beaches", false, `Middle beach not found: ${middleJSON.code}`)
    } else {
      const nameMatch = middleDB.name === middleJSON.name
      addResult(
        "Sample Beaches",
        nameMatch,
        `Middle beach (${middleJSON.code}): ${nameMatch ? "OK" : "Mismatch"}`,
        nameMatch ? undefined : { db: middleDB.name, json: middleJSON.name },
      )
    }
  }
}

async function validateRequiredFields(): Promise<void> {
  console.log("\n✅ Validating required fields...")

  const allBeaches = await db.select().from(beaches).limit(10)

  const requiredFields = [
    "code",
    "name",
    "municipalityId",
    "seaId",
    "latitude",
    "longitude",
    "soilType",
    "description",
    "access",
    "nearby",
    "orientation",
    "instagramHashtag",
  ]

  let allValid = true
  const invalidBeaches: Array<string> = []

  for (const beach of allBeaches) {
    for (const field of requiredFields) {
      const value = beach[field as keyof typeof beach]
      if (value === null || value === "") {
        allValid = false
        invalidBeaches.push(`${beach.code} (missing ${field})`)
      }
    }
  }

  addResult(
    "Required Fields",
    allValid,
    allValid ? "All required fields populated" : "Some required fields missing",
    allValid ? undefined : { invalidBeaches },
  )
}

async function validateJSONFields(): Promise<void> {
  console.log("\n📝 Validating JSON array fields...")

  const sampleBeaches = await db.select().from(beaches).limit(20)

  let allValid = true
  const invalidFields: Record<string, Array<string>> = {}

  for (const beach of sampleBeaches) {
    // Validate nearby (always required)
    try {
      const nearby = JSON.parse(beach.nearby)
      if (!Array.isArray(nearby)) {
        allValid = false
        if (!("nearby" in invalidFields)) invalidFields.nearby = []
        invalidFields.nearby.push(beach.code)
      }
    } catch {
      allValid = false
      if (!("nearby" in invalidFields)) invalidFields.nearby = []
      invalidFields.nearby.push(beach.code)
    }

    // Validate optional JSON fields
    const optionalJSONFields = ["seoKeywords", "certifications", "pictures", "bestSeason"]
    for (const field of optionalJSONFields) {
      const value = beach[field as keyof typeof beach]
      if (typeof value === "string" && value.length > 0) {
        try {
          const parsed = JSON.parse(value)
          if (!Array.isArray(parsed)) {
            allValid = false
            invalidFields[field] = invalidFields[field] ?? []
            invalidFields[field].push(beach.code)
          }
        } catch {
          allValid = false
          invalidFields[field] = invalidFields[field] ?? []
          invalidFields[field].push(beach.code)
        }
      }
    }
  }

  addResult(
    "JSON Fields",
    allValid,
    allValid ? "All JSON fields parse correctly" : "Some JSON fields invalid",
    allValid ? undefined : invalidFields,
  )
}

async function validateForeignKeys(): Promise<void> {
  console.log("\n🔗 Validating foreign key relationships...")

  // Check for orphaned beach_services
  const orphanedServices = await db
    .select({
      beachId: beachServices.beachId,
      serviceId: beachServices.serviceId,
    })
    .from(beachServices)
    .leftJoin(beaches, eq(beachServices.beachId, beaches.id))
    .leftJoin(services, eq(beachServices.serviceId, services.id))
    .where(sql`${beaches.id} IS NULL OR ${services.id} IS NULL`)
    .limit(10)

  const servicesValid = orphanedServices.length === 0
  addResult(
    "Foreign Keys",
    servicesValid,
    servicesValid ? "Beach-Services relationships valid" : "Orphaned beach-services found",
    servicesValid ? undefined : { orphaned: orphanedServices },
  )

  // Check for orphaned beach_activities
  const orphanedActivities = await db
    .select({
      beachId: beachActivities.beachId,
      activityId: beachActivities.activityId,
    })
    .from(beachActivities)
    .leftJoin(beaches, eq(beachActivities.beachId, beaches.id))
    .leftJoin(activities, eq(beachActivities.activityId, activities.id))
    .where(sql`${beaches.id} IS NULL OR ${activities.id} IS NULL`)
    .limit(10)

  const activitiesValid = orphanedActivities.length === 0
  addResult(
    "Foreign Keys",
    activitiesValid,
    activitiesValid ? "Beach-Activities relationships valid" : "Orphaned beach-activities found",
    activitiesValid ? undefined : { orphaned: orphanedActivities },
  )

  // Check for orphaned beach_tags
  const orphanedTags = await db
    .select({
      beachId: beachTags.beachId,
      tagId: beachTags.tagId,
    })
    .from(beachTags)
    .leftJoin(beaches, eq(beachTags.beachId, beaches.id))
    .leftJoin(tags, eq(beachTags.tagId, tags.id))
    .where(sql`${beaches.id} IS NULL OR ${tags.id} IS NULL`)
    .limit(10)

  const tagsValid = orphanedTags.length === 0
  addResult(
    "Foreign Keys",
    tagsValid,
    tagsValid ? "Beach-Tags relationships valid" : "Orphaned beach-tags found",
    tagsValid ? undefined : { orphaned: orphanedTags },
  )
}

function printResults(): void {
  console.log("\n" + "=".repeat(80))
  console.log("📋 VALIDATION REPORT")
  console.log("=".repeat(80))

  const categories = [...new Set(results.map((r) => r.category))]

  for (const category of categories) {
    const categoryResults = results.filter((r) => r.category === category)
    const allPassed = categoryResults.every((r) => r.passed)
    const icon = allPassed ? "✅" : "❌"

    console.log(`\n${icon} ${category}`)
    console.log("-".repeat(80))

    for (const result of categoryResults) {
      const status = result.passed ? "✓" : "✗"
      console.log(`  ${status} ${result.message}`)

      if (result.details && !result.passed) {
        console.log(`    Details:`, JSON.stringify(result.details, null, 2))
      }
    }
  }

  console.log("\n" + "=".repeat(80))

  const totalTests = results.length
  const passedTests = results.filter((r) => r.passed).length
  const failedTests = totalTests - passedTests

  console.log(`Total tests: ${totalTests}`)
  console.log(`Passed: ${passedTests}`)
  console.log(`Failed: ${failedTests}`)

  if (failedTests === 0) {
    console.log("\n✅ All validations passed! Migration successful.")
  } else {
    console.log(`\n❌ ${failedTests} validation(s) failed. Review the details above.`)
  }

  console.log("=".repeat(80))
}

async function main(): Promise<void> {
  try {
    console.log("🚀 Starting migration validation...")

    const jsonBeaches = loadJSONData()
    console.log(`📖 Loaded ${jsonBeaches.length} beaches from JSON`)

    await validateRecordCounts(jsonBeaches)
    await validateBeachCodes(jsonBeaches)
    await validateSampleBeaches(jsonBeaches)
    await validateRequiredFields()
    await validateJSONFields()
    await validateForeignKeys()

    printResults()

    const hasFailures = results.some((r) => !r.passed)
    process.exit(hasFailures ? 1 : 0)
  } catch (error) {
    console.error("\n❌ Validation failed with error:")
    console.error(error)
    process.exit(1)
  }
}

main()
