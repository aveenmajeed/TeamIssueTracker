type ProjectCardProps = {
  name: string
  issues: number
}

function ProjectCard({ name, issues }: ProjectCardProps) {
  return (
    <div className="project-card">
      <h3>{name}</h3>
      <p>{issues} open issues</p>
      <button>View Project</button>
    </div>
  )
}

export default ProjectCard