const terser = require('terser');
const CleanCSS = require('clean-css');
const fs = require('fs');
const path = require('path');

// Ensure public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Copy function to handle directories recursively
function copyDirectory(source, destination) {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    const files = fs.readdirSync(source);
    files.forEach(file => {
        const sourcePath = path.join(source, file);
        const destPath = path.join(destination, file);
        
        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyDirectory(sourcePath, destPath);
        } else {
            fs.copyFileSync(sourcePath, destPath);
        }
    });
}

// Copy all static files to public directory
function copyStaticFiles() {
    // Copy HTML files
    fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(publicDir, 'index.html'));
    
    // Copy assets directory
    const assetsDir = path.join(__dirname, 'assets');
    if (fs.existsSync(assetsDir)) {
        copyDirectory(assetsDir, path.join(publicDir, 'assets'));
    }

    // Copy other necessary files
    const filesToCopy = ['robots.txt', 'sitemap.xml'];
    filesToCopy.forEach(file => {
        if (fs.existsSync(path.join(__dirname, file))) {
            fs.copyFileSync(path.join(__dirname, file), path.join(publicDir, file));
        }
    });
}

// Minify JavaScript
async function minifyJS(inputPath, outputPath) {
    try {
        const code = fs.readFileSync(inputPath, 'utf8');
        const minified = await terser.minify(code, {
            compress: true,
            mangle: true
        });
        if (minified.error) {
            console.error(`Error minifying ${inputPath}:`, minified.error);
            return;
        }
        fs.writeFileSync(outputPath, minified.code);
        console.log(`Successfully minified ${inputPath} -> ${outputPath}`);
    } catch (error) {
        console.error(`Error processing ${inputPath}:`, error);
    }
}

// Minify CSS
function minifyCSS(inputPath, outputPath) {
    try {
        const css = fs.readFileSync(inputPath, 'utf8');
        const minified = new CleanCSS({
            level: 2,
            compatibility: '*'
        }).minify(css);
        
        if (minified.errors.length > 0) {
            console.error(`Error minifying ${inputPath}:`, minified.errors);
            return;
        }
        
        fs.writeFileSync(outputPath, minified.styles);
        console.log(`Successfully minified ${inputPath} -> ${outputPath}`);
    } catch (error) {
        console.error(`Error processing ${inputPath}:`, error);
    }
}

// Ensure directories exist
function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    fs.mkdirSync(dirname, { recursive: true });
}

// Process all JS files
const jsDir = path.join(publicDir, 'assets/js');
try {
    if (fs.existsSync(jsDir)) {
        fs.readdirSync(jsDir).forEach(file => {
            if (file.endsWith('.js') && !file.endsWith('.min.js')) {
                const inputPath = path.join(jsDir, file);
                const outputPath = path.join(jsDir, `${file.replace('.js', '.min.js')}`);
                ensureDirectoryExistence(outputPath);
                minifyJS(inputPath, outputPath);
            }
        });
    } else {
        console.log('JS directory not found:', jsDir);
    }
} catch (error) {
    console.error('Error processing JS files:', error);
}

// Process all CSS files
const cssDir = path.join(publicDir, 'assets/css');
try {
    if (fs.existsSync(cssDir)) {
        fs.readdirSync(cssDir).forEach(file => {
            if (file.endsWith('.css') && !file.endsWith('.min.css')) {
                const inputPath = path.join(cssDir, file);
                const outputPath = path.join(cssDir, `${file.replace('.css', '.min.css')}`);
                ensureDirectoryExistence(outputPath);
                minifyCSS(inputPath, outputPath);
            }
        });
    } else {
        console.log('CSS directory not found:', cssDir);
    }
} catch (error) {
    console.error('Error processing CSS files:', error);
}

// Execute the build process
console.log('Starting build process...');
copyStaticFiles();
console.log('Build process completed!'); 