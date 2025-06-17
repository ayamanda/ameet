'use client';

import { useState } from 'react';
import EmbeddableCall from '@/components/EmbeddableCall';
import { AlertCircle } from 'lucide-react';

export default function EmbedExample() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold">Embedding Example</h1>
          
          <div className="mb-8 rounded-lg bg-slate-100 p-6">
            <h2 className="mb-4 text-lg font-semibold">Live Demo</h2>
            <EmbeddableCall 
              hostName="John Doe"
              apiKey="your-api-key-here"
              buttonText="Start Video Chat"
              buttonClassName="bg-blue-600 hover:bg-blue-700"
              onCallStarted={(url) => window.open(url, '_blank')}
              onError={setError}
            />
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <AlertCircle className="size-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">How to Use</h2>
            <div className="rounded-md bg-slate-900 p-4">
              <pre className="text-sm text-white">
                <code>{`import EmbeddableCall from '@/components/EmbeddableCall';

// In your React component:
<EmbeddableCall
  hostName="Your Name"
  apiKey="your-api-key-here" // Get this from your Ameet dashboard
  buttonText="Start Video Chat"
  buttonClassName="your-custom-class"
  onCallStarted={(url) => {
    // Handle the meeting URL
    window.open(url, '_blank');
  }}
  onError={(error) => {
    // Handle any errors
    console.error(error);
  }}
/>`}</code>
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Props:</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
                <li><code className="text-pink-600">hostName</code>: The name of the host (required)</li>
                <li><code className="text-pink-600">apiKey</code>: Your API key for authentication (required)</li>
                <li><code className="text-pink-600">buttonText</code>: Custom button text (optional)</li>
                <li><code className="text-pink-600">buttonClassName</code>: Additional CSS classes for the button (optional)</li>
                <li><code className="text-pink-600">onCallStarted</code>: Callback function when call is started (optional)</li>
                <li><code className="text-pink-600">onError</code>: Callback function for error handling (optional)</li>
              </ul>
            </div>

            <div className="mt-8 space-y-2">
              <h3 className="font-medium">Getting Started:</h3>
              <ol className="list-inside list-decimal space-y-2 text-sm text-slate-600">
                <li>Contact us to get an API key for your domain</li>
                <li>Add your domain to the allowed origins in your dashboard</li>
                <li>Copy the EmbeddableCall component to your project</li>
                <li>Add the component to your page with your API key</li>
                <li>Style the button using the buttonClassName prop</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 