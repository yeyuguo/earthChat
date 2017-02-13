;
(function(w, d3, undefined) {
    "use strict";

    var width, height;

    function getSize() {
        width = w.innerWidth,
            height = w.innerHeight;

        if (width === 0 || height === 0) {
            setTimeout(function() {
                getSize();
            }, 100);
        } else {
            init();
        }
    }

    function init() {

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
            .mode("orthographic")
            .translate([width / 2, height / 2]);

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
            markPoint()

            features.attr("d", function(d) {
                return path(circle.clip(d));
            });

            stars.attr("d", function(d) {
                spacePath.pointRadius(d.properties.radius);
                return spacePath(d);
            });


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
        function markPoint(point) {
            var peking = point || [116.3, 39.9];
            var textCont = textCont || '这是测试对话'
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
                .attr("xlink:href", "duang/img/user-2.png");


            PopupBox = dialogBox.append('rect')
                .attr('class', 'Popup')
                .attr('x', proPeking[0] + 1)
                .attr('y', proPeking[1] + 1)
                .attr('rx', 5)
                .attr('ry', 5)
                .attr('width', 100)
                .attr('height', 30)
                .attr('fill', 'white')

            textBox = dialogBox.append('text')
                .attr('class', 'Popup')
                .attr('x', proPeking[0] + 5)
                .attr('y', proPeking[1] + 20)
                .html(textCont)

            beijingPoint.on("click", function() {
                console.log(d3.select(this))
            })
        }
        markPoint()

    }

    getSize();

}(window, d3));