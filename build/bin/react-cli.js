#!/usr/bin/env node
import commander from 'commander';
import path from 'path';
import fs from 'fs';
// @ts-ignore
import packageJson from '../package.json';
const configPath = require('persist-path')('react-cli/config.json');
import { run } from '../lib/tools';
import { readOptions, writeConfig } from '../lib/config-manager';
const program = commander
    .version(packageJson.version);
program
    .description('Manage react components and related files')
    .option('-f, --func', 'create functional component or convert the existing class component to functional')
    .option('-c, --class', 'create class component or convert the existsing functional component to class')
    .option('-s, --style', `create style module and add 'import styles' to the component`)
    .option('-i, --index', 'add component export to index.js in its directory')
    // .option('-p, --prop-types', 'find props used in render and add propTypes for them')
    // .option('-S, --story', 'create storybook story for the component')
    .arguments('<path/Component>')
    .action((_, cmd) => {
    const opts = getOptions(cmd);
    if (!opts)
        return;
    // console.log(opts)
    run(opts);
});
program
    .command('config <path>') // if description is passed with the command then it is added to _execs
    .description('set directory for templates and config file; will be filled with defaults if empty')
    // .option('--copy', `copy specified config directory to '${configPath}'`)
    .action((dirpath, cmd) => {
    const configDirectory = path.resolve(dirpath);
    writeConfig({ configDirectory }, configPath);
});
program.on('--help', () => {
    console.log('');
    console.log(`Config location: '${configPath}'.`);
    console.log('');
    console.log('Examples:');
    console.log('  $ react-cli -fs src/components/views/Primitives/Button');
    console.log('  $ react-cli -csi src/components/views/User/UserCard');
    console.log('  $ react-cli config path/to/empty/dir/to/put/react-cli-config');
});
function validateName(opts) {
    const { doCreateComponent, name } = opts;
    if (!doCreateComponent)
        return true;
    const reValidname = /^[A-Z]/;
    const isValidname = reValidname.test(name);
    return isValidname;
}
function getOptions(options) {
    if (!options.func && !options.class && !options.style && !options.index && !options.story) {
        console.error('no options specified');
        return;
    }
    if (options.func && options.class) {
        console.error('--func and --class options are mutually exclusive');
        return;
    }
    const configOptions = readOptions(configPath);
    const { componentExtension, styleModuleExtension, useSemicolons, ...samples } = configOptions;
    const indexName = 'index.js';
    const filepath = options.args[0];
    const dirname = path.dirname(filepath);
    const name = path.basename(filepath);
    const componentPath = path.join(dirname, name + componentExtension);
    const styleModulePath = path.join(dirname, name + styleModuleExtension);
    const indexPath = path.join(dirname, indexName);
    const doesComponentExist = fs.existsSync(componentPath);
    const doesStyleModuleExist = fs.existsSync(styleModulePath);
    const doesIndexExist = fs.existsSync(indexPath);
    const componentSource = doesComponentExist ? fs.readFileSync(componentPath).toString() : null;
    const styleModuleSource = doesStyleModuleExist ? fs.readFileSync(styleModulePath).toString() : null;
    const indexSource = doesIndexExist ? fs.readFileSync(indexPath).toString() : null;
    const opts = {
        doCreateComponent: options.func || options.class || false,
        doCreateFunctionalComponent: options.func || false,
        doCreateClassComponent: options.class || false,
        doCreateStyleModule: options.style || false,
        doAddToIndex: options.index || false,
        doCreateStory: options.story || false,
        name,
        useSemicolons,
        componentPath,
        styleModulePath,
        indexPath,
        componentSource,
        styleModuleSource,
        indexSource,
        ...samples,
    };
    const isValidname = validateName(opts);
    if (!isValidname) {
        console.error('Invalid component name:', name);
        return;
    }
    return opts;
}
const parsed = program.parse(process.argv);
if (parsed.args.length === 0)
    program.help();
