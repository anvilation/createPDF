'use strict'

// **************************************************
// Constants
// **************************************************
const winston = require('winston')
const fs = require ('fs')
const path = require ('path')
const chokidar = require('chokidar')
const exec = require('child_process').exec

// **************************************************
// Create PDF Program
// **************************************************

const config = require('./configuration') // load configuration
var applicationLog = config.log + '/createpdf.log'
var state =  [] // this will check the state of the application
var logger = new (winston.Logger)({ // setup logger
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: applicationLog})
    ]
})
logger.log('info', `Debug Logging is set to ${config.debug}`)
logger.log('info', `Input Folder set to ${config.input}`)
logger.log('info', `Output Folder set to ${config.output}`)
logger.log('info', `Location of Libre Office is ${config.libre}`)

config.debug ? (
		logger.transports.console.level = 'debug',
		logger.transports.file.level = 'debug'
	):(
		logger.transports.console.level = 'error',
		logger.transports.file.level = 'error'
	
	);


// **************************************************
// Watching Input Folder
// **************************************************
var inputWatch = chokidar.watch(config.input, {
    ignored: /[\/\\]\./,
    persistent:true
})

inputWatch
 .on('add', folderPath => {
    logger.log('debug', `${folderPath} has been added`)
    let fileExtention = path.extname(folderPath)
    let fileName = path.basename(folderPath, fileExtention)
    logger.log('debug', `File Extention is ${fileExtention}, document name is ${fileName}`)
    let document ={
        fileName: fileName,
        folderPath: folderPath,
        fileExtention: fileExtention
    }
    state.push(document)
    logger.log('debug', `State update to  ${JSON.stringify(state)}`)

    logger.log('debug', `${config.libre} -headless -invisible --convert-to pdf ${folderPath} -outdir ${config.output}`)
    exec(`${config.libre} -headless -invisible --convert-to pdf ${folderPath} -outdir ${config.output}`, (err, stdout, sterr) => {
        if(err){
            throw err
        }
        logger.log('debug', stdout)
    })
   
})
 .on('error', error => {
     logger.log('info', `An error occured with ${error}`)
 })
 .on('ready', () => {
     logger.log('info', `Start Monitoring Input Folder`)
 })


// **************************************************
// Watching Output Folder
// ************************************************** 
var outputWatcher =  chokidar.watch(config.output, {
    ignored: /[\/\\]\./,
    persistent:true
})
 .on('add', folderPath => {
    logger.log('debug', `${folderPath} has been added`)
    let fileName = path.basename(folderPath, '.pdf')
    let stateLength = state.length
    let index = 0
    for (index = 0; index < stateLength; index++) {
        let isDocument = false;
        fileName === state[index].fileName ? removeDocument(state[index].folderPath) : isDocument  
        
    }
  
})
 .on('unlink', folderPath => {
    logger.log('debug', `${folderPath} has been removed`)
})
 .on('error', error => {
     logger.log('info', `An error occured with ${error}`)
     
 })
 .on('ready', () => {
     logger.log('info', 'Monitoring Output Folder')
 }) 
 
 function removeDocument(folderPath) {
     fs.unlink(folderPath, (err) => {
         if(err){
             throw err
         }
         logger.log('debug', `${folderPath} has been removed`)
     })
 }