;
/** 
 * 
 *----------Dragon be here!----------/ 
 * 　　　┏┓　　　┏┓ 
 * 　　┏┛┻━━━┛┻┓ 
 * 　　┃　　　　　　　┃ 
 * 　　┃　　　━　　　┃ 
 * 　　┃　┳┛　┗┳　┃ 
 * 　　┃　　　　　　　┃ 
 * 　　┃　　　┻　　　┃ 
 * 　　┃　　　　　　　┃ 
 * 　　┗━┓　　　┏━┛ 
 * 　　　　┃　　　┃神兽保佑 
 * 　　　　┃　　　┃代码无BUG！ 
 * 　　　　┃　　　┗━━━┓ 
 * 　　　　┃　　　　　　　┣┓ 
 * 　　　　┃　　　　　　　┏┛ 
 * 　　　　┗┓┓┏━┳┓┏┛ 
 * 　　　　　┃┫┫　┃┫┫ 
 * 　　　　　┗┻┛　┗┻┛ 
 * ━━━━━━神兽出没━━━━━━
 */

var redraw
var Earth = function(w, d3) {

    "use strict";
    var w = w || window;

    var width, height;

    function getSize(obj) {
        width = w.innerWidth,
            height = w.innerHeight;

        if (width === 0 || height === 0) {
            setTimeout(function() {
                getSize();
            }, 100);
        } else {
            init(obj);
        }
    }

    var init = function(obj) {
        var obj = obj || {
                point: [110, 30],
                msg: 'test'
            }
            //Setup path for outerspace
        var space = d3.geo.azimuthal()
            .mode("equidistant")
            .translate([width / 2, height / 2]);

        space.scale(space.scale() * 3);

        var spacePath = d3.geo.path()
            .projection(space)
            .pointRadius(1);

        //Setup path for globe
        var projection = d3.geo.azimuthal()
            .origin([110, 30])
            .mode("orthographic")
            .translate([width / 2, height / 2]);

        // projection = projection([110, 32])

        var scale0 = projection.scale();


        var path = d3.geo.path()
            .projection(projection)
            .pointRadius(2);

        //Setup zoom behavior
        var zoom = d3.behavior.zoom(true)
            .translate(projection.origin())
            .scale(projection.scale())
            .scaleExtent([100, 800])
            .on("zoom", move);

        var circle = d3.geo.greatCircle();
        // 设置中心
        // circle.center(obj.point);

        var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .call(zoom)
            .on("dblclick.zoom", null);

        //Create a list of random stars and add them to outerspace
        var starList = createStars(300);

        var stars = svg.append("g")
            .selectAll("g")
            .data(starList)
            .enter()
            .append("path")
            .attr("class", "star")
            .attr("d", function(d) {
                spacePath.pointRadius(d.properties.radius);
                return spacePath(d);
            });


        svg.append("rect")
            .attr("class", "frame")
            .attr("width", width)
            .attr("height", height);

        //Create the base globe
        var backgroundCircle = svg.append("circle")
            .attr('cx', width / 2)
            .attr('cy', height / 2)
            .attr('r', projection.scale())
            .attr('class', 'globe')
            .attr("filter", "url(#glow)")
            .attr("fill", "url(#gradBlue)");

        var g = svg.append("g"),
            features;
        // 标记点
        var beijingPoint, PopupBox, textBox, picBox

        var dialogBox = svg.append("g")
            .attr("id", "dialogBox")


        //Add all of the countries to the globe
        d3.json("world-countries.json", function(collection) {
            features = g.selectAll(".feature").data(collection.features);

            features.enter().append("path")
                .attr("class", "feature")
                .attr("d", function(d) { return path(circle.clip(d)); });
        });


        //Redraw all items with new projections
        function redraw() {
            if (obj) {
                // obj = {
                //     point: [116, 34],
                //     msg: 'test'
                // }
                // 若存在回调函数 执行 回调函数
                if (obj.action) {
                    var fn = obj.action
                    delete obj.action
                    fn(obj)
                }
                markPoint(obj)
            }

            // markPoint([116, 34], '我变化咯')
            // markPoint(point, '我变化咯')


            features.attr("d", function(d) {
                return path(circle.clip(d));
            });

            stars.attr("d", function(d) {
                spacePath.pointRadius(d.properties.radius);
                return spacePath(d);
            });

            EventClass.closeAvator()

        }


        function move() {
            if (d3.event) {
                var scale = d3.event.scale;
                var origin = [d3.event.translate[0] * -1, d3.event.translate[1]];

                projection.scale(scale);
                space.scale(scale * 3);
                backgroundCircle.attr('r', scale);
                path.pointRadius(2 * scale / scale0);

                projection.origin(origin);
                circle.origin(origin);

                //globe and stars spin in the opposite direction because of the projection mode
                var spaceOrigin = [origin[0] * -1, origin[1] * -1];
                space.origin(spaceOrigin);
                redraw();
            }
        }


        function createStars(number) {
            var data = [];
            for (var i = 0; i < number; i++) {
                data.push({
                    geometry: {
                        type: 'Point',
                        coordinates: randomLonLat()
                    },
                    type: 'Feature',
                    properties: {
                        radius: Math.random() * 1.5
                    }
                });
            }
            return data;
        }

        function randomLonLat() {
            return [Math.random() * 360 - 180, Math.random() * 180 - 90];
        }


        // 标记点
        function markPoint(obj) {
            if (!obj) {
                return false
            }
            var peking = obj.point || [116.3, 39.9];
            var textCont = obj.msg || '这是测试对话'
            dialogBox = d3.select('#dialogBox')
            var proPeking = projection(peking)
            if (beijingPoint) {
                beijingPoint.remove()
            }

            if (PopupBox) {
                PopupBox.remove()
            }
            if (textBox) {
                textBox.remove()
            }
            if (picBox) {
                picBox.remove();
            }

            beijingPoint = dialogBox.append('circle')
                .attr("cx", proPeking[0])
                .attr("cy", proPeking[1])
                .attr("r", 8)
                .style("fill", "red");


            picBox = dialogBox.append("image")
                .attr("x", proPeking[0] - 30)
                .attr("y", proPeking[1] - 30)
                .attr("width", 35)
                .attr("height", 35)
                // .attr("xlink:href", "duang/img/user-2.png");
                .attr("xlink:href", "images/meinv.jpg");


            PopupBox = dialogBox.append('rect')
                .attr('class', 'Popup')
                .attr('x', proPeking[0] + 1)
                .attr('y', proPeking[1] + 1)
                .attr('rx', 5)
                .attr('ry', 5)
                .attr('fill', 'white')
                .attr('width', 100)
                .attr('height', 30)


            textBox = dialogBox.append('text')
                .attr('class', 'Popup')
                .attr('x', proPeking[0] + 5)
                .attr('y', proPeking[1] + 20)
                .html(textCont)

            picBox.on("click", function() {
                // console.log(d3.select('#resizeBig img'))
                // if (d3.select('#resizeBig img')[0][0]) {
                //     return
                // }
                var src = d3.select(this).attr('href')
                console.log(src)

                d3.select('#resizeBig')
                    .attr('style', 'display:block')

                d3.select('#resizeBig .avator')
                    .attr('src', src)
                    .attr('alt', '头像展示')
            })
        }
        markPoint(obj)

        return {
            redraw: redraw
        }
    }

    // getSize(obj);
    return {
        redraw: function(obj) {
            getSize(obj);
        }
    }
    // }(window, d3)
}(window, d3)



