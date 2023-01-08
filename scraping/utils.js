import * as cheerio from 'cheerio'
import { writeDBFile } from '../db/index.js'
import { getLeaderBoard } from './leaderboard.js'
import { logError, logInfo, logSuccess } from './logs.js'
import { getMVP } from './mvp.js'

export const cleanText = (text) => {
  return text.replace(/\t|\n|\s:/g, '').replace(/.*:/g, '')
}

export const SCRAPINGS = {
  leaderboard: {
    url: 'https://kingsleague.pro/estadisticas/clasificacion/',
    scraper: getLeaderBoard
  },
  mvp: {
    url: 'https://kingsleague.pro/estadisticas/mvp/',
    scraper: getMVP
  }
}

export async function scrape(url) {
  const resp = await fetch(url)
  const html = await resp.text()
  return cheerio.load(html)
}

export async function scrapeAndSave(page) {
  const start = performance.now()
  try {
    const { url, scraper } = SCRAPINGS[page]

    logInfo(`Scraping [${page}]...`)
    const $ = await scrape(url)
    const content = await scraper($)
    logSuccess(`[${page}] scraped successfully`)

    logInfo(`Writing [${page}] to database...`)
    await writeDBFile(page, content)
    logSuccess(`[${page}] written successfully`)
  } catch (e) {
    logError(`Error scraping [${page}]`)
    logError(e)
  } finally {
    const end = performance.now()
    const time = (end - start) / 1000
    logInfo(`[${page}] scraped in ${time} seconds`)
  }
}
