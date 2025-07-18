import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  // Fallback for development - this prevents the app from crashing
  // In production, you should set EXPO_PUBLIC_RORK_API_BASE_URL
  console.warn('EXPO_PUBLIC_RORK_API_BASE_URL not set, using fallback URL');
  return 'http://localhost:3000';
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      fetch: async (url, options) => {
        try {
          // Create a timeout promise
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), 10000);
          });
          
          const fetchPromise = fetch(url, options);
          
          const response = await Promise.race([fetchPromise, timeoutPromise]);
          return response as Response;
        } catch (error) {
          console.error('tRPC fetch error:', error);
          // Return a mock response to prevent crashes
          return new Response(JSON.stringify({ error: 'Network error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }) as Response;
        }
      },
    }),
  ],
});