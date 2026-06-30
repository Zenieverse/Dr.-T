import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { VocalBridgeProvider } from '@vocalbridgeai/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VocalBridgeProvider options={{ auth: { tokenUrl: '/api/voice-token' } }}>
      <App />
    </VocalBridgeProvider>
  </StrictMode>,
);
