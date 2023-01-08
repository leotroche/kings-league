import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'

import leaderboard from '../db/leaderboard.json'
import teams from '../db/teams.json'
import presidents from '../db/presidents.json'
import mvp from '../db/mvp.json'
import topScorers from '../db/top_scorers.json'
import topAssists from '../db/top_assists.json'

const app = new Hono()

app.get('/', (ctx) => {
  return ctx.json([
    {
      endpoint: '/leaderboard',
      description: 'Returns Kings League leaderboard'
    },
    {
      endpoint: '/teams',
      description: 'Returns Kings League teams'
    },
    {
      endpoint: '/presidents',
      description: 'Returns Kings League presidents'
    },
    {
      endpoint: '/mvp',
      description: 'Returns Kings League MVP'
    }
  ])
})

app.get('/teams', (ctx) => {
  return ctx.json(teams)
})

app.get('/teams/:id', (ctx) => {
  const id = ctx.req.param('id')
  const foundTeam = teams.find((team) => team.id === id)
  return foundTeam ? ctx.json(foundTeam) : ctx.json({ message: 'Team not found', status: 404 })
})

app.get('/presidents', (ctx) => {
  return ctx.json(presidents)
})

app.get('/presidents/:id', (ctx) => {
  const id = ctx.req.param('id')
  const foundPresident = presidents.find((president) => president.id === id)
  return foundPresident
    ? ctx.json(foundPresident)
    : ctx.json({ message: 'President not found', status: 404 })
})

app.get('/leaderboard', (ctx) => {
  return ctx.json(leaderboard)
})

app.get('/mvp', (ctx) => {
  return ctx.json(mvp)
})

app.get('/top-scores', (ctx) => {
  return ctx.json(topScorers)
})

app.get('/top-assists', (ctx) => {
  return ctx.json(topAssists)
})

app.get('/static/*', serveStatic({ root: './' }))

app.notFound((c) => {
  const { pathname } = new URL(c.req.url)

  if (pathname.at(-1) === '/') {
    return c.redirect(pathname.slice(0, -1))
  }

  return c.json({ message: 'Not Found' }, 404)
})

export default app
