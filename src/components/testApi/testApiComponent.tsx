import React, { useState } from 'react';
import axios from 'axios';

// Definimos un tipo para la respuesta de la API
type ApiResponse = {
  token?: string;
  message?: string;
  error?: string;
};

const TestApiComponent: React.FC = () => {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const testApi = async () => {
    setLoading(true);
    setError('');
    try {
      // Hacemos la solicitud POST con Axios
      const result = await axios.post<ApiResponse>('http://localhost:4000/api/user/login', {
        email: '202300185@upqroo.edu.mx',
        password: '12345678',
      });
      setResponse(result.data);
    } catch (err) {
      // Manejo de errores
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message);
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Prueba de API</h1>
      <button onClick={testApi} disabled={loading}>
        {loading ? 'Probando...' : 'Probar API'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {response && (
        <div>
          <h2>Respuesta:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestApiComponent;