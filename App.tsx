
import React, { useState, useCallback } from 'react';
import { generateCommand } from './services/geminiService';
import { CodeBlock } from './components/CodeBlock';
import { LoadingSpinner } from './components/LoadingSpinner';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [command, setCommand] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setError(null);
    setCommand('');

    try {
      const result = await generateCommand(prompt);
      setCommand(result);
    } catch (err) {
      setError('Failed to generate command. The AI might be unavailable or the request was blocked. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  const examples = [
    "Scan a network for open ports",
    "Find all subdomains for a given domain",
    "Check for SQL injection vulnerabilities on a URL",
    "List all running processes and their network connections on Linux",
    "Perform a traceroute to google.com",
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 font-mono">
      <main className="w-full max-w-4xl flex-grow flex flex-col">
        <header className="text-center my-8">
          <div className="flex items-center justify-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-100">Cyber Command Helper</h1>
          </div>
          <p className="text-gray-400 mt-2 text-lg">Your AI assistant for cybersecurity operations.</p>
        </header>

        <form onSubmit={handleSubmit} className="w-full mt-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe a task, e.g., 'scan 192.168.1.1 for vulnerabilities'..."
            className="w-full h-32 p-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none text-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt}
            className="w-full mt-4 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-xl"
          >
            {isLoading ? 'Generating...' : 'Generate Command'}
          </button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-gray-500 mb-2">Or try an example:</p>
            <div className="flex flex-wrap gap-2 justify-center">
                {examples.map((ex) => (
                    <button 
                        key={ex}
                        onClick={() => handleExampleClick(ex)}
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded-md hover:bg-gray-600 transition-colors text-sm"
                    >
                        {ex}
                    </button>
                ))}
            </div>
        </div>

        <div className="w-full flex-grow mt-8 flex flex-col justify-center items-center">
          {isLoading && <LoadingSpinner />}
          {error && <div className="p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg w-full">{error}</div>}
          {command && <CodeBlock command={command} />}
          {!isLoading && !error && !command && (
            <div className="text-center text-gray-500">
              <p className="text-xl">Your generated command will appear here.</p>
              <p>Describe a cybersecurity task above to get started.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
