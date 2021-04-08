const axios = require("axios")
const express = require("express")
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')

const expressServer = express()

const expressPort = 8081, 
    apiPath = '/api',
    CTFd_URL = process.env.CTFD + "/api/v1", // http://monctfd
    TOKEN = process.env.TOKEN 

let fbList = []
let fbListOld = []

let hintList = []
let hintListOld = []

function getTop(n) {
    return new Promise((res, rej) => {
        axios.get(`${CTFd_URL}/scoreboard/top/${n}`,{
            headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': TOKEN
            }
        })
        .then((response) => {
            res(response.data.data)
        })
        .catch((e) => {
            rej(e)
        })

    })
}

function checkFirstBlood() {
    fbList.forEach((el) => {
        fbListOld.push(el)
    })
    axios.get(`${CTFd_URL}/challenges`,{
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': TOKEN
        }
    })
    .then((response) => {
        response.data.data.forEach((chall) => {
            if(fbListOld.filter((el) => { return el.challId === chall.id }).length === 0){
                axios.get(`${CTFd_URL}/challenges/${chall.id}/solves`,{
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'application/json',
                        'Authorization': TOKEN
                    }
                }).then((res) => {
                    if(res.data.data.length !== 0){
                        console.log(`FirstBlood: ${res.data.data[0].name} - Chall ${chall.name} (${chall.id})`)
                        fbList.push({challId: chall.id, userName: res.data.data[0].name, challName: chall.name })
                    }
                })
            }
        })
    })
    .catch((e) => {
        console.error(e)
    })
}

function checkHints() {
    hintList.forEach((el) => {
        hintListOld.push(el)
    })
    axios.get(`${CTFd_URL}/notifications`,{
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': TOKEN
        }
    })
    .then((response) => {
        response.data.data.forEach((hint) => {
            if(hintListOld.filter((el) => { return el.id === hint.id }).length === 0)
                hintList.push({id: hint.id, title: hint.title, content: hint.content })
        })
    })
    .catch((e) => {
        console.error(e)
    })
}



function setupApi() {
    expressRoutes()
    console.log(`Starting express server on ${expressPort}`)
    expressServer.listen(expressPort, function() {
        console.log(`[EXPRESS] UP`)
    })
}

function expressRoutes() {
    expressServer.use(cors())
    expressServer.use(bodyParser.json())
    expressServer.get(['*', '/'], function(req, res, next) {
        console.log(`[EXPRESS] ${req.ip} : ${req.path}`)
        next()
    })

    expressServer.use('/', express.static(path.resolve('../frontend/dist')))

    expressServer.get(`${apiPath}/firstBloodQueue`, routeFirstBloodQueue)
    expressServer.get(`${apiPath}/hintsQueue`, routeHintQueue)
    expressServer.get(`${apiPath}/Top/:nb`, routeTop)
}

function routeFirstBloodQueue (req, rep, next) {
    rep.send(fbList)
    fbList = []
}

function routeHintQueue (req, rep, next) {
    rep.send(hintList)
    hintList = []
}

function routeTop (req, rep, next) {
    if(req.params.nb !== null){
        getTop(Number(req.params.nb)).then((data) => { rep.send(data) })
    }
    else {
        next(400)
    }
}

setInterval(() => {
    checkFirstBlood()
    checkHints()

}, 1000)

setupApi()