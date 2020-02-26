'use strict';

/*
 * Require the fs node module
 */
const fs = require('fs');

/*
 * Require the path module
 */
const path = require('path');

/*
 * Require the node-sass module
 */
const sass = require('node-sass');

/*
 * Require the project package info
 */
const pkg = require('../package.json');
const banner = [
    '/**',
    ` * ${pkg.name} - ${pkg.description}`,
    ` * @version v${pkg.version}`,
    ` * @homepage ${pkg.homepage}`,
    ' * @copyright ' + new Date().getFullYear() + ` ${pkg.author.name} `,
    ` * @license ${pkg.license}`,
    ' */',
    '\n'
].join('\n');

/*
 * Set the UI Library root path
 */
const uiLibRoot = process.cwd();

/*
 * Require the Fractal module
 */
const fractal = module.exports = require('@frctl/fractal').create();

fractal.cli.log(banner)

/*
 * Give your project a title.
 */
fractal.set('project.title', pkg.name);

/*
 * Other project metadata.
 */
fractal.set('project.version', pkg.version);
fractal.set('project.repository', pkg.homepage);
fractal.set('project.author', pkg.author.name);

/*
 * Configuring engine used by components
 *
 * Components use Handlebars templates by default, so this step normally not required.
 * However in this example we are expicitly loading the handlebars adapter
 * to demonstrate how to add custom Handlebars helpers that you can then use
 * in your components.
 *
 * See https://github.com/frctl/handlebars for more information on the Handlebars
 * adapter and bundled helpers.
 */

/*
 * Using Handlebars(Mustache based template with logic) as default template engine
 * is not recommended because implementation need steep learning curve as their
 * documentation is being rebuild.
 * While using jade/pug is not recommended for their complex flow of processing generated data
 * /parsing file as programmatic or dynamic content. https://github.com/pugjs/pug/issues/3012
 * Below the list of alternative template engine:
 * https://docs.djangoproject.com/en/2.2/ref/templates/language/ => @frctl/consolidate
 * https://palletsprojects.com/p/jinja/ => @frctl/consolidate
 * https://mozilla.github.io/nunjucks/ => @frctl/nunjucks
 * https://twig.symfony.com/pdf/3.x/ => @frctl/twig
 */

/*
 * Require the Twig adapter
 * Reference: https://github.com/twigjs/twig.js/wiki/Implementation-Notes
 */

const twigAdapter = require('@frctl/twig')();

fractal.components.engine(twigAdapter);
fractal.components.set('ext', '.twig');
/*
 * Tell Fractal where to look for components.
 */
fractal.components.set('path', uiLibRoot + '/src/components');

/*
 * Define Default Status for components.
 */
fractal.components.set('default.status', 'wip');

/*
 * Define potential Statuses for components.
 */
fractal.components.set('statuses', {
    prototype: {
        label: 'Prototype',
        description: 'Do not implement',
        color: '#D0021B'
    },
    wip: {
        label: 'WIP',
        description: 'Work in progress. Implement with caution',
        color: '#F56513'
    },
    ready: {
        label: 'Ready',
        description: 'Ready to implement',
        color: '#2ECC40'
    },
    exported: {
        label: 'Live',
        description: 'Applied to the working project',
        color: '#4B89C8'
    },
    deprecated: {
        label: 'Deprecated',
        description: 'No longer in use.',
        color: '#646464'
    }
});

/*
 * Tell Fractal where to look for documentation pages.
 */
fractal.docs.set('path', uiLibRoot + '/src/docs');

/*
 * Define Default Status for documentation pages.
 */
fractal.docs.set('default.status', 'draft');

/*
 * Define potential Statuses for documentation pages.
 */
fractal.docs.set('statuses', {
    draft: {
        label: 'Draft',
        description: 'This documentation is not complete',
        color: '#FF4136'
    },
    published: {
        label: 'Complete',
        description: 'Documentation complete',
        color: '#01FF70'
    }
});

/*
 * Tell the Fractal web preview plugin where to look for static assets.
 */
fractal.web.set('static.path', uiLibRoot + '/dist');
/*
 * Tell the Fractal web preview plugin where to put for static assets.
 */
fractal.web.set('static.mount', '/assets');

/*
 * Set the static HTML build destination. This can be used to export the
 * web UI view into static HTML files, which can quickly and easily be shared
 * with clients or hosted using a simple static file server.
 */
fractal.web.set('builder.dest', uiLibRoot + '/build');


/*
* Fractal Export Command
––––––––––––––––––––––––––––––––––––––––––––––––––
*/

/*
 * Exports all view templates into a directory in the root of the project.
 * Templates are exported in a flat structure with the filenames in the format of {handle}.{ext}
 *
 * Any @handle references in the templates (for partial includes etc) are re-written
 * to reference the appropriate template path.
 *
 * Run by using the command `fractal export` in the root of the project directory.
 */
