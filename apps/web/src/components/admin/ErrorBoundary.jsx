
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="bg-admin-danger/5 border-admin-danger/20 shadow-sm my-4">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-admin-danger/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-admin-danger" />
            </div>
            <h3 className="text-lg font-semibold text-admin-foreground mb-2">Something went wrong</h3>
            <p className="text-sm text-admin-muted-foreground max-w-md mb-6">
              {this.state.error?.message || 'An unexpected error occurred while loading this component.'}
            </p>
            <Button 
              onClick={this.handleRetry}
              variant="outline"
              className="border-admin-border hover:bg-admin-muted"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
