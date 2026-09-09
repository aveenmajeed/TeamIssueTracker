import { useState } from 'react'
import './App.css'
import ProjectCard from './components/ProjectCard'

function App() {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Security App', issues: 5 },
    { id: 2, name: 'Banking App', issues: 3 },
    { id: 3, name: 'Website Redesign', issues: 8 }
  ])

  const [projectName, setProjectName] = useState('')

  function createProject() {
    if (projectName.trim() === '') {
      return
    }

    const newProject = {
      id: projects.length + 1,
      name: projectName,
      issues: 0
    }

    setProjects([...projects, newProject])
    setProjectName('')
  }

  return (
    <div>
      <header>
        <h2>Team Issue Tracker</h2>

        <nav>
          <span>Projects</span>
          <span>My Issues</span>
          <span>Profile</span>
        </nav>
      </header>

      <main>
        <h1>Projects</h1>
        <p>View and manage your team's projects.</p>

        <div className="create-project">
          <input
            type="text"
            placeholder="Enter project name"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
          />

          <button onClick={createProject}>Create Project</button>
        </div>

        <div className="project-list">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              name={project.name}
              issues={project.issues}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default App