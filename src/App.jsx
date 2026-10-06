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

function App() {
  const [taskList, setTaskList] = useState(tasks)

  function updateStats() {
    // Statistikos logika bus pridėta kitame žingsnyje.
  }

  function toggleTask(taskId) {
    setTaskList((currentTasks) => currentTasks.map((task) => (
      task.id === taskId ? { ...task, done: !task.done } : task
    )))
    updateStats()
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
          <p className="stat-value">0</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Atlikta</p>
          <p className="stat-value">0 <span>/ 5</span></p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Progresas</p>
          <p className="stat-value">0%</p>
        </article>
      </section>

      <section className="progress-section" aria-labelledby="progress-title">
        <div className="section-heading">
          <h2 id="progress-title">Progresas</h2>
          <span>0%</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Užduočių progresas"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="0"
        >
          <div className="progress-fill" />
        </div>
      </section>

      <section className="tasks-section" aria-labelledby="tasks-title">
        <div className="section-heading">
          <h2 id="tasks-title">Užduotys</h2>
          <span>5 užduotys</span>
        </div>
        <ul className="task-list">
          {renderTasks(taskList, toggleTask)}
        </ul>
      </section>
    </main>
  )
}

export default App
