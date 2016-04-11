'use strict'


const winston = require('winston')
const fs = require ('fs')
const path = require ('path')
const chokidar = require('chokidar')
const exec = require('child_process').exec

const config = require('./configuration')


var watcher = chokidar.watch(config.input, {
    ignored: /[\/\\]\./,
    persistent:true
})

watcher
 .on('add', folderPath => {
    console.log(`stuff ${folderPath} has been added`)
    //C:\LibreOffice\program\soffice -headless -invisible --convert-to pdf .\sampleDocument.docx -outdir c:/test
    console.log(`${config.libre} -headless -invisible --convert-to pdf ${folderPath} -outdir ${config.output}`)
    exec(`${config.libre} -headless -invisible --convert-to pdf ${folderPath} -outdir ${config.output}`, (err, stdout, sterr) => {
        if(err){
            throw err
        }
        console.log(stdout)
    })
    fs.unlink(folderPath,  (err) => {
        if(err){
            throw err
        } 
        console.log(`${folderPath} was deleted from input folder`)
    })
    
    
})
 .on('error', error => {
     console.log(`An error occured with ${error}`)
 })
 .on('ready', () => {
     console.log(`Lets Boogiie`)
 })