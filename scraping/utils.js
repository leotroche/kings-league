import * as cheerio from 'cheerio'

export async function scrape(url) {
  const resp = await fetch(url)
  const html = await resp.text()
  return cheerio.load(html)
}

export const cleanText = (text) => {
  return text.replace(/\t|\n|\s:/g, '').replace(/.*:/g, '')
}

export const URLS = {
  leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/',
  mvp: 'https://kingsleague.pro/estadisticas/mvp/'
}