// (function(w, d3, undefined) {
//     "use strict";

//     var width, height;

//     function getSize() {
//         width = w.innerWidth,
//             height = w.innerHeight;

//         if (width === 0 || height === 0) {
//             setTimeout(function() {
//                 getSize();
//             }, 100);
//         } else {
//             init();
//         }
//     }

//     function init(point) {

//         //Setup path for outerspace
//         var space = d3.geo.azimuthal()
//             .mode("equidistant")
//             .translate([width / 2, height / 2]);

//         space.scale(space.scale() * 3);

//         var spacePath = d3.geo.path()
//             .projection(space)
//             .pointRadius(1);

//         //Setup path for globe
//         var projection = d3.geo.azimuthal()
//             .mode("orthographic")
//             .translate([width / 2, height / 2]);

//         var scale0 = projection.scale();

//         var path = d3.geo.path()
//             .projection(projection)
//             .pointRadius(2);

//         //Setup zoom behavior
//         var zoom = d3.behavior.zoom(true)
//             .translate(projection.origin())
//             .scale(projection.scale())
//             .scaleExtent([100, 800])
//             .on("zoom", move);

//         var circle = d3.geo.greatCircle();

//         var svg = d3.select("body")
//             .append("svg")
//             .attr("width", width)
//             .attr("height", height)
//             .append("g")
//             .call(zoom)
//             .on("dblclick.zoom", null);

