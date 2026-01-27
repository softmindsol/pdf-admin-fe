import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
          <Card className='max-w-2xl w-full'>
            <CardHeader className='text-center'>
              <div className='flex justify-center mb-4'>
                <div className='rounded-full bg-red-100 p-3'>
                  <AlertTriangle className='w-12 h-12 text-red-600' />
                </div>
              </div>
              <CardTitle className='text-2xl md:text-3xl'>Something went wrong</CardTitle>
              <CardDescription className='text-base'>
                We encountered an unexpected error. Please try one of the options below.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className='bg-gray-100 p-4 rounded-lg overflow-auto max-h-60'>
                  <p className='font-semibold text-sm text-gray-700 mb-2'>
                    Error Details:
                  </p>
                  <pre className='text-xs text-red-600 whitespace-pre-wrap'>
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className='text-xs text-gray-600 mt-2 whitespace-pre-wrap'>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              <div className='flex flex-col sm:flex-row gap-3 justify-center pt-4'>
                <Button onClick={this.handleReset} variant='outline'>
                  <RefreshCw className='w-4 h-4 mr-2' />
                  Try Again
                </Button>
                <Button onClick={this.handleReload} variant='outline'>
                  <RefreshCw className='w-4 h-4 mr-2' />
                  Reload Page
                </Button>
                <Button onClick={this.handleGoHome}>
                  <Home className='w-4 h-4 mr-2' />
                  Go to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
