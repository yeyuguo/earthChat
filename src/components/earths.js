import React from 'react';
const Earths = React.createClass({
    render(){
        return (
            <div>
                
            </div>
        )
    },
    componentWillMount(){
       
    },
    componentDidMount(){
        // 加载蓝色海洋
        var blueLand = `<svg id="defs">
                <defs>
                    <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#005C99;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#0099FF;stop-opacity:1" />
                    </linearGradient>
                    <filter id="glow">
                        <feColorMatrix type="matrix"
                            values=
                            "0 0 0 0   0
                            0 0 0 0.9 0 
                            0 0 0 0.9 0 
                            0 0 0 1   0"/>
                        <feGaussianBlur stdDeviation="5.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
            </svg>`
        $('#earth').before(blueLand)
        //地球仪和星空
        var ip = returnCitySN.cip || '61.51.81.123'
        Common.getAjax({
            url: 'http://api.map.baidu.com/location/ip?&coor=bd09ll&ak=sGKjmnRedwEAgCQ2OWlOMGuqKkTpneED&ip=' + ip,
            dataType: 'jsonp'
        }, function(result) {
            var lonlat = result.content.point
            var lon = lonlat.x
            var lat = lonlat.y
                // redraw([lon, lat])
            var paramsObj = {
                    point: [lon, lat],
                    msg: 'aaa',
                    avatar: 'images/t2.png',
                }
                // paramsObj.point = [110, 30]
                console.log({paramsObj})
                Earth.redraw(paramsObj);
        })
        
    }
})

module.exports = Earths;