import { useState } from 'react'
import './App.css'
import ProjectCard from './components/ProjectCard'

type Project = {
  id: number
  name: string
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
    { id: 1, name: 'Security App' },
    { id: 2, name: 'Banking App' },
    { id: 3, name: 'Website Redesign' }
  ])

  const [issues, setIssues] = useState<Issue[]>([
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

  const [issueTitle, setIssueTitle] = useState('')
  const [issuePriority, setIssuePriority] = useState('Medium')
  const [issueStatus, setIssueStatus] = useState('Open')

  function createProject() {
    if (projectName.trim() === '') {
      return
    }

    const newProject = {
      id: Date.now(),
      name: projectName
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

  function createIssue() {
    if (issueTitle.trim() === '' || selectedProject === null) {
      return
    }

    const newIssue = {
      id: Date.now(),
      projectId: selectedProject.id,
      title: issueTitle,
      priority: issuePriority,
      status: issueStatus
    }

    setIssues([...issues, newIssue])

    setIssueTitle('')
    setIssuePriority('Medium')
    setIssueStatus('Open')
  }

  function changePriority(issueId: number, priority: string) {
    setIssues(
      issues.map((issue) =>
        issue.id === issueId
          ? { ...issue, priority: priority }
          : issue
      )
    )
  }

  function changeStatus(issueId: number, status: string) {
    setIssues(
      issues.map((issue) =>
        issue.id === issueId
          ? { ...issue, status: status }
          : issue
      )
    )
  }

  function getOpenIssueCount(projectId: number) {
    return issues.filter(
      (issue) =>
        issue.projectId === projectId &&
        issue.status !== 'Resolved'
    ).length
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

              <button onClick={createProject}>
                Create Project
              </button>
            </div>

            <div className="project-list">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  name={project.name}
                  issues={getOpenIssueCount(project.id)}
                  onView={() => viewProject(project)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              className="back-button"
              onClick={goBack}
            >
              Back to Projects
            </button>

            <h1>{selectedProject.name}</h1>
            <p>View and manage issues for this project.</p>

            <div className="create-issue">
              <h2>Create Issue</h2>

              <input
                type="text"
                placeholder="Issue title"
                value={issueTitle}
                onChange={(event) =>
                  setIssueTitle(event.target.value)
                }
              />

              <select
                value={issuePriority}
                onChange={(event) =>
                  setIssuePriority(event.target.value)
                }
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>

              <select
                value={issueStatus}
                onChange={(event) =>
                  setIssueStatus(event.target.value)
                }
              >
                <option value="Open">Open</option>
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Resolved">Resolved</option>
              </select>

              <button onClick={createIssue}>
                Add Issue
              </button>
            </div>

            <h2 className="issues-title">Issues</h2>

            <div className="issue-list">
              {projectIssues.length === 0 ? (
                <p>
                  No issues have been created for this project.
                </p>
              ) : (
                projectIssues.map((issue) => (
                  <div className="issue-card" key={issue.id}>
                    <h3>{issue.title}</h3>

                    <div className="issue-fields">
                      <div>
                        <label>Priority</label>

                        <select
                          value={issue.priority}
                          onChange={(event) =>
                            changePriority(
                              issue.id,
                              event.target.value
                            )
                          }
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>

                      <div>
                        <label>Status</label>

                        <select
                          value={issue.status}
                          onChange={(event) =>
                            changeStatus(
                              issue.id,
                              event.target.value
                            )
                          }
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">
                            In Progress
                          </option>
                          <option value="Resolved">
                            Resolved
                          </option>
                        </select>
                      </div>
                    </div>
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