import { rest } from 'msw';
import { Role } from '@/pages/register';

// Define handlers for mocking API requests
export const handlers = [
  // Mock handler for fetching product details
  rest.get('/api/products/:id', (req, res, ctx) => {
    const { id } = req.params as { id: string };

    // Example mocked product details for product with ID '1'
    if (id === '1') {
      return res(
        ctx.status(200),
        ctx.json({
          id: 1,
          title: 'Test Product',
          description: 'This is a test product description.',
          price: 99.99,
          images: ['/test-image.jpg'],
        })
      );
    }

    // If product ID is not '1', return a 404 error
    return res(ctx.status(404), ctx.json({ error: 'Product not found!' }));
  }),

  // Mock handler for adding to the cart
  rest.post('/api/cart', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ success: true }));
  }),

  // Mock handler for login
  rest.post('/auth/login', async (req, res, ctx) => {
    const { email, password } = await req.json();

    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.status(200),
        ctx.json({
          access_token: 'mockAccessToken',
          refresh_token: 'mockRefreshToken',
        })
      );
    }

    return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }));
  }),

  // Mock handler for fetching roles
  rest.get('/api/roles', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { role: 'Customer' },
        { role: 'Admin' },
      ] as Role[]) // Explicitly cast as Role[]
    );
  }),

  // Mock handler for submitting the registration form
  rest.post('/api/users', async (req, res, ctx) => {
    const { name, email, password, role, dob } = await req.json();

    if (!name || !email || !password || !role || !dob) {
      return res(ctx.status(400), ctx.json({ message: 'Validation failed' }));
    }

    return res(ctx.status(201), ctx.json({ message: 'User registered successfully' }));
  }),

  // Mock handler for fetching authenticated user profile
  rest.get('/auth/profile', (req, res, ctx) => {
    // Simulate an authenticated user
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        avatar: '/test-avatar.jpg',
        role: 'Customer',
      })
    );
  }),

  // Mock handler for login
  rest.post('/api/login', async (req, res, ctx) => {
    const { email, password } = await req.json();

    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.status(200),
        ctx.json({
          access_token: 'mockAccessToken',
          refresh_token: 'mockRefreshToken',
        })
      );
    }

    return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }));
  }),

  // Catch-all for unhandled requests
  rest.all('*', (req, res, ctx) => {
    console.warn(`Unhandled request to: ${req.url.toString()}`);
    return res(ctx.status(500), ctx.json({ error: 'Unhandled request!' }));
  }),
];
