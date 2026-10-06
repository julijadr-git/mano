import { useState } from 'react'
import './App.css'

const tasks = [
  { id: 1, title: 'Perskaityti 10 puslapių', points: 10, done: false },
  { id: 2, title: 'Išspręsti 5 matematikos uždavinius', points: 20, done: false },
  { id: 3, title: 'Sutvarkyti kambarį', points: 15, done: false },
  { id: 4, title: '30 min. pasivaikščiojimo', points: 10, done: false },
  { id: 5, title: 'Pakartoti anglų kalbos žodžius', points: 15, done: false },
]

function renderTasks(taskList, toggleTask) {
  return taskList.map((task) => (
    <li key={task.id}>
      <button
        type="button"
        className={`task-item ${task.done ? 'done' : ''}`}
        onClick={() => toggleTask(task.id)}
        aria-pressed={task.done}
      >
        <span className="task-check" aria-hidden="true">{task.done ? '✓' : ''}</span>
        <span className="task-number">{String(task.id).padStart(2, '0')}</span>
        <span className="task-title">{task.title}</span>
        <span className="task-points">+{task.points} tšk.</span>
      </button>
    </li>
  ))
}

function updateStats(taskList) {
  const completedTasks = taskList.filter((task) => task.done)
  const totalTasks = taskList.length
  const completedCount = completedTasks.length

  return {
    points: completedTasks.reduce((sum, task) => sum + task.points, 0),
    completedCount,
    totalTasks,
    progress: totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100),
  }
}

function App() {
  const [taskList, setTaskList] = useState(tasks)
  const stats = updateStats(taskList)

  function toggleTask(taskId) {
    const updatedTasks = taskList.map((task) => (
      task.id === taskId ? { ...task, done: !task.done } : task
    ))
    setTaskList(updatedTasks)
    updateStats(updatedTasks)
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <p className="eyebrow">Tavo dienos suvestinė</p>
        <h1>Sveiki, Julijako!</h1>
      </header>

      <section className="stats-grid" aria-label="Užduočių statistika">
        <article className="stat-card">
          <p className="stat-label">Taškai</p>
          <p className="stat-value">{stats.points}</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Atlikta</p>
          <p className="stat-value">{stats.completedCount} <span>/ {stats.totalTasks}</span></p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Progresas</p>
          <p className="stat-value">{stats.progress}%</p>
        </article>
      </section>

      <section className="progress-section" aria-labelledby="progress-title">
        <div className="section-heading">
          <h2 id="progress-title">Progresas</h2>
          <span>{stats.progress}%</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Užduočių progresas"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={stats.progress}
        >
          <div className="progress-fill" style={{ width: `${stats.progress}%` }} />
        </div>
      </section>

      <section className="tasks-section" aria-labelledby="tasks-title">
        <div className="section-heading">
          <h2 id="tasks-title">Užduotys</h2>
          <span>{stats.totalTasks} užduotys</span>
        </div>
        <ul className="task-list">
          {renderTasks(taskList, toggleTask)}
        </ul>
      </section>
    </main>
  )
}

export default App
