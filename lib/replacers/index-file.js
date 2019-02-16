const esprima = require('esprima')
const Debug = require('debug')
const { findExport } = require('./parse-tools')

const debug = Debug('index-file')

function updateIndex(opts) {
  const {
    name,
    doAddToIndex,
    indexSource,
    indexSample,
    useSemicolons,
  } = opts
  if (!doAddToIndex) return
  debug('add to index')
  let indexOutSource = indexSource || indexSample
  const tree = esprima.parseModule(indexOutSource, { jsx: true, range: true, comment: true })
  const exps = tree.body.filter(node => node.type === 'ExportNamedDeclaration')
  const { exportDeclaration } = findExport(exps, name)
  if (exportDeclaration) {
    console.log(`Index already exports '${name}'.`)
    return
  }
  const insertPos = exps.length ? exps.slice(-1)[0].range[1] : 0
  debug('insertPos', insertPos)
  const before = indexOutSource.substring(0, insertPos)
  const after = indexOutSource.substring(insertPos)
  const exportStr = (exps.length ? '\n' : '') + `export { default as ${name} } from './${name}'` + (useSemicolons ? ';' : '')
  indexOutSource = before + exportStr + after
  opts.indexOutSource = indexOutSource
}

module.exports.updateIndex = updateIndex