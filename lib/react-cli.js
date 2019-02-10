const commander = require('commander')
const path = require('path')
const fs = require('fs')
const Debug = require('debug')
const packageJson = require('../package.json')

const debug = Debug('rs-cli')

const program = commander
  .version(packageJson.version)
  .option('-f, --func', 'create functional component')
  .option('-c, --class', 'create class component')
  .option('-s, --style', 'create style module')
  .option('-i, --index', 'add to index.js in the parent directory')
  .option('-S, --story', 'create storybook story')
  .arguments('<path>')

const sample = {
  func: 'FunctionalComponent.js',
  class: 'ClassComponent.js',
  style: 'Styles.module.scss',
}
const cmpExtension = '.js'
const scssModExtension = '.module.scss'

function readSample(name) {
  const samplesPath = path.join(__dirname, '..', 'samples')
  const filepath = path.join(samplesPath, name)
  const sample = fs.readFileSync(filepath).toString()
  return sample
}

function applyReplacements(str, replacements) {
  let result = str
  replacements.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, replacement)
  })
  return result
}

function createFunctionalComponent(opts) {
  const { dirname, name } = opts
  debug('creating func comp', dirname, name)
  const origSource = readSample(sample.func)
  const replacements = [
    [/FunctionalComponent/g, name],
  ]
  const source = applyReplacements(origSource, replacements)
  debug(source)
  const destPath = path.join(dirname, name + cmpExtension)
  fs.writeFileSync(destPath, source)
}

function createClassComponent(opts) {
  const { dirname, name } = opts
  debug('creating class comp', dirname, name)
  const origSource = readSample(sample.class)
  const replacements = [
    [/ClassComponent/g, name],
  ]
  const source = applyReplacements(origSource, replacements)
  debug(source)
  const destPath = path.join(dirname, name + cmpExtension)
  fs.writeFileSync(destPath, source)
}

function promoteToClassComponent(opts) {
  const { dirname, name } = opts
  const filepath = path.join(dirname, name + cmpExtension)
  const orig = fs.readFileSync(filepath).toString()
  const reInFunc = RegExp(`function ${name}(props) {}`)
  const replacements = [
    [`function ${name}(props)`, `class ${name} extends React.Component`],

  ]
  const source = applyReplacements(orig, replacements)
  fs.writeFileSync(filepath, source)
}

function createOrPromoteToClassComponent(opts) {
  const { dirname, name } = opts
  const filepath = path.join(dirname, name + cmpExtension)
  const exists = fs.existsSync(filepath)
  if (exists) {
    promoteToClassComponent(opts)
    return
  }
  createClassComponent(opts)
}

function attachStyle(opts) {
  const { dirname, name } = opts
  const filepath = path.join(dirname, name + cmpExtension)
  const exists = fs.existsSync(filepath)
  if (!exists) return
  const orig = fs.readFileSync(filepath).toString()
  const replacements = [
    ['\n\n', `\nimport styles from './${name + scssModExtension}'\n\n`],
    ['<div>', `<div className={styles.${name}}>`],
  ]
  const out = applyReplacements(orig, replacements)
  fs.writeFileSync(filepath, out)
}

function createStyle(opts) {
  const { dirname, name } = opts
  const origSource = readSample(sample.style)
  const styleNameRe = RegExp('Wrapper', 'g')
  const replacements = [
    [styleNameRe, name],
  ]
  const source = applyReplacements(origSource, replacements)
  const destPath = path.join(dirname, name + scssModExtension)
  fs.writeFileSync(destPath, source)
  attachStyle(opts)
}

function validatename(opts) {
  const { component, name } = opts
  if (!component) return true
  const reValidname = /^[A-Z]/
  const isValidname = reValidname.test(name)
  return isValidname
}

function run(argv) {
  const options = program.parse(argv)
  const filepath = options.args[0]
  const dirname = path.dirname(filepath)
  const name = path.basename(filepath)
  const opts = {
    func: options.func,
    class: options.class,
    style: options.style,
    component: options.func || options.class,
    index: options.index,
    story: options.story,
    name,
    dirname,
  }
  const isValidname = validatename(opts)
  if (!isValidname) {
    console.log('invalid component name')
    return
  }
  if (opts.func) createFunctionalComponent(opts)
  if (opts.style) createStyle(opts)
  if (opts.class) createOrPromoteToClassComponent(opts)
}

exports.run = run