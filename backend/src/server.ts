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

// Get all projects
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

// Create a project
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

// Get all issues
app.get('/api/issues', async (request, response) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        project_id AS "projectId",
        title,
        priority,
        status
      FROM issues
      ORDER BY id`
    )

    response.json(result.rows)
  } catch (error) {
    console.error(error)

    response.status(500).json({
      message: 'Failed to load issues'
    })
  }
})

// Create an issue
app.post('/api/issues', async (request, response) => {
  try {
    const { projectId, title, priority, status } = request.body

    if (!projectId || !title || title.trim() === '') {
      response.status(400).json({
        message: 'Project and issue title are required'
      })

      return
    }

    const result = await pool.query(
      `INSERT INTO issues
        (project_id, title, priority, status)
       VALUES ($1, $2, $3, $4)
       RETURNING
        id,
        project_id AS "projectId",
        title,
        priority,
        status`,
      [
        projectId,
        title.trim(),
        priority,
        status
      ]
    )

    response.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)

    response.status(500).json({
      message: 'Failed to create issue'
    })
  }
})

// Update an issue
app.patch('/api/issues/:id', async (request, response) => {
  try {
    const issueId = Number(request.params.id)
    const { priority, status } = request.body

    const result = await pool.query(
      `UPDATE issues
       SET priority = $1, status = $2
       WHERE id = $3
       RETURNING
        id,
        project_id AS "projectId",
        title,
        priority,
        status`,
      [priority, status, issueId]
    )

    if (result.rows.length === 0) {
      response.status(404).json({
        message: 'Issue not found'
      })

      return
    }

    response.json(result.rows[0])
  } catch (error) {
    console.error(error)

    response.status(500).json({
      message: 'Failed to update issue'
    })
  }
})

// Delete an issue
app.delete('/api/issues/:id', async (request, response) => {
  try {
    const issueId = Number(request.params.id)

    const result = await pool.query(
      'DELETE FROM issues WHERE id = $1 RETURNING id',
      [issueId]
    )

    if (result.rows.length === 0) {
      response.status(404).json({
        message: 'Issue not found'
      })

      return
    }

    response.json({
      message: 'Issue deleted'
    })
  } catch (error) {
    console.error(error)

    response.status(500).json({
      message: 'Failed to delete issue'
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})