import React from 'react';
import Card from '../ui/Card.tsx';

const DeveloperPage: React.FC = () => {
  const userSnippet = 'psql -h pg.neon.tech';
  const fullPsqlCommand = 'psql "postgres://<user>:<password>@<neon_hostname>/<dbname>?sslmode=require"';
  const netlifyDbCommand = 'npx netlify db init';


  return (
    <Card>
      <h1 className="text-2xl font-bold text-old-gold mb-4">Developer Information</h1>
      <div className="space-y-8 text-gray-300">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Backend & Database Integration</h2>
          <p>
            This application currently runs entirely in the browser, using React's Context API for state management. This is great for demos, but a production application requires a backend service connected to a persistent database for data integrity, security, and scalability.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Development Workflow & Tools</h3>
          <p className="mb-3">
            To build a full-stack application, you need tools for both local development and production deployment. You've mentioned commands related to both Netlify (a hosting and development platform) and Neon (a production database provider).
          </p>
          
          <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
              <h4 className="text-md font-semibold text-gray-200">1. Local Database Setup with Netlify</h4>
              <p>You can start by creating a local database environment. Netlify provides tools for this. The command you provided:</p>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400">
                <code className="whitespace-pre-wrap">{netlifyDbCommand}</code>
              </div>
              <p className="text-sm text-gray-400">This command initializes Netlify's database feature for your project, allowing you to develop and test your backend functions with a database locally.</p>
          </div>
          
          <div className="mt-6 space-y-4 p-4 border border-gray-700 rounded-lg">
              <h4 className="text-md font-semibold text-gray-200">2. Connecting to a Production Database (e.g., Neon)</h4>
               <p>
                Once your backend is ready, you'll deploy it and connect it to a production-grade database like Neon. Direct database connections from a frontend application are insecure. Instead, your backend server would use a connection string.
              </p>
              <p>
                The command-line snippet you previously provided, <code className="bg-gray-700 text-xs p-1 rounded">{userSnippet}</code>, is part of how you might connect to a Neon database using the `psql` tool for administrative tasks.
              </p>
              <p className="mb-3">
                In your backend code, you'd use a full connection URI like this:
              </p>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400">
                <code className="whitespace-pre-wrap">{fullPsqlCommand}</code>
              </div>
              <p className="text-xs text-gray-500 mt-2">Note: This connection string is a secret and should only be stored and used in a secure server environment, never exposed on the frontend.</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Proposed Architecture</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Frontend (This App):</strong> Handles user interface and interaction. Makes API calls to the backend.</li>
            <li><strong>Backend API (e.g., Netlify Functions, Express.js):</strong> Manages game logic, user data, and transactions. Securely connects to the database.</li>
            <li><strong>Database (e.g., Netlify DB, Neon):</strong> Persistently stores all application data (balances, bets, users).</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default DeveloperPage;
