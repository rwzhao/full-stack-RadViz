/**
 *
 * Created by Chih-Hao on 16/3/22.
 */

var debounce = function(f, timeout) {
    var id = -1;
    return function() {
        if (id > -1) {
            window.clearTimeout(id);
        }
        id = window.setTimeout(f, timeout);
    }
};

angular.module('radviz',[]).directive('radviz',
    function(){
    return {
        restrict: "E",
        replace: true,
        scope: {
            data:'=?'
        },
        transclude: false,
        template:"<div></div>",
        link: function(scope,element){
            function render(){
                var DimNum = order.length;                  //维度数
                var ordertxt = order;        //order顺序
                var orderNum = ordertxt.length;
                var UnitRadius=360/orderNum;

                tmpmax = -99999;

                var centerX=240.0;
                var centerY=270.0;
                var r = 190;
                var outerRadius = 200;
                var innerRadius = 180;

                var DimPoint = new Array();
                var Radius = new Array();

                var NodePoint =new Array();

//compute DimPoint
                for(var i=0;i<orderNum;i++){
                    DimPoint[i]=new Array();
                }
                for(var i=0; i<orderNum;i++){
                    Radius[i] = (UnitRadius*i)*Math.PI/180;
                    DimPoint[i][0]=r*Math.cos(Radius[i]);
                    DimPoint[i][1]=r*Math.sin(Radius[i]);
                    DimPoint[i][2]=ordertxt[i];
                }
//compute Data Point
                d3.csv("iris-normalization.csv",function(RecordData){
                    for(var i=0;i<RecordData.length;i++){
                        NodePoint[i]=new Array();
                    }
                    for(var i=0;i<RecordData.length;i++){
                        var tt=RecordData[i].dimData;
                        var t1=tt.split(",");
                        for(var j=0;j<t1.length;j++){
                            t1[j]=parseFloat(t1[j]);
                        }
                        RecordData[i].dimData = t1;

                    }



                        var dataStr = "";
                        for (var i = 0; i < RecordData.length; i++) {
                            var SumDown = getSumDown(RecordData[i].dimData, orderNum);
                            var SumUpX = getSumUpX(RecordData[i].dimData, Radius, orderNum);
                            var SumUpY = getSumUpY(RecordData[i].dimData, Radius, orderNum);
                            var CoordX = SumUpX / SumDown;
                            var CoordY = SumUpY / SumDown;
                            NodePoint[i][0] = CoordX + centerX;
                            NodePoint[i][1] = CoordY + centerY;
                            NodePoint[i][2] = RecordData[i].classId;
                            NodePoint[i][3] = RecordData[i].id;
                            dataStr = dataStr + NodePoint[i][3] + "," + NodePoint[i][0] + "," + NodePoint[i][1] + "," + NodePoint[i][2] + "\n";

                        }

                        d3.select(element[0]).select('svg').remove();

                        var svg = d3.select(element[0]).append("svg").attr("width", 600).attr("height", 500);

                        var dimdata = [];
                        for (var i = 0; i < DimNum; i++) {
                            dimdata[i] = 1;
                        }
//draw arc
                        var pie = d3.layout.pie().sort(null);
                        var arc = d3.svg.arc()
                                .startAngle(function (d, i) {
                                    return (UnitRadius * i + 90 - 0.5 * UnitRadius + 1) * Math.PI / 180
                                })
                                .endAngle(function (d, i) {
                                    return (UnitRadius * i + 90 + 0.5 * UnitRadius) * Math.PI / 180
                                })
                                .innerRadius(innerRadius)
                                .outerRadius(outerRadius)
                            ;
                        var arcs = svg.selectAll("g.arc").data(pie(dimdata)).enter()
                                .append("g").attr("class", "arc").attr("transform",
                                    "translate(" + centerX + "," + centerY + ")")
                            ;
                        arcs.append("path")
                            //.style("stroke","red")
                            //.style("stroke-opacity",0)
                            //	.style("stroke-width",0)
                            .attr("fill", function (d, i) {
                                var color1 = ["#006650", "#f5ab00", "#db4527", "#005687"];
                                return color1[i];
                            })
                            .attr("d", arc);
//show Dimension Point
                        svg.selectAll("circle")
                            .data(DimPoint)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d) {
                                return d[0] + centerX;
                            })
                            .attr("cy", function (d) {
                                return d[1] + centerY;
                            }).attr("r", 4)
                            .attr("opacity", 0.8);

                        svg.selectAll("text")
                            .data(DimPoint)
                            .enter()
                            .append("text")
                            .text(function (d) {
                                return d[2];
                            })
                            .attr("x", function (d) {
                                return d[0] + centerX;
                            }).attr("y", function (d) {
                                return d[1] + centerY;
                            }).attr("font-family", "sans-serif")
                            .attr("font-size", 15)
                            .attr("stroke-width", 2)
                            .attr("fill", "black");
//show data point
                        var Nodes = svg.selectAll("RadViz")
                            .data(NodePoint)
                            .enter()
                            .append("circle")
                            .attr("class", "node")
                            .attr("id", function (d, i) {
                                return i;
                            })
                            .attr("cx", function (d, i) {
                                return d[0];
                            })
                            .attr("cy", function (d, i) {
                                return d[1];
                            })
                            .attr("r", 4.5)
                            .attr("class", "nodes")
                            .style("opacity", 0.8)
                            .style("fill", function (d, i) {
                                var color;
                                if (d[2] == "1")
                                    color = "#ffc2ce";
                                else if (d[2] == "2")
                                    color = "#0ffa1d";
                                else if (d[2] == "3")
                                    color = "#fee905";
                                return color;
                            })
                            .style("stroke", "black")
                            .style("stroke-width", 0.8)
                            .append("title")
                            .text(function (d) {
                                return "point" + d[3] + "-class:" + d[2];
                            });

                });//.data

                function getSumUpX(RecordData,Radius,orderNum){
                    var TempUpX=0;
                    for(var i=0;i<orderNum;i++){
                        TempUpX=TempUpX+r*RecordData[i]*Math.cos(Radius[i]);
                    }
                    return TempUpX;
                }
                function getSumUpY(RecordData,Radius,orderNum){
                    var TempUpY=0;
                    for(var i=0;i<orderNum;i++){
                        TempUpY=TempUpY+r*RecordData[i]*Math.sin(Radius[i]);
                    }
                    return TempUpY;
                }
                function getSumDown(RecordData,orderNum){
                    var TempDown=0;
                    for(var i=0;i<orderNum;i++){
                        TempDown =TempDown+RecordData[i];
                    }
                    return TempDown;
                }


            }



            scope.$watch("order", debounce(function(){
                console.log(order+" changed");
                render();
            },true),400);


            render();


        }

    }



})