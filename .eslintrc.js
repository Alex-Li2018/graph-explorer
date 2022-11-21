module.exports = {
  // 规则继承
  extends: [
    'plugin:@typescript-eslint/recommended',
    // 关闭和eslint冲突，配置prettier插件，相关规则预设
    'plugin:prettier/recommended',
  ],
  // 解析器
  parser: '@typescript-eslint/parser',
  // ts插件
  plugins: ['@typescript-eslint'],
  // 规则定制
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslintno-explicit-any': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all', //全部声明包括全局
        args: 'all', //一次声明全位置
        ignoreRestSiblings: true, //忽略rest
        argsIgnorePattern: '^_', //通过lint正则
        varsIgnorePattern: '^_', //通过lint正则
      },
    ],
    '@typescript-eslint/no-this-alias': 'off',
  },
};
