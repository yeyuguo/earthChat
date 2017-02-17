var Common = function() {


    /*封装ajax的设置*/
    function ajax(fn) {
        /*
            //调用示范
            ajax({
                url: '//54.222.191.200:8000/poc?',
                data: { wfid: 10000, stime: '2015-05-01', etime: '2016-08-10' },
                dataType: 'jsonp',//此返回数据类型为跨域，其他均为不跨域。
                success: function(d){ console.log(d); }
            });
        */
        var option = arguments[0] || {};
        var fn = arguments[1] || null;
        if ($.isEmptyObject(option)) {
            console.log('ajax请求参数无效!');
            return;
        }
        option['dataType'] = option['dataType'] || 'text';
        $.ajax({
                url: option['url'],
                async: option['async'] || true,
                type: option['type'] || 'get',
                timeout: option['timeout'] ? parseInt(option['timeout']) : 1000 * 30,
                data: option['data'] || '',
                dataType: option['dataType'],
                beforeSend: option['beforeSend'] || null
            })
            .done(option['success'] ? option['success'] : function(data, textStatus) {
                console.log('ajax请求成功返回!');
                if (fn) {
                    fn(data);
                }
            })
            .fail(option['error'] ? option['error'] : function(XMLHttpRequest, textStatus, errorThrown) {
                console.log('ajax请求执行出错!');
                console.log(XMLHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
            })
            .always(option['complete'] ? option['complete'] : function(XMLHttpRequest, textStatus) {

            });
    }
    var host = '127.0.0.1'
    var port = 80
    var url_request = `http://${host}:${port}` || `http://${window.location.host}:${port}`
        /*
         * urlParamas is except of IP:PORT/ */
    function get_request(allPath, fn) {
        console.log(allPath)
        var defer = $.Deferred();

        var urlParams = {}
        var path, params, url
        if (typeof(allPath) != 'object') {
            var splitPath = allPath.split('?')
            path = splitPath[0]
            params = splitPath[1].split('&')


            for (var i in params) {
                var keyVal = params[i].split('=')
                urlParams[keyVal[0]] = keyVal[1]
            }

        }
        if (typeof(allPath) == 'object') {
            if (allPath.hasOwnProperty('action')) {
                path = allPath.action
                delete allPath.action
            }
            if (allPath.hasOwnProperty('url')) {
                console.log('--->', allPath.url);
                url = allPath.url || url_request
                delete allPath.url;
            }
            urlParams = allPath
        }
        console.log(allPath)
        console.log('url:', url)
        $.ajax({
            // url: 'http://' + window.location.host + path,
            url: url,
            dataType: 'json',
            type: 'get',
            data: urlParams,
            success: function(data) {
                var data
                console.log(data)
                if (typeof(data) == 'string') {
                    data = JSON.parse(data)
                }
                if (fn) {
                    // data = JSON.parse(data)
                    // 异步方式
                    fn(data)
                } else {
                    // 同步方式
                    // 如果没有回调函数，就直接用同步 defer 的promise 出去
                    // data = JSON.parse(data)
                    defer.resolve(data)
                }
                // console.log('data:',data);
            },
            error: function(err) {
                console.log('err:', err)
                defer.reject(err)
            }
        })
        return defer
    }


    function post_request(allPath, fn) {
        var defer = $.Deferred();
        var urlParams = {}
        var path, params, url
        if (typeof(allPath) != 'object') {
            var splitPath = allPath.split('?')
            path = splitPath[0]
            params = splitPath[1].split('&')
            for (var i in params) {
                var keyVal = params[i].split('=')
                urlParams[keyVal[0]] = keyVal[1]
            }
        }

        if (typeof(allPath) == 'object') {
            if (allPath.hasOwnProperty('action')) {
                path = allPath.action
                delete allPath.action
                if (allPath.hasOwnProperty(url)) {
                    url = allPath.url || url_request
                    delete allPath.url;
                }
            }
            urlParams = allPath
        }
        // console.log(urlParams)
        ajax({
            // url: 'http://' + window.location.host + path,
            url: url,
            // dataType:'jsonp',
            type: 'post',
            data: urlParams,
            // data: {
            //     "module": 'programlist',
            //     "data": '{"progname": "11","owner": "11","progaddr": "11","wttype": "11","powcap": "11","gradtime": "11","proleader": "11","createtime": "11","wfid": "11","progid": "13"}'
            // },
            success: function(data) {
                console.log(this.data)
                var data
                console.log('---------->')
                console.log(data, typeof(data))
                console.log('---------->')
                if (typeof(data) == 'string') {
                    data = JSON.parse(data)
                }
                if (fn) {
                    // data = JSON.parse(data)
                    fn(data)
                    console.log('post data:', data);
                } else {
                    defer.resolve(data)
                }
                // console.log('data:',data);
            }
        })
        return defer
    }


    /*
    深复制
    */
    var cloneObj = function(obj) {
        var str, newobj = obj.constructor === Array ? [] : {};
        if (typeof obj !== 'object') {
            return;
        } else if (window.JSON) {
            str = JSON.stringify(obj), // 系列化对象
                newobj = JSON.parse(str); // 还原
        } else {
            for (var i in obj) {
                newobj[i] = typeof obj[i] === 'object' ?
                    cloneObj(obj[i]) : obj[i];
            }
        }
        return newobj;
    };

    function test(a) {
        console.log(a)
    }

    return {
        test: 'test',
        url: null,
        getAjax: function(obj) {
            if (!this.url) {
                get_request(obj);
            }
        },
        postAjax: function(obj) {
            post_request(obj);
        },
        cloneObj: function(obj) {
            cloneObj(obj);
        },


    }
}()