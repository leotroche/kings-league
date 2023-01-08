import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DB_PATH = path.join(process.cwd(), './db/')

async function readDBFile(dbName) {
  const path = `${DB_PATH}/${dbName}.json`
  return readFile(path, 'utf-8').then(JSON.parse)
}

export function writeDBFile(dbName, data) {
  const path = `${DB_PATH}/${dbName}.json`
  return writeFile(path, JSON.stringify(data, null, 2), 'utf-8')
}

export const TEAMS = await readDBFile('teams')
export const PRESIDENTS = await readDBFile('presidents')
