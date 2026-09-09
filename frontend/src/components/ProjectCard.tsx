type ProjectCardProps = {
  name: string
  issues: number
  onView: () => void
}

function ProjectCard({ name, issues, onView }: ProjectCardProps) {
  return (
    <div className="project-card">
      <h3>{name}</h3>
      <p>{issues} open issues</p>
      <button onClick={onView}>View Project</button>
    </div>
  )
}

export default ProjectCard