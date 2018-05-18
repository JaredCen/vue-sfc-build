function assemble(opts) {
    const script = opts.script || {
        source: 'export default {}'
    };
    const template = opts.template || {
        source: ''
    };
    const inlineNormalizeComponent = `
function __vue_normalize__(script, template) {
    if (!script.render) {
        script.render = template.render;
        script.staticRenderFns = template.staticRenderFns;
        script._compiled = true;
        if (functional) script.functional = true;
    }
    return script;
}
    `;
    let cssImport = '';
    const styles = opts.styles
        .filter(style => style.source)
        .map((style, index, arr) => {
            let filename = opts.filename.replace('vue', 'css'); 
            if (arr.length > 1) {
                filename = filename.replace(/\.css$/, `_${index + 1}.css`);
            }
            cssImport += `import './${filename}';\n`;
            return {
                code: style.source,
                filename,
            }
        });

    const code = `
/* style */
${cssImport}
/* script */
${script.source.replace(/export default/, 'const __vue_script__ =')}
/* template */
${template.source
    .replace('var render =', 'var __vue_render__ =')
    .replace('var staticRenderFns =', 'var __vue_staticRenderFns__ =')
    .replace('render._withStripped =', '__vue_render__._withStripped =')}
const __vue_template__ = typeof __vue_render__ !== 'undefined' 
    ? {
        render: __vue_render__,
        staticRenderFns: __vue_staticRenderFns__
    } 
    : {};

${inlineNormalizeComponent}

export default __vue_normalize__(
    typeof __vue_script__ !== 'undefined' ? __vue_script__ : {}, 
    __vue_template__
);
    `;

    return { 
        code,
        styles,
    };
}

module.exports = function(result, filename) {
    return assemble({
        filename,
        script: result.script && {
            source: result.script.code
        },
        template: result.template && {
            source: result.template.code,
            functional: result.template.functional
        },
        styles: result.styles.map(style => {
            if (style.errors.length) console.error(style.errors);
            return {
                source: style.code,
            };
        })
    });
};
