import {mkdir, writeFile} from "node:fs/promises"
import {basename, resolve} from "node:path"

interface ImageRecord {
  filename: string
  id: string
  url: string
}

const apiUrl = new URL("https://ds.qualcomm.com/api/images")
const outputDirectory = resolve(process.argv[2] ?? "./tmp/images")
const concurrency = 8

function isComponentCardImageRecord(value: unknown): value is ImageRecord {
  if (!value || typeof value !== "object") {
    return false
  }

  const image = value as Record<string, unknown>
  return (
    typeof image.filename === "string" &&
    typeof image.id === "string" &&
    typeof image.category === "string" &&
    image.category === "component-card-images" &&
    !image.filename.endsWith("_light.svg")
  )
}

// fetches images from the QDS site's CMS
async function fetchImages(): Promise<ImageRecord[]> {
  const response = await fetch(apiUrl)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch image list: ${response.status} ${response.statusText}`,
    )
  }

  const data: unknown = await response.json()

  if (!Array.isArray(data)) {
    throw new Error("The image API returned an unexpected response")
  }

  return data.filter(isComponentCardImageRecord)
}

function getLocalFilename(
  image: ImageRecord,
  filenameCounts: ReadonlyMap<string, number>,
): string {
  const filename = basename(image.filename)

  if (!filename || filename === "." || filename === "..") {
    throw new Error(`Image ${image.id} has an invalid filename`)
  }

  return filenameCounts.get(filename) === 1
    ? filename
    : `${image.id.replaceAll(/[^a-zA-Z0-9_-]/g, "_")}-${filename}`
}

async function downloadImage(image: ImageRecord, filename: string) {
  const imageUrl = new URL(`images/${image.id}/file`, apiUrl)
  const response = await fetch(imageUrl)

  if (!response.ok) {
    throw new Error(
      `Failed to download ${imageUrl}: ${response.status} ${response.statusText}`,
    )
  }

  const contents = Buffer.from(await response.arrayBuffer())
  await writeFile(resolve(outputDirectory, filename), contents)
  console.log(`Downloaded ${filename}`)
}

async function main() {
  const images = await fetchImages()
  const filenameCounts = new Map<string, number>()

  for (const image of images) {
    const filename = basename(image.filename)
    filenameCounts.set(filename, (filenameCounts.get(filename) ?? 0) + 1)
  }

  await mkdir(outputDirectory, {recursive: true})

  let nextImageIndex = 0
  const workers = Array.from(
    {length: Math.min(concurrency, images.length)},
    async () => {
      while (nextImageIndex < images.length) {
        const image = images[nextImageIndex]
        nextImageIndex += 1
        await downloadImage(image, getLocalFilename(image, filenameCounts))
      }
    },
  )

  await Promise.all(workers)
  console.log(`Downloaded ${images.length} images to ${outputDirectory}`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
