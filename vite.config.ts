import { vitePlugin as remix } from "@remix-run/dev";
import { flatRoutes } from 'remix-flat-routes';
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      ignoredRouteFiles: ['**/*'],
      routes: async (defineRoutes) => {
        return flatRoutes('routes', defineRoutes, {
          ignoredRouteFiles: ['**/components.tsx', '**/forms.tsx']
        })
      }
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 4000
  }
});
