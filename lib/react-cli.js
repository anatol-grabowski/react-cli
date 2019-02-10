const path = require('path')
const fs = require('fs')
const Debug = require('debug')
const esprima = require('esprima')
const assert = require('assert')

const debug = Debug('rs-cli')

function applyReplacements(str, replacements) {
  let result = str
  replacements.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, replacement)
  })
  return result
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

function parseComponent(source) {
  const tree = esprima.parseModule(source, { jsx: true, range: true, comment: true })
  const expDecl = tree.body.find(node => node.type === 'ExportDefaultDeclaration')
  assert(expDecl, 'Did not found export default')
  const isClassComponent = expDecl.declaration.type === 'ClassDeclaration'
  const isFunctionalComponent = expDecl.declaration.type === 'FunctionDeclaration'
  assert(isClassComponent || isFunctionalComponent, `Expected export default to be a ClassDeclaration or a FunctionDeclaration but found ${expDecl.declaration.type}`)
  const cmpDecl = expDecl.declaration
  const beforeComponent = source.substring(0, cmpDecl.range[0])
  const component = source.substring(...cmpDecl.range)
  const afterComponent = source.substring(cmpDecl.range[1])
  return {
    isClassComponent,
    isFunctionalComponent,
    beforeComponent,
    component,
    afterComponent,
    name: cmpDecl.id.name,
  }
}

function convertToClassComponent(source) {
  const tree = esprima.parseModule(source, { jsx: true, range: true, comment: true }).body[0]
  const name = tree.id.name
  const propsParam = tree.params.length ? tree.params[0].name : null
  const render = tree.body
  let body = source.substring(...render.range)
  const rePropsParam = RegExp(`(\\W)${propsParam}(\\W)`, 'g')
  body = body.replace(rePropsParam, '$1this.props$2')
  body = 'render() ' + body
  body = body.replace(/^/gm, '  ')
  const clas = `class ${name} extends React.Component {\n${body}\n}`
  return clas
}

function convertToFunctionalComponent(source) {
  const tree = esprima.parseModule(source, { jsx: true, range: true, comment: true }).body[0]
  const name = tree.id.name
  const render = tree.body.body.find(node => node.type === 'MethodDefinition' && node.key.name === 'render')
  let body = source.substring(...render.value.body.range)
  body = body.replace(/^  /gm, '')
  body = body.replace(/(\W)this./g, '$1')
  const func = `function ${name}(props) ${body}`
  return func
}

function updateComponent(opts) {
  const {
    doCreateComponent,
    doCreateFunctionalComponent,
    doCreateClassComponent,
    name,
    componentSource,
    functionalComponentSample,
    classComponentSample,
  } = opts
  if (!doCreateComponent) return
  let componentOutSource = componentSource
  if (!componentOutSource) {
    componentOutSource = doCreateFunctionalComponent
      ? functionalComponentSample || classComponentSample
      : classComponentSample || functionalComponentSample
  }
  const parsed = parseComponent(componentOutSource)
  const {
    isFunctionalComponent,
    isClassComponent,
    beforeComponent,
    afterComponent,
    name: origName,
  } = parsed
  let { component } = parsed
  if (isFunctionalComponent && doCreateClassComponent) {
    component = convertToClassComponent(component)
  }
  if (isClassComponent && doCreateFunctionalComponent) {
    component = convertToFunctionalComponent(component)
  }
  componentOutSource = beforeComponent + component + afterComponent
  const reName = RegExp(origName, 'g')
  componentOutSource = componentOutSource.replace(reName, name)
  opts.componentOutSource = componentOutSource
}

function findImport(imports, name) {
  let importSpecifier = null
  const importDeclaration = imports.find(imp => {
    return imp.specifiers.find(spec => {
      if (spec.local.name !== name) return false
      importSpecifier = spec
      return true
    })
  })
  return { importDeclaration, importSpecifier }
}

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
  const importStr = `\nimport styles from '${importSource}'`
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

function findExport(exps, name) {
  let exportSpecifier = null
  const exportDeclaration = exps.find(exp => {
    if (exp.declaration) {
      const expName = exp.declaration.id.name
      return expName === name
    }
    return exp.specifiers.find(spec => {
      const expName = spec.exported.name
      if (expName === name) {
        exportSpecifier = spec
        return true
      }
      return false
    })
  })
  return { exportDeclaration, exportSpecifier }
}

function updateIndex(opts) {
  const {
    name,
    doCreateIndex,
    indexSource,
    indexSample,
  } = opts
  if (!doCreateIndex) return
  let indexOutSource = indexSource || indexSample
  const tree = esprima.parseModule(indexOutSource, { jsx: true, range: true, comment: true })
  const exps = tree.body.filter(node => node.type === 'ExportNamedDeclaration')
  const { exportDeclaration } = findExport(exps, name)
  if (exportDeclaration) {
    console.log(`Index already exports '${name}'.`)
    return
  }

}

function write(filepath, source, originalSource) {
  if (!source) return
  if (source === originalSource) {
    console.log(`'${filepath}' no changes applied`)
    return
  }
  const dirname = path.dirname(filepath)
  const doesDirExist = fs.existsSync(dirname)
  if (!doesDirExist) {
    fs.mkdirSync(dirname, { recursive: true })
    console.log(`'${dirname}' directory created`)
  }
  fs.writeFileSync(filepath, source)
  if (originalSource === null) console.log(`'${filepath}' created`)
  else console.log(`'${filepath}' updated`)
}

function writeSources(opts) {
  const {
    componentPath,
    styleModulePath,
    indexPath,
    componentSource,
    styleModuleSource,
    indexSource,
    componentOutSource,
    styleModuleOutSource,
    indexOutSource,
  } = opts
  write(componentPath, componentOutSource, componentSource)
  write(styleModulePath, styleModuleOutSource, styleModuleSource)
  write(indexPath, indexOutSource, indexSource)
}

function run(opts) {
  const {
    doCreateComponent,
    doCreateStyleModule,
    doAddToIndex,
  } = opts
  if (doCreateComponent) updateComponent(opts)
  if (doCreateStyleModule) updateStyle(opts)
  if (doAddToIndex) updateIndex(opts)
  writeSources(opts)
}

exports.run = run