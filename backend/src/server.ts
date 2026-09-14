import express from 'express'
import cors from 'cors'
import pool from './db.js'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.json({
    message: 'Team Issue Tracker API is running'
  })
})

app.get('/api/projects', async (request, response) => {
  try {
    const result = await pool.query(
      'SELECT id, name FROM projects ORDER BY id'
    )

    response.json(result.rows)
  } catch (error) {
    console.error(error)

    response.status(500).json({
      message: 'Failed to load projects'
    })
  }
})

app.post('/api/projects', async (request, response) => {
  try {
    const { name } = request.body

    if (!name || name.trim() === '') {
      response.status(400).json({
        message: 'Project name is required'
      })

      return
    }

    const result = await pool.query(
      'INSERT INTO projects (name) VALUES ($1) RETURNING id, name',
      [name.trim()]
    )

    response.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)

    response.status(500).json({
      message: 'Failed to create project'
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})