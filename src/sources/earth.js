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
    var initObj
    var markPoint

    function getSize(obj) {
        width = w.innerWidth,
            height = w.innerHeight;

        if (width === 0 || height === 0) {
            setTimeout(function() {
                getSize();
            }, 100);
        } else {
            initObj = init(obj);
        }
    }

    function init(obj) {
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
            // .origin([110, 35])
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

        var svg = d3.select("#earth")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr('style', 'postion:absolute;left:0;top:0;')
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
        var this_obj
        function redraw() {
            if (obj) {
                
                if(!this_obj){
                    this_obj = obj;
                }
                
                // this_obj = {
                //     point: [116, 34],
                //     msg: 'test'
                // }
                // 若存在回调函数 执行 回调函数
                if (this_obj.action) {
                    var fn = this_obj.action
                    delete this_obj.action
                    fn(this_obj)
                }
                markPoint(this_obj)
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

            closeAvator()

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

        markPoint(obj)

        function markPoint(obj) {
            if (!obj) {
                return false
            }
            var peking = obj.point || [116.3, 39.9];
            var textCont = obj.msg || ''
            var picSrc = obj.avatar || 'images/t2.png'

            var dialogBox = d3.select('#dialogBox')

            // var proPeking = initObj.projection(peking)
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
                .attr("xlink:href", picSrc);

            picBox.on("click", function() {
                // console.log(d3.select('#resizeBig img'))
                // if (d3.select('#resizeBig img')[0][0]) {
                //     return
                // }
                var src = d3.select(this).attr('href')
                    // console.log(src)

                d3.select('#resizeBig')
                    .attr('style', 'display:block')

                d3.select('#resizeBig .avator')
                    .attr('src', src)
                    .attr('alt', '头像展示')
            })
            var msgW = 100,
                msgH = 30
            // if (obj.msg == '') {
            //     msgW = 0
            //     msgH = 0
            // }
            msgW = 0
            msgH = 0
            
            PopupBox = dialogBox.append('rect')
                .attr('class', 'Popup')
                .attr('x', proPeking[0] + 1)
                .attr('y', proPeking[1] + 1)
                .attr('rx', 5)
                .attr('ry', 5)
                .attr('fill', 'white')
                .attr('width', msgW)
                .attr('height', msgH)

            textBox = dialogBox.append('text')
                .attr('class', 'Popup')
                .attr('x', proPeking[0] + 5)
                .attr('y', proPeking[1] + 20)
                // .html(textCont)
                .html('')
            
                
        }

        return {
            redraw: redraw,
            // TODO ：返回 svg 和 projection 给第三方回调；
            svg: svg,
            projection: projection,
        }

    }

    // 标记点


    function markMsg(obj) {
        // 信息修改
        var selectObj = d3.select('#dialogBox')
        if (obj.msg) {
            // selectObj.select('text')
            //     .html(obj.msg)
            
            // 在地球仪上绘制一个对话框
            var n=20
            var width_msg = String(n-7)+'em';
            var height_msg = String(Math.ceil(obj.msg.length/n)+1)+'em';
            // console.log('---------')
            // console.log(width_msg,height_msg)
            d3.select('.Popup')
                .attr('width',width_msg)
                .attr('height',height_msg)
            var line_str = wrap_cb(obj.msg,n)
            console.log({line_str})
            selectObj.select('text')
                .html(line_str)
        }
        // 图片修改
        if (obj.avatar) {
            selectObj.select('image')
                .attr('xlink:href', obj.avatar)
        }

        function wrap_cb(str,len){
            var str = str || ''
            var str_len = str.length;
            var len = len || 20
            var n = Math.ceil(str_len/len);
            var x_point = d3.select('.Popup').attr('x');
            x_point = parseFloat(x_point)+10 
            var y_point = d3.select('.Popup').attr('y');
            var result = ''
            for(var i=0;i<n;i++){
                
                
                y_point = parseFloat(y_point) + 15
                var line_str = `<tspan x="${x_point}" y="${y_point}">${str.substr(len*i,len)}</tspan>`
                // console.log('y_point:',y_point,i)
                // console.log(y_point+(i+1)*20)
                result +=line_str
            }
            
            return result
        }
    }

    // getSize(obj);
    return {
        redraw: getSize,
        markMsg: markMsg
    }
    // }(window, d3)
}(window, d3)



// 关闭头像详细页
function closeAvator() {
    if ($('#resizeBig').css('display') != 'none') {
        $('#resizeBig').css('display', 'none');
    }
}