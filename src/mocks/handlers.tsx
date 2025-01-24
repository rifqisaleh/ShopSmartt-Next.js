import { rest } from 'msw';

export const handlers = [
  rest.get(`${process.env.NEXT_PUBLIC_API_URL}auth/profile`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://example.com/avatar.jpg',
        role: 'user',
      })
    );
  }),
  // Add more handlers as needed
];