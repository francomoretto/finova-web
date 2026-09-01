import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const resolveSrc = (path: string): string => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  // Los alias replican los `paths` de tsconfig.json: Vitest no lee tsconfig.
  resolve: {
    alias: {
      '@components': resolveSrc('./src/components'),
      '@layouts': resolveSrc('./src/layouts'),
      '@lib': resolveSrc('./src/lib'),
      '@data': resolveSrc('./src/data'),
      '@styles': resolveSrc('./src/styles'),
      '@': resolveSrc('./src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/lib/**/*.ts'],
    },
  },
});
