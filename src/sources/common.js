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
    var host = '127.0.0.1';
    var port = 80;
    // var url_request = `http://${window.location.host}:${port}`
    var url_request = null;
    /*
     * urlParamas is except of IP:PORT/ */
    function get_request(allPath, fn) {
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
        // console.log(allPath)
        // console.log('url:', url)
        $.ajax({
            // url: 'http://' + window.location.host + path,
            url: url,
            // dataType: 'json',
            dataType: allPath.dataType || 'json',
            type: 'GET',
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

    // 拖拽功能
    function dragMove(bar, target) {
        // console.log(bar)
        // console.log(target)
        var params = {
            left: 0,
            top: 0,
            currentX: 0,
            currentY: 0,
            flag: false
        };
        //获取相关CSS属性
        var getCss = function(o, key) {
            return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
        };

        //拖拽的实现
        var startDrag = function(bar, target, callback) {
            if (getCss(target, "left") !== "auto") {
                params.left = getCss(target, "left");
            }
            if (getCss(target, "top") !== "auto") {
                params.top = getCss(target, "top");
            }
            //o是移动对象
            bar.onmousedown = function(event) {
                params.flag = true;
                if (!event) {
                    event = window.event;
                    //防止IE文字选中
                    bar.onselectstart = function() {
                        return false;
                    }
                }
                var e = event;
                params.currentX = e.clientX;
                params.currentY = e.clientY;
            };
            document.onmouseup = function() {
                params.flag = false;
                if (getCss(target, "left") !== "auto") {
                    params.left = getCss(target, "left");
                }
                if (getCss(target, "top") !== "auto") {
                    params.top = getCss(target, "top");
                }
            };
            document.onmousemove = function(event) {
                var e = event ? event : window.event;
                if (params.flag) {
                    var nowX = e.clientX,
                        nowY = e.clientY;
                    var disX = nowX - params.currentX,
                        disY = nowY - params.currentY;
                    target.style.left = parseInt(params.left) + disX + "px";
                    target.style.top = parseInt(params.top) + disY + "px";
                }

                if (typeof callback == "function") {
                    // callback(parseInt(params.left) + disX, parseInt(params.top) + disY);
                    callback()
                }
            }
        }(bar, target);
    }

    function test(a) {
        console.log(a)
    }

    return {
        test: 'test',
        url: null,
        getAjax: function(a, b) {
            get_request(a, b)
                // if (!this.url) {
                //     get_request(obj);
                // }
        },
        postAjax: function(obj) {
            post_request(obj);
        },
        cloneObj: function(obj) {
            cloneObj(obj);
        },
        dragMove: dragMove,
    }
}()