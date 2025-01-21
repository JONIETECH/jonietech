const terser = require('terser');
const CleanCSS = require('clean-css');
const fs = require('fs');
const path = require('path');

// Minify JavaScript
async function minifyJS(inputPath, outputPath) {
    const code = fs.readFileSync(inputPath, 'utf8');
    const minified = await terser.minify(code);
    fs.writeFileSync(outputPath, minified.code);
}

// Minify CSS
function minifyCSS(inputPath, outputPath) {
    const css = fs.readFileSync(inputPath, 'utf8');
    const minified = new CleanCSS().minify(css);
    fs.writeFileSync(outputPath, minified.styles);
}

// Process all JS files
const jsDir = path.join(__dirname, 'assets/js');
fs.readdirSync(jsDir).forEach(file => {
    if (file.endsWith('.js')) {
        minifyJS(
            path.join(jsDir, file),
            path.join(jsDir, `${file.replace('.js', '.min.js')}`)
        );
    }
});

// Process all CSS files
const cssDir = path.join(__dirname, 'assets/css');
fs.readdirSync(cssDir).forEach(file => {
    if (file.endsWith('.css')) {
        minifyCSS(
            path.join(cssDir, file),
            path.join(cssDir, `${file.replace('.css', '.min.css')}`)
        );
    }
}); 