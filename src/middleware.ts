//src\middleware.ts
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: ['/dashboard/:path*', '/users/:path*', '/reclamations/:path*', '/notifications/:path*', '/statistics/:path*'],
};