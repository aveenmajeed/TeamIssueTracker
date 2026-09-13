import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.json({
    message: 'Team Issue Tracker API is running'
  })
})

app.get('/api/projects', (request, response) => {
  response.json([
    {
      id: 1,
      name: 'Security App'
    },
    {
      id: 2,
      name: 'Banking App'
    },
    {
      id: 3,
      name: 'Website Redesign'
    }
  ])
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})