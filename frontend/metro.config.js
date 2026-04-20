// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// ────────────────────────────────────────────────────────────────────
// FIX: "Cannot use 'import.meta' outside a module"
//
// Zustand v5 ships ESM files (.mjs) that use `import.meta.env.MODE`.
// Metro Web picks these via the "import" condition in package.json exports,
// but Metro's parser does NOT support `import.meta` syntax.
//
// Solution: Remove '.mjs' from the resolver extensions so Metro resolves
// to the CJS (.js) files instead, which use `process.env.NODE_ENV`.
// ────────────────────────────────────────────────────────────────────
config.resolver.sourceExts = config.resolver.sourceExts.filter(
  (ext) => ext !== 'mjs'
);

module.exports = config;
