const fs = require('fs')
const { write } = require('./filesys')
const defaultConfig = require('../templates/config.json')

function writeConfig(config, path) {
  const str = JSON.stringify(config, null, 2)
  write(path, str, 'abc')
}

function readConfig(path) {
  const exists = fs.existsSync(path)
  if (!exists) return defaultConfig
  const str = fs.readFileSync(configPath).toString()
  const config = JSON.parse(str)
  return config
}

function readOptions(configPath) {
  const config = readConfig(configPath)

}

module.exports = {
  writeConfig,
  readOptions,
}