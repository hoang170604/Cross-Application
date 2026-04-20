module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Transpile `import.meta.env` → `process.env` so Metro Web can bundle
      // ESM-only packages like zustand/esm/middleware.mjs without SyntaxError.
      'babel-plugin-transform-import-meta',
    ],
  };
};
