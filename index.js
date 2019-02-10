#!/usr/bin/env node

const commander = require('commander')
const path = require('path')
const fs = require('fs')
const packageJson = require('./package.json')
const { run } = require('./lib/react-cli')

const program = commander
  .version(packageJson.version)
  .option('-f, --func', 'create/convert to functional component')
  .option('-c, --class', 'create/convert to class component')
  .option('-s, --style', 'create style module and add to component')
  // .option('-p, --prop-types', 'find props used in render and add propTypes for them')
  .option('-i, --index', 'add component export to index.js in its directory')
  // .option('-S, --story', 'create storybook story for the component')
  .arguments('<path>')

const componentExt = '.js'
const styleModuleExt = '.module.scss'
const indexName = 'index.js'
const samplesDirPath = path.join(__dirname, 'samples')
const samplesPathes = {
  func: 'FunctionalComponent.js',
  class: 'ClassComponent.js',
  style: 'Styles.module.scss',
  index: 'index.js',
}
const samples = {
  functionalComponentSample: fs.readFileSync(path.join(samplesDirPath, samplesPathes.func)).toString(),
  classComponentSample: fs.readFileSync(path.join(samplesDirPath, samplesPathes.class)).toString(),
  styleModuleSample: fs.readFileSync(path.join(samplesDirPath, samplesPathes.style)).toString(),
  indexSample: fs.readFileSync(path.join(samplesDirPath, samplesPathes.index)).toString(),
}

function validateName(opts) {
  const { doCreateComponent, name } = opts
  if (!doCreateComponent) return true
  const reValidname = /^[A-Z]/
  const isValidname = reValidname.test(name)
  return isValidname
}

function getOptions(argv) {
  const options = program.parse(argv)
  if (options.args.length === 0) program.help()
  if (options.func && options.class) {
    console.error('--func and --class options are mutually exclusive')
    return
  }
  const filepath = options.args[0]
  const dirname = path.dirname(filepath)
  const name = path.basename(filepath)
  const componentPath = path.join(dirname, name + componentExt)
  const styleModulePath = path.join(dirname, name + styleModuleExt)
  const indexPath = path.join(dirname, indexName)
  const doesComponentExist = fs.existsSync(componentPath)
  const doesStyleModuleExist = fs.existsSync(styleModulePath)
  const doesIndexExist = fs.existsSync(indexPath)
  const componentSource = doesComponentExist ? fs.readFileSync(componentPath).toString() : null
  const styleModuleSource = doesStyleModuleExist ? fs.readFileSync(styleModulePath).toString() : null
  const indexSource = doesIndexExist ? fs.readFileSync(indexPath).toString() : null

  const opts = {
    doCreateComponent: options.func || options.class || false,
    doCreateFunctionalComponent: options.func || false,
    doCreateClassComponent: options.class || false,
    doCreateStyleModule: options.style || false,
    doAddToIndex: options.index || false,
    doCreateStory: options.story || false,
    name,
    componentPath,
    styleModulePath,
    indexPath,
    componentSource,
    styleModuleSource,
    indexSource,
    ...samples,
  }
  const isValidname = validateName(opts)
  if (!isValidname) {
    console.error('Invalid component name:', name)
    return
  }
  return opts
}

const opts = getOptions(process.argv)
if (!opts) process.exit(1)
console.log(opts)
run(opts)