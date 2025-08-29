import React from 'react';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>({ authMode: "userPool" });

export default function HelloWorldTest() {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<any>(null);

  // Log any changes to the state
  React.useEffect(() => {
    console.log('State changed:', { data, isLoading, error });
  }, [data, isLoading, error]);

  const handleClick = async () => {
    console.log('Button clicked, about to call sayHello query');
    setIsLoading(true);
    setError(null);
    setData(null);
    
    try {
      const result = await client.queries.sayHello({ name: 'World' });
      console.log('sayHello result:', result);
      setData(result.data);
    } catch (err) {
      console.error('sayHello error:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  console.log('Component state:', { data, isLoading, error });

  return (
    <>
      <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', position: 'fixed', top: '10px', right: '10px', zIndex: 9999, backgroundColor: 'white', width: '300px' }}>
        <h3>Bedrock Hello World Test</h3>
        <button onClick={handleClick} disabled={isLoading}>
          {isLoading ? 'Testing...' : 'Test Bedrock'}
        </button>
        <div style={{ marginTop: '10px', fontSize: '12px' }}>
          Debug: data={data ? 'YES' : 'NO'}, loading={isLoading ? 'YES' : 'NO'}, error={error ? 'YES' : 'NO'}
        </div>
      </div>

      {/* Results shown outside the fixed box */}
      {error && (
        <div style={{ position: 'fixed', top: '200px', right: '10px', padding: '20px', background: '#ffebee', color: 'red', border: '2px solid red', zIndex: 9999, maxWidth: '300px' }}>
          <strong>Error:</strong> {error.message || String(error)}
          <br />
          <small>Full error: {JSON.stringify(error, null, 2)}</small>
        </div>
      )}
      {data && (
        <div style={{ position: 'fixed', top: '200px', right: '10px', padding: '20px', background: '#e8f5e8', border: '3px solid green', zIndex: 9999, maxWidth: '300px', fontSize: '16px' }}>
          <strong>🎉 SUCCESS! Message:</strong> {data?.message || 'No message found'}
          <br />
          <small>Raw data: {JSON.stringify(data, null, 2)}</small>
        </div>
      )}
    </>
  );
}
