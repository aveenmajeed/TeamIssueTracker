import { useEffect, useState } from 'react'
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
  const [projects, setProjects] = useState<Project[]>([])
  const [issues, setIssues] = useState<Issue[]>([])

  const [projectName, setProjectName] = useState('')
  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null)

  const [issueTitle, setIssueTitle] = useState('')
  const [issuePriority, setIssuePriority] = useState('Medium')
  const [issueStatus, setIssueStatus] = useState('Open')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    fetchProjects()
    fetchIssues()
  }, [])

  async function fetchProjects() {
    try {
      const response = await fetch(
        'http://localhost:3000/api/projects'
      )

      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
  }

  async function fetchIssues() {
    try {
      const response = await fetch(
        'http://localhost:3000/api/issues'
      )

      const data = await response.json()
      setIssues(data)
    } catch (error) {
      console.error('Failed to load issues:', error)
    }
  }

  async function createProject() {
    if (projectName.trim() === '') {
      return
    }

    try {
      const response = await fetch(
        'http://localhost:3000/api/projects',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: projectName
          })
        }
      )

      if (!response.ok) {
        console.error('Failed to create project')
        return
      }

      const newProject = await response.json()

      setProjects([...projects, newProject])
      setProjectName('')
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  function viewProject(project: Project) {
    setSelectedProject(project)
    setStatusFilter('All')
  }

  function goBack() {
    setSelectedProject(null)
  }

  async function createIssue() {
    if (issueTitle.trim() === '' || selectedProject === null) {
      return
    }

    try {
      const response = await fetch(
        'http://localhost:3000/api/issues',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            projectId: selectedProject.id,
            title: issueTitle,
            priority: issuePriority,
            status: issueStatus
          })
        }
      )

      if (!response.ok) {
        console.error('Failed to create issue')
        return
      }

      const newIssue = await response.json()

      setIssues([...issues, newIssue])

      setIssueTitle('')
      setIssuePriority('Medium')
      setIssueStatus('Open')
    } catch (error) {
      console.error('Failed to create issue:', error)
    }
  }

  async function changePriority(
    issueId: number,
    priority: string
  ) {
    const issue = issues.find(
      (currentIssue) => currentIssue.id === issueId
    )

    if (!issue) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/issues/${issueId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            priority: priority,
            status: issue.status
          })
        }
      )

      if (!response.ok) {
        console.error('Failed to update priority')
        return
      }

      const updatedIssue = await response.json()

      setIssues(
        issues.map((currentIssue) =>
          currentIssue.id === issueId
            ? updatedIssue
            : currentIssue
        )
      )
    } catch (error) {
      console.error('Failed to update priority:', error)
    }
  }

  async function changeStatus(
    issueId: number,
    status: string
  ) {
    const issue = issues.find(
      (currentIssue) => currentIssue.id === issueId
    )

    if (!issue) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/issues/${issueId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            priority: issue.priority,
            status: status
          })
        }
      )

      if (!response.ok) {
        console.error('Failed to update status')
        return
      }

      const updatedIssue = await response.json()

      setIssues(
        issues.map((currentIssue) =>
          currentIssue.id === issueId
            ? updatedIssue
            : currentIssue
        )
      )
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  async function deleteIssue(issueId: number) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/issues/${issueId}`,
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        console.error('Failed to delete issue')
        return
      }

      setIssues(
        issues.filter((issue) => issue.id !== issueId)
      )
    } catch (error) {
      console.error('Failed to delete issue:', error)
    }
  }

  function getOpenIssueCount(projectId: number) {
    return issues.filter(
      (issue) =>
        issue.projectId === projectId &&
        issue.status !== 'Resolved'
    ).length
  }

  const projectIssues = selectedProject
    ? issues.filter(
        (issue) => issue.projectId === selectedProject.id
      )
    : []

  const filteredIssues =
    statusFilter === 'All'
      ? projectIssues
      : projectIssues.filter(
          (issue) => issue.status === statusFilter
        )

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
                onChange={(event) =>
                  setProjectName(event.target.value)
                }
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

            <div className="issues-header">
              <h2>Issues</h2>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="All">All Issues</option>
                <option value="Open">Open</option>
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Resolved">
                  Resolved
                </option>
              </select>
            </div>

            <div className="issue-list">
              {filteredIssues.length === 0 ? (
                <p>No issues match this filter.</p>
              ) : (
                filteredIssues.map((issue) => (
                  <div
                    className="issue-card"
                    key={issue.id}
                  >
                    <div className="issue-card-header">
                      <h3>{issue.title}</h3>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteIssue(issue.id)
                        }
                      >
                        Delete
                      </button>
                    </div>

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
                          <option value="Medium">
                            Medium
                          </option>
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