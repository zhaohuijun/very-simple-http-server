const http = require('http')
const fs = require('fs')

let port = 8080
let root = '.'

let server = http.createServer(async (req, resp)=>{
    console.log(req.url)
    let path = root + "/" + req.url
    fs.readFile(path, (err, data)=>{
        if (err) {
            if (err.code == 'EISDIR') {
                fs.readdir(path, (err, files)=>{
                    if (err) {
                        resp.end('not found')
                    } else {
                        let ret = files.map(v=>{
                            return `<a href="http://${req.headers.host}/${req.url}/${v}">${v}</a>`
                        })
                        ret = '<html><body>'
                            + ret.join('<br/>')
                            + '</body></html>'
                        resp.end(ret);
                    }
                })
            } else {
                resp.end('not found')
            }
        } else {
            resp.end(data)
        }
    })
})

if (process.argv.length > 2) {
    let _p = Number(process.argv[2])
    if (isNaN(_p)) {
        root = process.argv[2]
    } else {
        port = _p
    }
}
if (process.argv.length > 3) {
    let _p = Number(process.argv[3])
    if (isNaN(_p)) {
        root = process.argv[3]
    } else {
        port = _p
    }
}
server.listen(port)
console.log(`start http server in ${port}, root path: ${root}`)
