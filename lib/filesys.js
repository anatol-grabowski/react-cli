const path = require('path')
const fs = require('fs')

function write(filepath, source, originalSource) {
  if (!source) return
  if (source === originalSource) {
    console.log(`'${filepath}' not changed`)
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

exports.write = write