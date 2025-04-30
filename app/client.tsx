import { StartClient } from '@tanstack/react-start';
// The client entry point, initializes the client-side logic to handle routes in the browser
/// <reference types="vinxi/types/client" />
import { hydrateRoot } from 'react-dom/client';
import { createRouter } from './router';

const router = createRouter();

hydrateRoot(document, <StartClient router={router} />);
