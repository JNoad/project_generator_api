function compileTemplate(template, data) {
    for (const key in data) {
        let str = `/* \$${key} */`
        console.log(str, data[key])
        template = template.replaceAll(`/* \$${key} */`, `'${data[key]}'`);
    };
    return template;
};

module.exports = {
    compileTemplate,
}