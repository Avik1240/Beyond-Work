'use client';

interface NetworkErrorProps {
  onRetry?: () => void;
  message?: string;
}

export default function NetworkError({ 
  onRetry, 
  message = "We couldn't load this content. Check your connection and try again." 
}: NetworkErrorProps) {
  return (
    <div className="card text-center py-12">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      </div>
      
      <h3 className="text-lg font-medium text-text-primary mb-3">
        Connection issue
      </h3>
      
      <p className="text-text-secondary max-w-md mx-auto mb-6">
        {message}
      </p>
      
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </div>
  );
}
