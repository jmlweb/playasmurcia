import { chromium } from 'playwright'

const DEFAULT_BASE = 'http://localhost:3000'
const DEFAULT_OUT = '/tmp/screenshot.png'
const DEFAULT_WIDTH = 1280
const DEFAULT_HEIGHT = 800

function parseArgs() {
  const args = process.argv.slice(2)
  let path = '/'
  let out = DEFAULT_OUT
  let width = DEFAULT_WIDTH
  let height = DEFAULT_HEIGHT
  let fullPage = false
  let mobile = false

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--out' && args[i + 1]) out = args[++i]
    else if (arg === '--width' && args[i + 1]) width = Number(args[++i])
    else if (arg === '--height' && args[i + 1]) height = Number(args[++i])
    else if (arg === '--full-page') fullPage = true
    else if (arg === '--mobile') {
      mobile = true
      width = 375
      height = 812
    } else if (!arg.startsWith('--')) path = arg
  }

  return { path, out, width, height, fullPage, mobile }
}

async function main() {
  const { path, out, width, height, fullPage, mobile } = parseArgs()
  const url = path.startsWith('http') ? path : `${DEFAULT_BASE}${path}`

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
  })
  const page = await context.newPage()

  await page.goto(url, { waitUntil: 'networkidle' })
  await page.screenshot({ path: out, fullPage })

  await browser.close()
  console.log(`Screenshot saved: ${out}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
