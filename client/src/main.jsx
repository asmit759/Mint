import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from './store/store';
import { ThemeProvider } from './components/ThemeContext';
import App from './App.jsx';
import SmoothScrolling from './components/SmoothScrolling.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', background: 'white', padding: '20px', zIndex: 9999, position: 'relative' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error && this.state.error.toString()}</pre>
          <pre>{this.state.error && this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// 🚀 Mount React App
createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <SmoothScrolling>
            <App />
          </SmoothScrolling>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </ErrorBoundary>
);
