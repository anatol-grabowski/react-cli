import Debug from 'debug';
import { write } from './filesys';
const { updateComponent, updateStyle, updateIndex, } = require('./replacers');
const debug = Debug('rs-cli');
function writeSources(opts) {
    const { componentPath, styleModulePath, indexPath, componentSource, styleModuleSource, indexSource, componentOutSource, styleModuleOutSource, indexOutSource, } = opts;
    write(componentPath, componentOutSource, componentSource);
    write(styleModulePath, styleModuleOutSource, styleModuleSource);
    write(indexPath, indexOutSource, indexSource);
}
export function run(opts) {
    const { doCreateComponent, doCreateStyleModule, doAddToIndex, } = opts;
    if (doCreateComponent)
        updateComponent(opts);
    if (doCreateStyleModule)
        updateStyle(opts);
    if (doAddToIndex)
        updateIndex(opts);
    writeSources(opts);
}
