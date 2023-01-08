import { SCRAPINGS, scrapeAndSave } from './utils.js'

for (const infoToScrape of Object.keys(SCRAPINGS)) {
  scrapeAndSave(infoToScrape)
}
