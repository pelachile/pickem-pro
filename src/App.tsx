import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { AIAnalysisService } from './services/aiAnalysisService';
import HelloWorldTest from './components/HelloWorldTest';

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Expose AI test function globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).testAmplifyAI = () => AIAnalysisService.testAmplifyAI();
}

function App() {
  return (
    <>
      <HelloWorldTest />
      <RouterProvider router={router} />
    </>
  );
}

export default App
