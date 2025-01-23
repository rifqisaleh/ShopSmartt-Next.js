import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { setupServer } from 'msw/node';
import { handlers } from '@/mocks/handlers';

// Create an MSW server
const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' })); // Warn if unhandled requests are made
afterEach(() => server.resetHandlers()); // Reset handlers after each test
afterAll(() => server.close()); // Close the server when tests are finished

export { server };