import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import ThemeProvider from './context/ThemeProvider.jsx'
import ToastProvider from './context/ToastProvider.jsx'
import ToolPrefsProvider from './context/ToolPrefsProvider.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <ToolPrefsProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ToolPrefsProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}