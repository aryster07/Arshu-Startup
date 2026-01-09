import { createRoot } from "react-dom/client";
import { Component, ReactNode, ErrorInfo } from "react";
import App from "./App.tsx";
import "./index.css";

console.log('Main.tsx is loading...');

// Error Boundary to catch React errors
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
          <h1 style={{ color: "#dc2626" }}>Something went wrong</h1>
          <pre style={{ 
            background: "#f3f4f6", 
            padding: "16px", 
            borderRadius: "8px",
            overflow: "auto",
            fontSize: "14px"
          }}>
            {this.state.error?.message}
            {"\n\n"}
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: "16px",
              padding: "8px 16px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

console.log('About to render App...');

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
  console.log('App rendered');
} else {
  console.error('Root element not found!');
}
