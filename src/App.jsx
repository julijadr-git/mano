import { useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import './App.css'

function getToday() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getErrorMessage(error) {
  if (error?.code === '23505') {
    return 'Šiai dienai tokia užduotis jau sukurta.'
  }
  return error?.message || 'Nepavyko atlikti veiksmo. Bandykite dar kartą.'
}

function getStatusLabel(status) {
  const labels = {
    not_done: 'Neatlikta',
    pending: 'Laukia patvirtinimo',
    approved: 'Patvirtinta',
    rejected: 'Atmesta',
  }
  return labels[status] || status
}

function App() {
  const [children, setChildren] = useState([])
  const [selectedChildId, setSelectedChildId] = useState('')
  const [tasks, setTasks] = useState([])
  const [tasksChildId, setTasksChildId] = useState('')
  const [loadingChildren, setLoadingChildren] = useState(isSupabaseConfigured)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(isSupabaseConfigured ? '' : 'Trūksta Supabase nustatymų. Įrašykite URL ir viešą raktą į .env.local failą.')
  const [childName, setChildName] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [points, setPoints] = useState('10')
  const [taskDate, setTaskDate] = useState(getToday)

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined
    let ignore = false

    async function fetchChildren() {
      const { data, error: queryError } = await supabase
        .from('children')
        .select('id, name, created_at')
        .order('created_at', { ascending: true })

      if (ignore) return
      if (queryError) {
        setError(`Nepavyko įkelti vaikų: ${getErrorMessage(queryError)}`)
        setChildren([])
      } else {
        setChildren(data || [])
        setSelectedChildId((currentId) =>
          data?.some((child) => child.id === currentId) ? currentId : data?.[0]?.id || '',
        )
      }
      setLoadingChildren(false)
    }

    fetchChildren()
    return () => { ignore = true }
  }, [])

  useEffect(() => {
    if (!selectedChildId) return undefined
    let ignore = false

    async function fetchTasks() {
      const { data, error: queryError } = await supabase
        .from('tasks')
        .select('id, child_id, title, description, points, task_date, status, completed_at, reviewed_at, created_at')
        .eq('child_id', selectedChildId)
        .order('task_date', { ascending: false })
        .order('created_at', { ascending: true })

      if (ignore) return
      if (queryError) {
        setError(`Nepavyko įkelti užduočių: ${getErrorMessage(queryError)}`)
        setTasks([])
      } else {
        setTasks(data || [])
      }
      setTasksChildId(selectedChildId)
    }

    fetchTasks()
    return () => { ignore = true }
  }, [selectedChildId])

  async function addChild(event) {
    event.preventDefault()
    const name = childName.trim()
    if (!name) return

    setIsSaving(true)
    setError('')
    const { data, error: insertError } = await supabase
      .from('children')
      .insert({ name })
      .select('id, name, created_at')
      .single()

    if (insertError) {
      setError(`Nepavyko pridėti vaiko: ${getErrorMessage(insertError)}`)
    } else {
      setChildren((current) => [...current, data])
      setSelectedChildId(data.id)
      setChildName('')
    }
    setIsSaving(false)
  }

  async function addTask(event) {
    event.preventDefault()
    if (!selectedChildId) return

    setIsSaving(true)
    setError('')
    const { data, error: insertError } = await supabase
      .from('tasks')
      .insert({
        child_id: selectedChildId,
        title: title.trim(),
        description: description.trim() || null,
        points: Number(points),
        task_date: taskDate,
        status: 'not_done',
      })
      .select('id, child_id, title, description, points, task_date, status, completed_at, reviewed_at, created_at')
      .single()

    if (insertError) {
      setError(`Nepavyko sukurti užduoties: ${getErrorMessage(insertError)}`)
    } else {
      setTasks((current) => [...current, data].sort((a, b) => b.task_date.localeCompare(a.task_date)))
      setTitle('')
      setDescription('')
      setPoints('10')
      setTaskDate(getToday())
    }
    setIsSaving(false)
  }

  async function updateTask(task, updates) {
    setIsSaving(true)
    setError('')
    const { data, error: updateError } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', task.id)
      .eq('child_id', selectedChildId)
      .select('id, child_id, title, description, points, task_date, status, completed_at, reviewed_at, created_at')
      .single()

    if (updateError) {
      setError(`Nepavyko atnaujinti užduoties: ${getErrorMessage(updateError)}`)
    } else {
      setTasks((current) => current.map((item) => item.id === data.id ? data : item))
    }
    setIsSaving(false)
  }

  function markCompleted(task) {
    if (task.task_date > getToday() || task.status === 'approved') return
    updateTask(task, { status: 'pending', completed_at: new Date().toISOString(), reviewed_at: null })
  }

  function reviewTask(task, status) {
    if (task.status !== 'pending') return
    updateTask(task, { status, reviewed_at: new Date().toISOString() })
  }

  const visibleTasks = tasksChildId === selectedChildId ? tasks : []
  const isLoadingTasks = Boolean(selectedChildId) && tasksChildId !== selectedChildId
  const approvedTasks = visibleTasks.filter((task) => task.status === 'approved')
  const completedTasks = visibleTasks.filter((task) => task.status === 'pending' || task.status === 'approved')
  const pendingTasks = visibleTasks.filter((task) => task.status === 'pending')
  const totalPoints = approvedTasks.reduce((sum, task) => sum + Number(task.points || 0), 0)
  const progress = visibleTasks.length ? Math.round((completedTasks.length / visibleTasks.length) * 100) : 0
  const selectedChild = children.find((child) => child.id === selectedChildId)

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <p className="eyebrow">Vaiko užduočių suvestinė</p>
        <h1>{selectedChild ? `Sveiki, ${selectedChild.name}!` : 'Užduočių suvestinė'}</h1>
      </header>

      {error && <p className="app-message" role="alert">{error}</p>}

      {loadingChildren ? (
        <p className="loading-message" role="status">Įkeliami vaikai…</p>
      ) : (
        <>
          <section className="management-section" aria-labelledby="children-title">
            <div className="section-heading">
              <h2 id="children-title">Vaikai</h2>
            </div>
            {children.length > 0 && (
              <label className="form-field child-select-field">
                <span>Pasirinkite vaiką</span>
                <select
                  value={selectedChildId}
                  onChange={(event) => setSelectedChildId(event.target.value)}
                  aria-label="Pasirinkite vaiką"
                >
                  {children.map((child) => <option key={child.id} value={child.id}>{child.name}</option>)}
                </select>
              </label>
            )}
            {children.length === 0 && <p className="empty-message">Vaikų dar nėra. Pridėkite pirmą vaiką.</p>}
            <form className="inline-form child-form" onSubmit={addChild}>
              <label className="form-field">
                <span>Vaiko vardas</span>
                <input value={childName} onChange={(event) => setChildName(event.target.value)} maxLength={100} required />
              </label>
              <button className="action-button" type="submit" disabled={!isSupabaseConfigured || isSaving}>Pridėti vaiką</button>
            </form>
          </section>

          {selectedChild && (
            <>
              <section className="stats-grid" aria-label="Užduočių statistika">
                <article className="stat-card">
                  <p className="stat-label">Taškai</p>
                  <p className="stat-value">{totalPoints}</p>
                </article>
                <article className="stat-card">
                  <p className="stat-label">Atlikta</p>
                  <p className="stat-value">{completedTasks.length} <span>/ {visibleTasks.length}</span></p>
                </article>
                <article className="stat-card">
                  <p className="stat-label">Laukia patvirtinimo</p>
                  <p className="stat-value">{pendingTasks.length}</p>
                </article>
              </section>

              <section className="progress-section" aria-labelledby="progress-title">
                <div className="section-heading">
                  <h2 id="progress-title">Progresas</h2>
                  <span>{progress}%</span>
                </div>
                <div className="progress-track" role="progressbar" aria-label="Užduočių progresas" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </section>

              <section className="tasks-section" aria-labelledby="tasks-title">
                <div className="section-heading">
                  <h2 id="tasks-title">Užduotys</h2>
                  <span>{visibleTasks.length} užduotys</span>
                </div>
                {isLoadingTasks ? (
                  <p className="loading-message" role="status">Įkeliamos užduotys…</p>
                ) : visibleTasks.length === 0 ? (
                  <p className="empty-message">Šis vaikas dar neturi užduočių.</p>
                ) : (
                  <ul className="task-list">
                    {visibleTasks.map((task, index) => {
                      const canComplete = task.task_date <= getToday() && task.status !== 'approved' && task.status !== 'pending'
                      return (
                        <li className={`task-item ${task.status === 'approved' ? 'done' : ''}`} key={task.id}>
                          <div className="task-main">
                            <span className="task-check" aria-hidden="true">{task.status === 'approved' ? '✓' : ''}</span>
                            <span className="task-number">{String(index + 1).padStart(2, '0')}</span>
                            <div className="task-copy">
                              <span className="task-title">{task.title}</span>
                              {task.description && <span className="task-description">{task.description}</span>}
                              <span className="task-meta">{task.task_date} · {getStatusLabel(task.status)}</span>
                            </div>
                            <span className="task-points">+{task.points} tšk.</span>
                          </div>
                          <div className="task-actions">
                            {task.status !== 'approved' && (
                              <button type="button" className="task-action" onClick={() => markCompleted(task)} disabled={!canComplete || isSaving}>
                                {task.status === 'pending' ? 'Pažymėta atlikta' : task.status === 'rejected' ? 'Pažymėti atlikta dar kartą' : 'Pažymėti atlikta'}
                              </button>
                            )}
                            {task.status === 'pending' && (
                              <>
                                <button type="button" className="task-action approve-action" onClick={() => reviewTask(task, 'approved')} disabled={isSaving}>Patvirtinti</button>
                                <button type="button" className="task-action reject-action" onClick={() => reviewTask(task, 'rejected')} disabled={isSaving}>Atmesti</button>
                              </>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>

              <section className="management-section task-create-section" aria-labelledby="create-task-title">
                <div className="section-heading"><h2 id="create-task-title">Nauja užduotis</h2></div>
                <form className="task-form" onSubmit={addTask}>
                  <label className="form-field">
                    <span>Pavadinimas</span>
                    <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} required />
                  </label>
                  <label className="form-field">
                    <span>Aprašymas (neprivaloma)</span>
                    <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows="3" />
                  </label>
                  <div className="form-row">
                    <label className="form-field">
                      <span>Taškai</span>
                      <input type="number" min="0" step="1" value={points} onChange={(event) => setPoints(event.target.value)} required />
                    </label>
                    <label className="form-field">
                      <span>Data</span>
                      <input type="date" value={taskDate} onChange={(event) => setTaskDate(event.target.value)} required />
                    </label>
                  </div>
                  <button className="action-button" type="submit" disabled={!isSupabaseConfigured || isSaving}>Sukurti užduotį</button>
                </form>
              </section>
            </>
          )}
        </>
      )}
    </main>
  )
}

export default App
