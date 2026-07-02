import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import AppRouter from './routes'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
