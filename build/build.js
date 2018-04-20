// https://github.com/chenjiahan/vue-sfc-compiler/blob/master/src/index.js
// https://www.npmjs.com/package/@vue/component-compiler-utils
// https://www.npmjs.com/package/vue-template-compiler

const fs = require('fs');
const path = require('path');
const vueCompiler1 = require('vue-template-compiler');
const vueCompiler2 = require('vue-component-compiler');

const srcDir = path.resolve(__dirname, '../src');
const libDir = path.resolve(__dirname, '../dist');

const files = fs.readdirSync(srcDir);
files.forEach((fileName) => {
    const file = path.resolve(srcDir, fileName);
    const source = fs.readFileSync(file, 'utf-8');
    const outputPath = path.resolve(libDir, fileName.replace('vue', 'js'));
    fs.writeFileSync(outputPath, vueCompiler.parseComponent(source).script);
    console.log(vueCompiler.parseComponent(source).script);
});