//         //Create a list of random stars and add them to outerspace
//         var starList = createStars(300);

//         var stars = svg.append("g")
//             .selectAll("g")
//             .data(starList)
//             .enter()
//             .append("path")
//             .attr("class", "star")
//             .attr("d", function(d) {
//                 spacePath.pointRadius(d.properties.radius);
//                 return spacePath(d);
//             });


//         svg.append("rect")
//             .attr("class", "frame")
//             .attr("width", width)
//             .attr("height", height);

//         //Create the base globe
//         var backgroundCircle = svg.append("circle")
//             .attr('cx', width / 2)
//             .attr('cy', height / 2)
//             .attr('r', projection.scale())
//             .attr('class', 'globe')
//             .attr("filter", "url(#glow)")
//             .attr("fill", "url(#gradBlue)");

//         var g = svg.append("g"),
//             features;
//         // 标记点
//         var beijingPoint, PopupBox, textBox, picBox

//         var dialogBox = svg.append("g")
//             .attr("id", "dialogBox")


//         //Add all of the countries to the globe
//         d3.json("world-countries.json", function(collection) {
//             features = g.selectAll(".feature").data(collection.features);

//             features.enter().append("path")
//                 .attr("class", "feature")
//                 .attr("d", function(d) { return path(circle.clip(d)); });
//         });

//         //Redraw all items with new projections
//         function redraw(point) {
//             var point = point || [105, 30]
//             markPoint(point, '我变化咯')


//             features.attr("d", function(d) {
//                 return path(circle.clip(d));
//             });

//             stars.attr("d", function(d) {
//                 spacePath.pointRadius(d.properties.radius);
//                 return spacePath(d);
//             });

//             EventClass.closeAvator()

//         }


//         function move() {
//             if (d3.event) {
//                 var scale = d3.event.scale;
//                 var origin = [d3.event.translate[0] * -1, d3.event.translate[1]];

//                 projection.scale(scale);
//                 space.scale(scale * 3);
//                 backgroundCircle.attr('r', scale);
//                 path.pointRadius(2 * scale / scale0);

//                 projection.origin(origin);
//                 circle.origin(origin);

//                 //globe and stars spin in the opposite direction because of the projection mode
//                 var spaceOrigin = [origin[0] * -1, origin[1] * -1];
//                 space.origin(spaceOrigin);
//                 redraw();
//             }
//         }


//         function createStars(number) {
//             var data = [];
//             for (var i = 0; i < number; i++) {
//                 data.push({
//                     geometry: {
//                         type: 'Point',
//                         coordinates: randomLonLat()
//                     },
//                     type: 'Feature',
//                     properties: {
//                         radius: Math.random() * 1.5
//                     }
//                 });
//             }
//             return data;
//         }

//         function randomLonLat() {
//             return [Math.random() * 360 - 180, Math.random() * 180 - 90];
//         }


//         // 标记点
//         function markPoint(point, msg) {
//             var peking = point || [116.3, 39.9];
//             var textCont = msg || '这是测试对话'
//             dialogBox = d3.select('#dialogBox')
//             var proPeking = projection(peking)
//             if (beijingPoint) {
//                 beijingPoint.remove()
//             }

