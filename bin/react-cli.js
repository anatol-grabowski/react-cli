#!/usr/bin/env node

const commander = require('commander')
const path = require('path')
const fs = require('fs')
const packageJson = require('../package.json')
const configPath = require('persist-path')('react-cli/config.json')
const { run } = require('../lib/tools')
const { readOptions, writeConfig } = require('../lib/config-manager')

const program = commander
  .version(packageJson.version)
program
  .description('Manage react components and related files')
  .option('-f, --func', 'create functional component or convert the existing class component to functional')
  .option('-c, --class', 'create class component or convert the existsing functional component to class')
  .option('-s, --style', 'create style module and add import to the component')
  // .option('-i, --index', 'add component export to index.js in its directory')
  // .option('-p, --prop-types', 'find props used in render and add propTypes for them')
  // .option('-S, --story', 'create storybook story for the component')
  .arguments('<Component>')
  .action((_, cmd) => {
    const opts = getOptions(cmd)
    if (!opts) return
    // console.log(opts)
    run(opts)
  })
program
  .command('config <path>') // if description is passed with the command then it is added to _execs
  .description('set directory for templates and config file; will be filled with defaults if empty')
  // .option('--copy', `copy specified config directory to '${configPath}'`)
  .action((path, cmd) => {
    const configDirectory = path
    writeConfig({ configDirectory }, configPath)
  })

program.on('--help', () => {
  console.log(`The app stores its cofiguration at '${configPath}'.`)
  console.log('')
  console.log('Examples:')
  console.log('  $ react-cli -fs src/components/views/Primitives/Button')
})


const componentExt = '.js'
const styleModuleExt = '.module.scss'
const indexName = 'index.js'
const samplesDirPath = path.join(__dirname, '..', 'templates')
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

function getOptions(options) {
  if (!options.func && !options.class && !options.style && !options.index && !options.story) {
    console.error('no options specified')
    return
  }
  if (options.func && options.class) {
    console.error('--func and --class options are mutually exclusive')
    return
  }
  // const configOptions = readOptions(configPath)
  // return
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


const parsed = program.parse(process.argv)
if (parsed.args.length === 0) program.help()