import path from 'path';
import fs from 'fs';

function read() {

}

/**
 * TODO: what is `originalSource`?
 * is `originalSource` an optional variable?
 */
export function write(filepath: string, source: any, originalSource?: any) {
  if (source == null) return
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