function exportTemplates(args, done) {

    const app = this.fractal;
    const items = app.components.flattenDeep().toArray();
    const jobs = [];

    for (const item of items) {

        const exportPath = path.join('dist', args.options.output || 'twig', `${item.handle || item.alias}${app.get('components.ext')}`);

        fractal.cli.log(`Exporting ${item.handle || item.alias} to ${path.join('dist', args.options.output || 'twig')}`);

        if (!fs.existsSync(path.join('dist', args.options.output || 'twig'))) {
            fs.mkdirSync(path.join('dist', args.options.output || 'twig'));
        }

        if (item.status.label === 'Live') {
            const job = item.getContent()
                .then(str => {
                    return str.replace(/@([0-9a-zA-Z\-_]*)/g, (match, handle) => {
                        return `${handle}${app.get('components.ext')}`;
                    });
                })
                .then(str => {
                    return fs.writeFileSync(exportPath, str);
                });
            jobs.push(job);
        }

    }

    return Promise.all(jobs);
}

fractal.cli.command('export', exportTemplates, {
    description: 'Export all component templates',
    options: [
        ['-o, --output <output-dir>', 'The directory to export components into, relative to the CWD.'],
    ]
});

// This function watch component collection in their respective directory
fractal.on('source:loaded', source => {
    fractal.cli.log(`directory ${source._config.path} has been loaded`);
});

fractal.on('source:changed', (source, eventData) => {
    // fractal.cli.log(`Change in ${source.name} directory from ${source.relPath}`);
    // console.warn(source);
    if (eventData.isResource) {
        fractal.cli.warn(`${eventData.event} detected in ${eventData.path}`)
        const ins = eventData.path;
        const out = eventData.path.replace(/.scss$/, '.css');
        const PATTERNS = /\/[a-z-]+\.scss$/;
        // console.assert(ins.match(PATTERNS));
        // console.warn(ins.substr(-4)); // scss
        // console.info(out);
        // console.info(ins);
        // console.info(out);
        if (ins.match(PATTERNS) !== null) {
            sass.render({
                file: ins,
                precision: 3,
                outputStyle: 'expanded',
                outFile: out,
                sourceMap: true, // or an absolute or relative (to outFile) path
                // sourceMapEmbed: true,
                // sourceMapContents: true,
                sourceComments: true
            }, (error, result) => { // node-style callback from v3.0.0 onwards
                if (error) {
                    /**
                     *  Error Object
                     *    1. message (String) - The error message.
                     *    2. line (Number) - The line number of error.
                     *    3. column (Number) - The column number of error.
                     *    4. status (Number) - The status code.
                     *    5. file (String) - The filename of error. In case file option was not set (in favour of data), this will reflect the value stdin.
                     */
                    //   fractal.cli.log(error.status); // used to be 'code' in v2x and below
                    //   fractal.cli.log(error.line);
                    //   fractal.cli.log(error.column);
                    //   fractal.cli.error(error.message);
                    fractal.cli.error(error.formatted);
                } else {
                    /**
                     *  Result Object
                     *    1. css (Buffer) - The compiled CSS. Write this to a file, or serve it out as needed.
                     *    2. map (Buffer) - The source map
                     *    3. stats (Object) - An object containing information about the compile. It contains the following keys:
                     *    4. entry (String) - The path to the scss file, or data if the source was not a file
                     *    5. start (Number) - Date.now() before the compilation
                     *    6. end (Number) - Date.now() after the compilation
                     *    7. duration (Number) - end - start
                     *    8. includedFiles (Array) - Absolute paths to all related scss files in no particular order.
                     */

                    fs.writeFile(out, result.css, err => {
                        if (err) {
                            fractal.cli.error(err)
                        } else {
                            fractal.cli.success(`Write ${out} file succeed!`)
                        }
                    });

                    fs.writeFile(`${out}.map`, JSON.stringify(result.map), err => {
                        if (err) {
                            fractal.cli.error(err)
                        } else {
                            fractal.cli.success(`Write ${out}.map file succeed!`)
                        }
                    });

                    //   fractal.cli.log(result.map)
                    //   fractal.cli.log(result.css.toString());
                    //   fractal.cli.log(result.stats);
                    //   fractal.cli.log(result.map.toString());
                    //   fractal.cli.log(JSON.stringify(result.map)); 
                    //   or better with note, JSON.stringify accepts Buffer too
                }
            })
        }
    } else {
        fractal.cli.warn(`${eventData.event} detected in ${eventData.path}`)
    }
})

/**
 * Change at-rule import to at-rule use or at-rule forward
 * https://sass-lang.com/blog/the-module-system-is-launched
 */  

