const esprima = require('esprima')
const path = require('path')
const { findImport } = require('./parse-tools')

function createStyle(opts) {
  const {
    name,
    styleModuleSample,
  } = opts
  let styleModuleOutSource
  styleModuleOutSource = styleModuleSample
  const rootClassName = styleModuleOutSource.match(/.\w*/)[0]
  const reRootClassName = RegExp(rootClassName, 'g')
  styleModuleOutSource = styleModuleOutSource.replace(reRootClassName, `.${name}`)
  opts.styleModuleOutSource = styleModuleOutSource
}

function attachStyle(opts) {
  const {
    styleModulePath,
    useSemicolons,
  } = opts
  let componentOutSource = opts.componentOutSource || opts.componentSource
  if (!componentOutSource) return
  const tree = esprima.parseModule(componentOutSource, { jsx: true, range: true, comment: true })
  const imports = tree.body.filter(node => node.type === 'ImportDeclaration')
  const filename = path.basename(styleModulePath)
  const importSource = `./${filename}`
  const { importDeclaration } = findImport(imports, 'styles')
  if (importDeclaration) {
    const location = importDeclaration.source.value
    if (location !== importSource) console.log(`Component already has 'styles' imported from '${location}'.`)
    return
  }
  const insertPos = imports[imports.length - 1].range[1]
  const before = componentOutSource.substring(0, insertPos)
  const after = componentOutSource.substring(insertPos)
  const importStr = `\nimport styles from '${importSource}'` + (useSemicolons ? ';' : '')
  componentOutSource = before + importStr + after
  opts.componentOutSource = componentOutSource
}

function updateStyle(opts) {
  const {
    doCreateStyleModule,
    name,
    styleModuleSource,
    styleModuleSample,
  } = opts
  if (!doCreateStyleModule) return
  if (!styleModuleSource) createStyle(opts)
  else opts.styleModuleOutSource = styleModuleSource
  attachStyle(opts)
}

module.exports.updateStyle = updateStyle