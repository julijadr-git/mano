import './App.css'

const tasks = ['Užduotis 1', 'Užduotis 2', 'Užduotis 3', 'Užduotis 4', 'Užduotis 5']

function App() {
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
          {tasks.map((task, index) => (
            <li className="task-item" key={task}>
              <span className="task-number">{String(index + 1).padStart(2, '0')}</span>
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
