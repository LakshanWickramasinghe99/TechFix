import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error information (can be sent to an external service)
        this.setState({ errorInfo });
        console.error("Error Boundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Fallback UI when an error is caught
            return (
                <div style={{ padding: '20px', backgroundColor: '#f8d7da', color: '#721c24' }}>
                    <h2>Something went wrong.</h2>
                    <p>{this.state.error?.message || 'An unexpected error occurred.'}</p>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
