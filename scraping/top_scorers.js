import { getImageFromTeam } from '../db/index.js'
import { cleanText } from './utils.js'

const SCORERS_SELECTORS = {
  team: { selector: '.fs-table-text_3', typeOf: 'string' },
  playerName: { selector: '.fs-table-text_4', typeOf: 'string' },
  gamesPlayed: { selector: '.fs-table-text_5', typeOf: 'number' },
  goals: { selector: '.fs-table-text_6', typeOf: 'number' }
}

export async function getTopScores($) {
  const $row = $('table tbody tr')

  const scorersSelectorEntries = Object.entries(SCORERS_SELECTORS)

  const scorers = []
  $row.each((index, el) => {
    const $el = $(el)

    const scorersEntries = scorersSelectorEntries.map(([key, { selector, typeOf }]) => {
      const rawValue = $el.find(selector).text()
      const cleanedValue = cleanText(rawValue)
      const value = typeOf === 'number' ? Number(cleanedValue) : cleanedValue

      return [key, value]
    })

    const { team: teamName, ...restOfData } = Object.fromEntries(scorersEntries)
    const image = getImageFromTeam({ name: teamName })

    scorers.push({
      rank: index + 1,
      team: teamName,
      image,
      ...restOfData
    })
  })

  return scorers
}
