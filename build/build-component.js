const fs = require('fs');
const path = require('path');
const { transform } = require('babel-core'); 
const { createDefaultCompiler } = require('@vue/component-compiler');
const assemble = require('./assemble');

const compiler = createDefaultCompiler();
const srcDir = path.resolve(__dirname, '../src');
const libDir = path.resolve(__dirname, '../dist');

const files = fs.readdirSync(srcDir);
files.forEach((filename) => {
    const file = path.resolve(srcDir, filename);
    const source = fs.readFileSync(file, 'utf-8');
    const jsOutputPath = path.resolve(libDir, filename.replace('vue', 'js'));

    const result = assemble(compiler.compileToDescriptor(filename, source), filename);
    result.styles.forEach(style => {
        const cssOutputPath = path.resolve(libDir, style.filename);
        fs.writeFileSync(cssOutputPath, style.code);
    });

    const jsResult = transform(result.code, {
        babelrc: true,
        extends: path.resolve(__dirname, '../.babelrc')
    }).code;
    fs.writeFileSync(jsOutputPath, jsResult);
});

