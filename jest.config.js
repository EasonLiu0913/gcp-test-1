const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // 指向 Next.js 應用的路徑
  dir: './',
})

// Jest 的自定義配置
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'node',
  moduleNameMapper: {
    // 處理路徑別名
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    // 使用 babel-jest 處理 js/jsx 文件
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
}

// createJestConfig 會將 Next.js 的設定和自定義設定合併
module.exports = createJestConfig(customJestConfig)