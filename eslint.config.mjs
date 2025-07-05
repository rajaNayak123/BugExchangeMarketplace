import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Ignore generated files and build outputs
    ignores: [
      "**/generated/**",
      "**/prisma/runtime/**",
      "**/.next/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
    ],
  },
  {
    // Lenient rules for development - no build-breaking errors
    rules: {
      // Turn off unused variables during development
      "@typescript-eslint/no-unused-vars": "off",
      
      // Allow unused expressions
      "@typescript-eslint/no-unused-expressions": "off",
      
      // Allow explicit any during development
      "@typescript-eslint/no-explicit-any": "off",
      
      // Allow this aliasing
      "@typescript-eslint/no-this-alias": "off",
      
      // Allow apostrophes in JSX
      "react/no-unescaped-entities": "off",
      
      // Allow sync scripts
      "@next/next/no-sync-scripts": "off",
      
      // Turn off other strict rules that might break build
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/prefer-as-const": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      
      // Keep essential rules as warnings
      "no-console": "warn",
      "no-debugger": "warn",
      "no-alert": "warn",
    },
  },
];

export default eslintConfig;