fractal.on('source:updated', (source, eventData) => {
    const PATTERN = /^[a-z-]*.scss$/;
    const input = uiLibRoot + '/src/scss';
    const data = source._monitor._watched;
    const file = `${input}/components.scss`;
    const output = uiLibRoot + '/dist/css/components.css'

    if (eventData.event === 'change' && eventData.path.slice(-4) === 'scss') {
        let content = [];
        for (let [key, value] of Object.entries(data)) {
            const item = value._items;
            Object.keys(item)
                .filter(str => PATTERN.test(str))
                .sort((a, b) => a.length - b.length)
                .map(element => content.push(`@import "../${key.split('src/').pop()}/${element}";`))
        }
        fs.writeFileSync(file, content.join('\n') + '\n')
        sass.render({
            file: file,
            precision: 3,
            outputStyle: 'expanded',
            outFile: output,
            sourceMap: true, // or an absolute or relative (to outFile) path
            // sourceMapEmbed: true,
            // sourceMapContents: true,
            sourceComments: true
        }, (error, result) => { // node-style callback from v3.0.0 onwards
            if (error) {
                /**
                 *  Error Object
                 *    1. message (String) - The error message.
                 *    2. line (Number) - The line number of error.
                 *    3. column (Number) - The column number of error.
                 *    4. status (Number) - The status code.
                 *    5. file (String) - The filename of error. In case file option was not set (in favour of data), this will reflect the value stdin.
                 */
                //   fractal.cli.log(error.status); // used to be 'code' in v2x and below
                //   fractal.cli.log(error.line);
                //   fractal.cli.log(error.column);
                //   fractal.cli.error(error.message);
                fractal.cli.error(error.formatted);
            } else {
                /**
                 *  Result Object
                 *    1. css (Buffer) - The compiled CSS. Write this to a file, or serve it out as needed.
                 *    2. map (Buffer) - The source map
                 *    3. stats (Object) - An object containing information about the compile. It contains the following keys:
                 *    4. entry (String) - The path to the scss file, or data if the source was not a file
                 *    5. start (Number) - Date.now() before the compilation
                 *    6. end (Number) - Date.now() after the compilation
                 *    7. duration (Number) - end - start
                 *    8. includedFiles (Array) - Absolute paths to all related scss files in no particular order.
                 */

                fs.writeFile(output, result.css, err => {
                    if (err) {
                        fractal.cli.error(err)
                    } else {                        
                        fractal.cli.success(`Write ${output} file succeed!`)
                    }
                });

                fs.writeFile(output+'.map', JSON.stringify(result.map), err => {
                    if (err) {
                        fractal.cli.error(err)
                    } else {
                        fractal.cli.success('Write '+output+'.map file succeed!')
                    }
                });

                //   fractal.cli.log(result.map)
                //   fractal.cli.log(result.css.toString());
                //   fractal.cli.log(result.stats);
                //   fractal.cli.log(result.map.toString());
                //   fractal.cli.log(JSON.stringify(result.map));
                //   or better with note, JSON.stringify accepts Buffer too
            }
        })
    } else {
        fractal.cli.log(`${source.name} at ${source.relPath} has been updated`);
    }
});

/*
* Fractal List Command
––––––––––––––––––––––––––––––––––––––––––––––––––
 */

function listComponents(args, done) {
    const app = this.fractal;
    for (let item of app.components.flatten()) {
        this.log(`${item.handle} - ${item.status.label} - ${item.config.dir}`);
    }
    done();
}

fractal.cli.command('list', listComponents, {
    description: 'Lists components in the project'
});

/*
* Fractal Web UI Theme
––––––––––––––––––––––––––––––––––––––––––––––––––
 */

/*
 * Require the Mono subtheme module built upon the default Mandelbrot theme
 * Run npm install --save mono within your project directory
 * before you can require() it.
 */

const webUITheme = require('mono-fractal')({
    favicon: "/assets/favicons/favicon.ico",
    lang: "en",
    panels: ['html', 'resources', 'info'],
    nav: ['search', 'components', 'docs'],
    styles: ['/assets/webui-overrides/overrides.css', '/assets/css/core.css', '/assets/css/components.css'],
    scripts: ['/assets/js/copy.js', '/assets/js/search.js', '/assets/js/sidebar.js', '/assets/js/popper.js', '/assets/js/bs.js']
});

/*
 * Specify assets to show in templates
 * See https://github.com/frctl/mandelbrot/tree/master/views for examples of default settings
 */
fractal.components.set('resources', {
    scss: {
        label: 'SCSS',
        match: ['**\/*.scss']
    },
        css: {
        label: 'CSS',
        match: ['**/*.css']
    },
    other: {
        label: 'Other Assets',
        match: ['**/*', '!**/*.scss', '!**.css']    }
});

/*
 * Specify a directory to hold the theme override templates
 * See https://github.com/frctl/mandelbrot/tree/master/views for examples of default templates
 */
webUITheme.addLoadPath(uiLibRoot + '/src/webui-overrides');

/*
 * Tell Fractal to use the configured theme by default
 */
fractal.web.theme(webUITheme);
