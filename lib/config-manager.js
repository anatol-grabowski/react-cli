const fs = require('fs')
const path = require('path')
const { write } = require('./filesys')
const defaultConfig = require('../templates/react-cli.config.json')

const indexName = 'index.js'

const samplesDirPath = path.join(__dirname, '..', 'templates')
const samplesPathes = {
  func: 'FunctionalComponent.js',
  class: 'ClassComponent.js',
  style: 'Styles.module.scss',
  index: 'index.js',
  config: 'react-cli.config.json',
}

function readConfigDir(dirpath) {
  const samples = {
    functionalComponentSample: fs.readFileSync(path.join(dirpath, samplesPathes.func)).toString(),
    classComponentSample: fs.readFileSync(path.join(dirpath, samplesPathes.class)).toString(),
    styleModuleSample: fs.readFileSync(path.join(dirpath, samplesPathes.style)).toString(),
    indexSample: fs.readFileSync(path.join(dirpath, samplesPathes.index)).toString(),
    configSample: fs.readFileSync(path.join(dirpath, samplesPathes.config)).toString(),
  }
  return samples
}

function writeSamples(dirpath) {
  const samplesDirPath = path.join(__dirname, '..', 'templates')
  const samples = readConfigDir(samplesDirPath)
  write(path.join(dirpath, samplesPathes.func), samples.functionalComponentSample)
  write(path.join(dirpath, samplesPathes.class), samples.classComponentSample)
  write(path.join(dirpath, samplesPathes.style), samples.styleModuleSample)
  write(path.join(dirpath, samplesPathes.index), samples.indexSample)
  write(path.join(dirpath, samplesPathes.config), samples.configSample)
}

function writeConfig(config, path) {
  const confDir = config.configDirectory
  const existsConfDir = fs.existsSync(confDir)
  if (!existsConfDir) {
    console.error(`'${confDir}' does not exist`)
    return
  }
  const stat = fs.statSync(config.configDirectory)
  if (!stat.isDirectory) {
    console.error(`${confDir}' is not a directory`)
    return
  }
  const files = fs.readdirSync(confDir)
  if (files.length === 0) {
    writeSamples(confDir)
  }
  const str = JSON.stringify(config, null, 2)
  write(path, str, 'abc')
}

function readConfig(configPath) {
  const exists = fs.existsSync(configPath)
  if (!exists) return defaultConfig
  const str = fs.readFileSync(configPath).toString()
  const config = JSON.parse(str)
  return config
}

function readOptions(configPath) {
  const config = readConfig(configPath)
  const confDir = config.configDirectory
  const { configSample, ...samples } = readConfigDir(confDir)
  const options = JSON.parse(configSample)
  return { ...samples, ...options }
}

module.exports = {
  writeConfig,
  readOptions,
}