//             if (PopupBox) {
//                 PopupBox.remove()
//             }
//             if (textBox) {
//                 textBox.remove()
//             }
//             if (picBox) {
//                 picBox.remove();
//             }

//             beijingPoint = dialogBox.append('circle')
//                 .attr("cx", proPeking[0])
//                 .attr("cy", proPeking[1])
//                 .attr("r", 8)
//                 .style("fill", "red");


//             picBox = dialogBox.append("image")
//                 .attr("x", proPeking[0] - 30)
//                 .attr("y", proPeking[1] - 30)
//                 .attr("width", 35)
//                 .attr("height", 35)
//                 // .attr("xlink:href", "duang/img/user-2.png");
//                 .attr("xlink:href", "images/meinv.jpg");


//             PopupBox = dialogBox.append('rect')
//                 .attr('class', 'Popup')
//                 .attr('x', proPeking[0] + 1)
//                 .attr('y', proPeking[1] + 1)
//                 .attr('rx', 5)
//                 .attr('ry', 5)
//                 .attr('fill', 'white')
//                 .attr('width', 100)
//                 .attr('height', 30)


//             textBox = dialogBox.append('text')
//                 .attr('class', 'Popup')
//                 .attr('x', proPeking[0] + 5)
//                 .attr('y', proPeking[1] + 20)
//                 .html(textCont)

//             picBox.on("click", function() {
//                 // console.log(d3.select('#resizeBig img'))
//                 // if (d3.select('#resizeBig img')[0][0]) {
//                 //     return
//                 // }
//                 var src = d3.select(this).attr('href')
//                 console.log(src)

//                 d3.select('#resizeBig')
//                     .attr('style', 'display:block')

//                 d3.select('#resizeBig .avator')
//                     .attr('src', src)
//                     .attr('alt', '头像展示')
//             })
//         }
//         markPoint()

//     }

//     getSize();

// });



//  先执行
var drag
var EventClass = function() {
    // drag = d3.behavior.drag()

    // 一次性自执行函数
    $(function() {
        $('#resizeBig .close').on('click', function() {
            closeAvator()
        })
    }())

    // 自定义函数
    // 关闭头像详细页
    function closeAvator() {
        if ($('#resizeBig').css('display') != 'none') {
            $('#resizeBig').css('display', 'none');
        }

    }

    function openAvator(avatarObj) {
        if ($('#resizeBig').css('display') == 'none') {
            $('#resizeBig').css('display', 'block');

            console.log('avatarObj:', avatarObj)
            var now_username = $('#resizeBig').find('.username dd').text()
            if (avatarObj && avatarObj.username != now_username) {
                console.log('点击的头像与上一次不同，替换内容')
                renderAvatar(avatarObj)
            }
        }
    }

    function renderAvatar(avatarObj) {
        console.log('renderAvatar obj:', avatarObj)
        var avatarObj = avatarObj || {
            avatar: '../images/t2.png',
            username: '小白',
            userid: '123213213',
            school: '天津',
            age: '24',
            addr: '昆明',
        }
        var paraentObj = $('#resizeBig')
        paraentObj.find('img').attr('src', avatarObj.avatar)

        paraentObj.find('.username dd').text(avatarObj.username)
        paraentObj.find('.age dd').text(avatarObj.age)
        paraentObj.find('.school dd').text(avatarObj.school)
        paraentObj.find('.addr dd').text(avatarObj.addr)

    }

    // 拖拽移动

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


    return {
        result: 'yes',
        closeAvator: function() {
            closeAvator()
        },
        openAvator: function(avatarObj) {
            openAvator(avatarObj)
        },
        dragMove: function(bar, target) {
            return dragMove(bar, target)
        },
        renderEarth: function(point) {

            return
        }
    }
}()



$(function() {
    var clickSlide = document.getElementById('close')
    var moveSlide = document.getElementById('resizeBig')
    EventClass.dragMove(clickSlide, moveSlide)
})