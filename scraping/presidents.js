import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DB_PATH = path.join(process.cwd(), './db/')
const RAW_RESIDETNS = await readFile(
  `${DB_PATH}/raw-presidents.json`,
  'utf-8'
).then(JSON.parse)

const STATIC_PATH = path.join(process.cwd(), './assets/static/presidents/')

const presidents = await Promise.all(
  RAW_RESIDETNS.map(async (presidentInfo) => {
    const { slug: id, title, _links: links } = presidentInfo
    const { rendered: name } = title

    const { 'wp:attachment': attachment } = links
    const { href: imageApiEndpoint } = attachment[0]

    console.log(`> Fetching attachments for president: ${name}`)

    const responseImageEndpoint = await fetch(imageApiEndpoint)
    const data = await responseImageEndpoint.json()

    const [imageInfo] = data
    const {
      guid: { rendered: imageURL },
    } = imageInfo

    // fetch the image and save it to the file system

    const fileExtension = imageURL.split('.').at(-1)
    const imageFileName = `${id}.${fileExtension}`

    console.log(`> Fetching image for president: ${imageFileName}`)

    const responseImage = await fetch(imageURL)
    const arrayBuffer = await responseImage.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log('> Writing file in disk')
    await writeFile(`${STATIC_PATH}${imageFileName}`, buffer)

    console.log('Everything is done!')

    return { id, name, image: imageFileName, teamId: 0 }
  })
)

console.log('All presidents are done!')
await writeFile(
  `${DB_PATH}/presidents.json`,
  JSON.stringify(presidents, null, 2),
  'utf-8'
)
