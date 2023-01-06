import * as cheerio from 'cheerio'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DB_PATH = path.join(process.cwd(), './db/')
const TEAMS = await readFile(`${DB_PATH}/teams.json`, 'utf-8').then(JSON.parse)

// import TEAMS from '../db/teams.json' assert { type : "json" } // eslint-disable-line

const URLS = {
  leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/'
}

async function scrape (url) {
  const resp = await fetch(url)
  const html = await resp.text()
  return cheerio.load(html)
}

const cleanText = text => text
  .replace(/\t|\n|\s:/g, '')
  .replace(/.*:/g, '')

async function getLeaderBoard () {
  const $ = await scrape(URLS.leaderboard)
  const $row = $('table tbody tr')

  const LEADERBOARD_SELECTORS = {
    team: { selector: '.fs-table-text_3', typeOf: 'string' },
    wins: { selector: '.fs-table-text_4', typeOf: 'number' },
    loses: { selector: '.fs-table-text_5', typeOf: 'number' },
    scoredGoals: { selector: '.fs-table-text_6', typeOf: 'number' },
    concededGoals: { selector: '.fs-table-text_7', typeOf: 'number' },
    yellowCards: { selector: '.fs-table-text_8', typeOf: 'number' },
    redCards: { selector: '.fs-table-text_9', typeOf: 'number' }
  }

  const getTeamFrom = ({ name }) => TEAMS.find(team => team.name === name)

  const leaderBoardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS)

  const leaderboard = []

  $row.each((_, el) => {
    const $el = $(el)

    const leaderBoardEntries = leaderBoardSelectorEntries
      .map(([key, { selector, typeOf }]) => {
        const rawValue = $el.find(selector).text()
        const cleanedValue = cleanText(rawValue)

        const value = typeOf === 'number'
          ? Number(cleanedValue)
          : cleanedValue

        return [key, value]
      })

    const { team: teamName, ...leaderboardForTeam } = Object.fromEntries(leaderBoardEntries)

    const team = getTeamFrom({ name: teamName })

    leaderboard.push({ ...leaderboardForTeam, team })
  })

  return leaderboard
}

const leaderboard = await getLeaderBoard()

const LEADERBOARD_PATH = `${DB_PATH}/leaderboard.json`

await writeFile(LEADERBOARD_PATH, JSON.stringify(leaderboard, null, 2), 'utf-8')
