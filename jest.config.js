module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    // transform files with ts-jest
    "^.+\\.(js|ts)$": "ts-jest",
  },
  transformIgnorePatterns: [
    // allow lit-html transformation
    "node_modules/(?!lit-html)",
  ],
  globals: {
    "ts-jest": {
      tsconfig: {
        // allow js in typescript
        allowJs: true,
      },
    },
  },
};