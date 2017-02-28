var http = require('http');
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var request = require('request')

var httpRequest = function(urlRoot, urlPort) {
    var urlRoot = urlRoot || '127.0.0.1'
    var urlPort = urlPort || 80

    var httpOption = {
        hostname: urlRoot,
        port: urlPort,
        path: null,
        method: null
    }

    // input  表单
    var inputUpload = upload.fields([
        { name: 'cefengta' },
        { name: 'file' },
        { name: 'yunxing' },
        { name: 'qianqi' },
        { name: 'danbao' }
    ])


    //  HTTP 请求
    function http_request(httpOption, res) {
        var result = ''
        var http_req = http.request(httpOption, function(http_res) {
            http_res.setEncoding('utf8');
            http_res.on('data', function(data) {
                //TODO: 必须要用字符串叠加 否则传过来的数据只有一半
                result += data
                    // res.send(data)
            }).on('end', function() {
                // console.log('GET  request:',result)
                res.send(result)
            })
        })
        http_req.on('error', function(e) {
            console.log('self check ERROR is: ' + e.message);
        });
        // 写入 path， 没到 end() 会一直等待输入，
        // 具体详解：https://my.oschina.net/antianlu/blog/228511
        http_req.write(httpOption.path + "\n")
        http_req.end()
    }

    // get 方式
    function get(req, res, httpOpt) {
        if (!httpOpt) {
            httpOption.method = 'GET'
            httpOption.path = req.originalUrl
        }else{
            httpOption = httpOpt
        }

        res.set({
            'Content-Type': 'text/plain;charset=UTF-8',
        })

        http_request(httpOption, res)

    }
    // post 方式
    function post(req, res) {
        httpOption.method = 'POST'
        httpOption.path = '/'
        var paramsPath = ""
        if (req.body) {
            console.log('request body:', req.body)
            for (var k in req.body) {
                var kv = (k + '=' + req.body[k])
                if (paramsPath == '') {
                    paramsPath += kv
                } else {
                    paramsPath += ('&' + kv)
                }
            }
            // paramsPath = querystring.stringify(req.body)
            console.log(typeof paramsPath)
            console.log('======:', paramsPath)
        }
        var requestPath = req.originalUrl + '?' + paramsPath
        httpOption.path = requestPath.replace(/\s+/g, '')

        http_request(httpOption, res)
    }

    // 文件方式
    function post_file(req, res) {
        // app.post('/pba/dev/*/fileupload', inputUpload, function(req, res, next) {
        // console.log('upload post: starting:')
        // console.log('req.files:', req.files)
        // console.log(req.body.inputName)
        // console.log(req.files[req.body.inputName][0])
        req.file = req.files[req.body.inputName][0]
        console.log('req.file:', req.file)
        httpOption.path = req.originalUrl.replace(/\s+/g, '')
        if (req.file) {
            var dirname = path.dirname(req.file.path)
            var newName = path.join(dirname, req.file.originalname)
                // var newName = path.join(req.file.destination, req.file.originalname)
                // console.log('newName:', newName)
            fs.exists(newName, function(exists) {
                // TODO  不能对同名文件覆盖
                // if (exists) {
                //     res.send(JSON.stringify({ msg: '已经存有该文件' }))
                //     return
                // } else {
                //     // TODO error
                //     fs.rename(req.file.path, newName)
                //     console.log('修改文件名,并保存成功')
                // }
                if (!exists) {
                    // console.log('newName:', newName)
                    fs.rename(req.file.path, newName)
                    requestFile(httpOption, { type: 'mast', file: newName }, res)
                } else {
                    // TODO 删除文件上传的副本
                    var rm_dirname = path.dirname(req.file.path)
                    var rm_file = path.join(rm_dirname, req.file.filename)
                    rm_file = rm_file.replace(/\\/g, '\\')
                    console.log('rm_file:', rm_file)
                    fs.rmdir(rm_file, function(data) {
                        console.log('删除文件后的回调信息', data);
                    })
                    res.send(JSON.stringify({ msg: '上传失败！已存有同名文件' }))
                }

                // console.log('newName:newName:newName:newName:', newName)
            })
        }
    }

    function requestFile(httpOption, params, res) {
        // 参考地址：
        // https://www.oschina.net/question/1010992_141100
        // https://github.com/form-data/form-data

        params.file = params.file.replace(/\\/g, '\\')
        console.log('file path:', params.file)

        var fileData = fs.createReadStream(params.file)
        console.log('fileData:', fileData._readableState.buffer)
        var formDatas = {
            file_type: params.type,
            file: fileData
        }
        request.post({
            url: 'http://' + httpOption.hostname + ':' + httpOption.port + httpOption.path,
            formData: formDatas
        }, function(err, httpRes, body) {
            var requestResult = ''
            if (err) {
                requestResult = JSON.stringify({ msg: '上传失败过程失败！请检查文件名是否有特殊字符' })
                console.log('上传失败 err:', err)
                    // throw err;
            } else if (body == 'ok') {
                console.log('上传成功！')
                requestResult = JSON.stringify({ success: '上传成功！' })
            }
            return res.send(requestResult)
        })
    }


    return {
        httpOption: null,
        request: function(kk) {
            console.log(kk)
        },
        get: function(req, res) {
            return get(req, res, this.httpOption)
        },
        post: function(req, res) {
            return post(req, res)
        },
        post_file: function(req, res) {
            return post_file(req, res)
        }
    }
}

module.exports = httpRequest