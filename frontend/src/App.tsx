import { useState } from 'react'
import './App.css'
import ProjectCard from './components/ProjectCard'

type Project = {
  id: number
  name: string
  issues: number
}

type Issue = {
  id: number
  projectId: number
  title: string
  priority: string
  status: string
}

function App() {
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: 'Security App', issues: 2 },
    { id: 2, name: 'Banking App', issues: 1 },
    { id: 3, name: 'Website Redesign', issues: 1 }
  ])

  const [issues] = useState<Issue[]>([
    {
      id: 1,
      projectId: 1,
      title: 'Camera stops recording',
      priority: 'High',
      status: 'Open'
    },
    {
      id: 2,
      projectId: 1,
      title: 'Improve dashboard layout',
      priority: 'Low',
      status: 'In Progress'
    },
    {
      id: 3,
      projectId: 2,
      title: 'Login button not working',
      priority: 'High',
      status: 'Open'
    },
    {
      id: 4,
      projectId: 3,
      title: 'Update homepage design',
      priority: 'Medium',
      status: 'In Progress'
    }
  ])

  const [projectName, setProjectName] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

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

  function viewProject(project: Project) {
    setSelectedProject(project)
  }

  function goBack() {
    setSelectedProject(null)
  }

  const projectIssues = selectedProject
    ? issues.filter((issue) => issue.projectId === selectedProject.id)
    : []

  return (
    <div>
      <header>
        <h2>Team Issue Tracker</h2>

        <nav>
          <span onClick={goBack}>Projects</span>
          <span>My Issues</span>
          <span>Profile</span>
        </nav>
      </header>

      <main>
        {selectedProject === null ? (
          <>
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
                  onView={() => viewProject(project)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <button className="back-button" onClick={goBack}>
              Back to Projects
            </button>

            <h1>{selectedProject.name}</h1>
            <p>View and manage issues for this project.</p>

            <h2 className="issues-title">Issues</h2>

            <div className="issue-list">
              {projectIssues.length === 0 ? (
                <p>No issues have been created for this project.</p>
              ) : (
                projectIssues.map((issue) => (
                  <div className="issue-card" key={issue.id}>
                    <h3>{issue.title}</h3>

                    <p>
                      <strong>Priority:</strong> {issue.priority}
                    </p>

                    <p>
                      <strong>Status:</strong> {issue.status}
                    </p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App