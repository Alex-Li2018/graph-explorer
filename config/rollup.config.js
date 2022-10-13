import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';

import pkg from '../package.json';
const babelRuntimeVersion = pkg.peerDependencies['@babel/runtime'].replace(
  /^[^0-9]*/,
  '',
);
const extensions = ['.ts'];
const noDeclarationFiles = {
  compilerOptions: {
    declaration: false,
  },
};
// 生成external配置
const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`);
  return (id) => pattern.test(id);
};

export default [
  //Commonjs
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.js',
      format: 'cjs',
      indent: false,
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
      nodeResolve({ extensions }),
      typescript({
        useTsconfigDeclarationDir: true,
      }),
      babel({
        extensions,
        plugins: [
          ['@babel/plugin-transform-runtime', { version: babelRuntimeVersion }],
        ],
        babelHelpers: 'runtime',
      }),
    ],
  },
  // ES
  {
    // 入口文件
    input: 'src/index.ts',
    // 输出文件 es 无缩进
    output: { file: 'es/index.js', format: 'es', indent: false },
    // 外部扩展，不打包
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    // 插件
    // 一些插件重复功能
    // ts路径解析(nodeResolve(extensions)/typescript/babel(extensions))
    // ts转js typescript/babel
    plugins: [
      // rollup路径解析
      nodeResolve({
        extensions,
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        // 转译目标文件
        extensions,
        plugins: [
          [
            '@babel/plugin-transform-runtime',
            { version: babelRuntimeVersion, useESModules: true },
          ],
        ],
        //babelHelpers
        //runtime:使用Rollup构建库时常用，它必须与@babel/plugin-transform-runtime结合使用，你还应该指定@babel/runtime作为你的包的依赖。目标是es/cjs时，应该配置@babel/runtime为扩展依赖，也可以按需指定依赖如：@babel/runtime/helpers/get，Rollup将只排除完全匹配字符串的模块。
        //bundled:helpers打包进产物中
        //external:与@babel/plugin-external-helpers结合使用。从全局babelHelpers对象中引用helpers
        //inline:babel默认配置，每个独立文件中插入helpers，会导致严重的代码重复
        babelHelpers: 'runtime',
      }),
    ],
  },
];
