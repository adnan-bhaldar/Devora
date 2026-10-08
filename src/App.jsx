import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import ThemeProvider from './context/ThemeProvider.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  )
}