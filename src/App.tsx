import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ChecklistPage } from './pages/ChecklistPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { EventWizardPage } from './pages/EventWizardPage'
import { EventWorkspacePage } from './pages/EventWorkspacePage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="dashboard" element={<Navigate replace to="/" />} />
        <Route path="events/new" element={<EventWizardPage />} />
        <Route path="events/:id" element={<EventWorkspacePage />} />
        <Route path="events/:id/checklist" element={<ChecklistPage />} />
        <Route path="events/:id/documents" element={<DocumentsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
