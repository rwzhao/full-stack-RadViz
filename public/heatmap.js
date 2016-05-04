var debounce = function(f, timeout) {
    var id = -1;
    return function() {
        if (id > -1) {
            window.clearTimeout(id);
        }
        id = window.setTimeout(f, timeout);
    }
};

angular.module("heatmap", []).directive("heatmap",
    function() {
        return {
            restrict: "E",
            replace: true,
            scope: {
                data: "=",
                options: "=?",
                dispatch: "=?",
                dimOrder:"=?"
            },
            transclude: false,
            template: "<div></div>",
            link: function(scope, element) {

                var options = {
                    legend: true,
                    margin: { top: 50, right: 0, bottom: 100, left: 50 },
                    buckets: 10,
                    colors: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"],
                    duration: 1000,
                    legendWidth: 0.4,
                    breaks: null
                };

                if (scope.options) {
                    options = angular.extend(options, scope.options);
                }


                scope.dispatch = d3.dispatch("click", "mouseover", "mouseout", "mousemove");

                var render = function() {

                    var colorScales = d3.scale.linear()
                        .domain([-1,0,1])
                        .range(["#31a354","#ffffff","#e6550d"]);

                    var w = element[0].offsetWidth;
                    var h = element[0].offsetHeight;
                    var width = w - options.margin.left - options.margin.right;
                    var height = h - options.margin.top - options.margin.bottom;

                    d3.select(element[0]).select("svg").remove();

                    var svg = d3.select(element[0]).append("svg")
                        .attr("width", width*2 + options.margin.left + options.margin.right)
                        .attr("height", height + options.margin.top + options.margin.bottom)
                        .append("g")
                        .attr('class','heat')
                        .attr("transform", "translate(" + options.margin.left + "," + options.margin.top + ")")
//                        .append('g')
//                        .attr('class','rad');

                    var xu = {};
                    var x = [];
                    var yu = {};
                    var y = [];

                    var theLabel = 0;

                    for (var i in scope.data) {
                        if (typeof(xu[scope.data[i].x]) == "undefined") {
                            x.push(scope.data[i].x);
                        }
                        xu[scope.data[i].x] = 0;
                        if (typeof(yu[scope.data[i].y]) == "undefined") {
                            y.push(scope.data[i].y);
                        }
                        yu[scope.data[i].y] = 0;
                    }

                    for (d in scope.data) {
                        scope.data[d].xIndex = x.indexOf(scope.data[d].x);
                        scope.data[d].yIndex = y.indexOf(scope.data[d].y);
                    }

                    var drag = d3.behavior.drag()
                        .on('drag',dragText)
                        .on('dragstart',dragStart)
                        .on('dragend',dragEnd);

                    var dragX = d3.behavior.drag()
                        .on('drag',dragTextX)
                        .on('dragstart',dragStartX)
                        .on('dragend',dragEnd);

                    function dragStartX () {
                        d3.select(this).attr('fill', 'red').attr('font-weight', '900')
                    }

                    function dragTextX (d,i){
//                        console.log(i);

                        var y=   d3.event.x-i*xGridSize;
                        var x=  -d3.event.y;
//                        console.log("d3.event.y:"+d3.event.y);
//                        console.log("d3.event.x:"+d3.event.x);
//                        console.log(xGridSize+"  == "+yGridSize);

//                        var tmp=(d3.event.x-xGridSize/2)/xGridSize;
                        var tmp = Math.ceil(d3.event.x/xGridSize)-1;
//                        console.log(tmp+"  tmp")

                        if(tmp<=0)
                        {
                            theLabel=0;
                        }else if(tmp>=Math.sqrt(data.length))
                        {
                            theLabel=Math.sqrt(data.length)-1;
                        }else
                        {
                            theLabel=tmp;
                        }

                        d3.select(this)
                            .attr('transform',function(d){
                                return "rotate(-90) translate("+x+','+y+')';
                            })
                    }


                    function dragStart (){
                        d3.select(this).attr('fill','red').attr('font-weight','900');
                    }

                    function dragText (d,i){
//                        console.log(i);

                        var x=   d3.event.x;
                        var y=  d3.event.y-yGridSize*i;
//                        console.log("d3.event.y:"+d3.event.y);

                        var tmp = cal((y-yGridSize)/yGridSize);
//                        console.log(tmp+"  tmp");

                        if(tmp+i>=Math.sqrt(data.length))
                        {
                            theLabel=Math.sqrt(data.length);
                        }else if(tmp+i<=0){
                            theLabel=0;
                        }else{
                            theLabel=tmp+i;
                        }

                        d3.select(this)
                            .attr('transform',function(d){
                                return "translate("+x+','+y+')';
                            })
                    }

                    function dragEnd(d,i){
                        d3.select(this)
                            .attr('fill','black');

                        if(theLabel!=i)
                            changeLabelOrder(data,theLabel,i);

                        scope.$apply(order); //very import

//                        console.log(order);

                        render();
                        renderRadViz();
                    }

                    var xGridSize = Math.floor(width / x.length);
                    var yGridSize = Math.floor(height / y.length);
                    var legendElementWidth = Math.floor(width * options.legendWidth / (options.buckets));
                    var legendElementHeight = height / 20;

                    var yLabels = svg.selectAll(".yLabel")
                        .data(y)
                        .enter().append("text")
                        .text(function (d) { return d; })
                        .attr("x", 0)
                        .attr("y", function (d, i) { return i * yGridSize; })
                        .style("text-anchor", "end")
                        .attr("transform", "translate(-6," + yGridSize / 1.5 + ")")
                        .attr("class", function (d, i) { return ("yLabel axis"); })
                        .call(drag);

                    var xLabels = svg.selectAll(".xLabel")
                        .data(x)
                        .enter().append("text")
                        .text(function(d) { return d; })
                        .attr("y", function(d, i) { return i * xGridSize; })
                        .attr("x", 0)
                        .style("text-anchor", "start")
                        .attr("transform", "rotate(-90) translate(10, " + xGridSize / 2 + ")")
                        .attr("class", function(d, i) { return ("xLabel axis"); })
                        .call(dragX);

//                    var colorScales = [];
//                    if (options.breaks != null && options.breaks.length > 0) {
//                        for (b in options.colors) {
//                            colorScales.push(d3.scale.quantile()
//                                .domain([0, options.buckets - 1, d3.max(scope.data, function(d) { return d.value; })])
//                                .range(options.colors[b]));
//                        }
//                    } else {
//                        colorScales.push(d3.scale.quantile()
//                            .domain([0, options.buckets - 1, d3.max(scope.data, function(d) { return d.value; })])
//                            .range(options.colors));
//                    }

                    var cards = svg.selectAll(".square")
                        .data(scope.data);

//                    console.log(scope.data[0])

                    cards.enter().append("rect")
                        .filter(function(d) { return d.value != null })
                        .attr("x", function(d) { return d.xIndex * xGridSize; })
                        .attr("y", function(d) { return d.yIndex * yGridSize; })
                        .attr("class", "square")
                        .attr("width", xGridSize)
                        .attr("height", yGridSize)
                        .on("click", function(d) { scope.dispatch.click(d); })
                        .on("mouseover", function(d) { scope.dispatch.mouseover(d); })
                        .on("mouseout", function(d) { scope.dispatch.mouseout(d); })
                        .on("mousemove", function(d) { scope.dispatch.mousemove(d); })
                        .style("fill", "#ffffff");

                    cards.transition().duration(options.duration).style("fill", function(d) {
                        if (options.customColors && options.customColors.hasOwnProperty(d.value)) {
                            return options.customColors[d.value];
                        } else if (options.breaks != null && options.breaks.length > 0) {
                            for (b in options.breaks) {
                                if (d.xIndex < options.breaks[b]) {
                                    return colorScales[b](d.value);
                                }
                            }
                            return colorScales[options.breaks.length](d.value);
                        } else {
                            return colorScales(d.value);
                        }
                    });

                    cards.exit().remove();

                    if (options.legend) {

                        var lenendData = [];
                        for(var i=0;i<11;i++)
                        {
                            lenendData.push(i/5-1);
                        }

                        var legend = svg.selectAll(".legend")
                            .data(lenendData)

                        legend.enter().append("g").attr("class", "legend");

                        function ondrag(d){
                            d3.select(this)
                                .attr('x',function(){
                                    if(d3.event.x<0)
                                        return 0;
                                    if(d3.event.x>10*legendElementWidth)
                                        return 9.75*legendElementWidth;
                                    return d3.event.x})
                                .attr('y',height*1.05-legendElementHeight/2)
                                .attr("width", legendElementWidth/4)
                                .attr("height", legendElementHeight/2)
                                .style("fill", function(d, i) { return colorScales(lenendData[(d3.event.x)/legendElementWidth]); })

                            d3.selectAll('.square').classed('hiddenCards',function(d){
                                if(d.value<(d3.event.x-5*legendElementWidth)/(5.0*legendElementWidth))
                                    return true;
                                return false;
                            });
                        }

                        var dragMin = d3.behavior.drag()
                            .on('dragstart',function(){
                            })
                            .on('drag',ondrag)
                            .on('dragend',function () {
                                d3.select('.rectMin').remove()
                            })
                        
                        legend.append('rect')
                            .attr('class','rectMin')
                            .attr('x',-legendElementWidth/4)
                            .attr('y',height*1.05-legendElementHeight/2)
                            .attr("width", legendElementWidth/4)
                            .attr("height", legendElementHeight/2)
                            .style("fill", function(d, i) { return colorScales(lenendData[0]); })
                            .call(dragMin)


                        legend.append('rect')
                            .attr('x',20*legendElementWidth/2)
                            .attr('y',height*1.05-legendElementHeight/2)
                            .attr("width", legendElementWidth/4)
                            .attr("height", legendElementHeight/2)
                            .style("fill", function(d, i) { return colorScales(lenendData[9]); })

                        legend.append("rect")
                            .attr("x", function(d, i) { return legendElementWidth * i; })
                            .attr("y", height * 1.05)
                            .attr("width", legendElementWidth)
                            .attr("height", legendElementHeight)
                            .style("fill", function(d, i) { return colorScales(lenendData[i]); })
                            .style("visibility", function(d, i) { return(i < options.buckets ? "visible" : "hidden") });

                        legend.append("text")
                            .attr("class", "legendLabel")
                            .text(function(d,i) { if(i%2==0) return lenendData[i].toFixed(1); })
                            .attr("x", function(d, i) { return legendElementWidth * i; })
                            .attr("y", height * 1.15)
                            .style("text-anchor", "middle");

                        legend.exit().remove();


                    }


                };


                scope.$watch("data", debounce(function() {
                    render();
                },true),400);

                scope.$watch("order", debounce(function() {
                    render();
                    renderRadViz();
                },true),400);




//                d3.select(window).on("resize", debounce(function() {
//                    render();
//                }, 500));

                function cal(x)
                {
                    if(x>0)
                        return Math.ceil(x);
                    else if (x==0) {
                        return 0;
                    }else{
                        return Math.ceil(x);
                    }
                }



                function changeLabelOrder(data,i,j)
                {
                    var tmpLabel = order[i];
                    order[i]=order[j];
                    order[j]=tmpLabel;
//                    console.log(order);

                    var iLabel = "";
                    var jLabel = "";
                    for(var k=0;k<data.length;k++)
                    {
                        if(data[k].xIndex===i) {
                            iLabel = data[k].x;

                        }
//                        console.log(iLabel);
                    }
                    for(var k=0;k<data.length;k++)
                    {
                        if(data[k].yIndex===j) {
                            jLabel = data[k].y;

                        }
//                        console.log(jLabel);

                    }

                    for(var k=0;k< data.length;k++)
                    {
                        if(data[k].xIndex===i){
                            data[k].xIndex=j;
                            data[k].x=jLabel;
                        }else if(data[k].xIndex===j)
                        {
                            data[k].xIndex=i;
                            data[k].x=iLabel;
                        }

                        if(data[k].yIndex===i){
                            data[k].yIndex=j;
                            data[k].y=jLabel;
                        }else if(data[k].yIndex===j)
                        {
                            data[k].yIndex=i;
                            data[k].y=iLabel;
                        }
                    }
                    var n = Math.sqrt(data.length);
                    for(var k=0;k<n;k++)
                    {

                        tmp = data[i+k*n].value;
                        data[i+k*n].value=data[j+k*n].value;
                        data[j+k*n].value=tmp;
                    }
                    for(var k=0;k<n;k++)
                    {

                        tmp = data[i*n+k].value;
                        data[i*n+k].value=data[j*n+k].value;
                        data[k+j*n].value=tmp;
                    }

//                   data.pop();


                }



                    function renderRadViz() {

                        var DimNum = order.length;                  //维度数
                        var ordertxt = order;        //order顺序
                        var orderNum = ordertxt.length;
                        var UnitRadius = 360 / orderNum;

                        tmpmax = -99999;

//                        var tmpArr = get_permutation(DimNum);
//                        console.log(tmpArr[0]);
//                        var finalOrdertxt = new Array();

                        var centerX = 240.0;
                        var centerY = 270.0;
                        var r = 190;
                        var outerRadius = 200;
                        var innerRadius = 180;

                        var DimPoint = new Array();
                        var Radius = new Array();

                        var NodePoint = new Array();

//compute DimPoint
                        for (var i = 0; i < orderNum; i++) {
                            DimPoint[i] = new Array();
                        }
                        for (var i = 0; i < orderNum; i++) {
                            Radius[i] = (UnitRadius * i) * Math.PI / 180;
                            DimPoint[i][0] = r * Math.cos(Radius[i]);
                            DimPoint[i][1] = r * Math.sin(Radius[i]);
                            DimPoint[i][2] = ordertxt[i];
                        }
//compute Data Point
                        d3.csv("./flowers.csv", function (error, RecordData) {

                            var dimensions = [];


                            var n;
                            if (error) {
                                throw error;
                            } else {
                                dimensions = (d3.keys(RecordData[0]).filter(function (d) {
                                    return d !== "species" && d !== 'id';
                                }));
                            }

//                            console.log(RecordData);
                            var d = new Array(); // variable array
                            var dd = new Array();
                            for(var i=0;i<dimensions.length;i++)
                            {
                                d[i]=new Array();
                            }

                            for(var i=0;i<RecordData.length;i++)
                            {
                                dd[i]=new Array();
                            }


                            for(var i =0;i<RecordData.length;i++)
                            {
                                for(var ii=0;ii<dimensions.length;ii++)
                                {
                                    var t = dimensions[ii];
                                    d[ii].push(+RecordData[i][t]);

                                }
                            }


                            n = dimensions.length;
                            for(var i=0;i<n;i++)
                            {
                                var tmpMin = d3.min(d[i]);
                                var tmpMax = d3.max(d[i]);
//                                console.log(tmpMax+" tmpMax "+tmpMin+" tmpMin");
                                for(var j=0;j<d[0].length;j++) {
                                    d[i][j] = ((d[i][j] - tmpMin) / (tmpMax - tmpMin)).toFixed(3);
                                }
                            }

                            for(var i=0;i<RecordData.length;i++)
                                for(var j=0;j<dimensions.length;j++)
                                {
                                    dd[i][j]=+d[j][i];
//                                    console.log(dd[i][j]+" i:"+i+" j:"+j);
                                }



                            for (var i = 0; i < RecordData.length; i++) {
                                NodePoint[i] = new Array();
                            }
                            for (var i = 0; i < RecordData.length; i++) {

                                RecordData[i].dimData = dd[i];
                            }



                                var RecordData1 = RecordData.slice();
                                for (var i = 0; i < RecordData1.length; i++) {
                                    var t1 = RecordData1[i].dimData;

                                    var t2 = new Array(t1.length);
                                    for (var k = 1; k <= ordertxt.length; k++) {
                                        t2[k - 1] = t1[ordertxt[k - 1] - 1];
                                    }
                                    RecordData1[i].dimData = t2;
                                }

                                var classCount = 0;
                                var classes = [];
                                var dataStr = "";
                                for (var i = 0; i < RecordData.length; i++) {
                                    var SumDown = getSumDown(RecordData[i].dimData, orderNum);
                                    var SumUpX = getSumUpX(RecordData[i].dimData, Radius, orderNum);
                                    var SumUpY = getSumUpY(RecordData[i].dimData, Radius, orderNum);
                                    var CoordX = SumUpX / SumDown;
                                    var CoordY = SumUpY / SumDown;
                                    NodePoint[i][0] = CoordX + centerX;
                                    NodePoint[i][1] = CoordY + centerY;
                                    NodePoint[i][2] = RecordData[i].species;
                                    if (classCount == 0) {
                                        classes[classCount++] = NodePoint[i][2];
                                    } else {
                                        var flag = 0;
                                        for (var kk = 0; kk < classCount; kk++) {
                                            if (classes[kk] == NodePoint[i][2]) {
                                                flag = 1;
                                                break;
                                            }

                                        }
                                        if (flag == 0) {
                                            classes[classCount++] = NodePoint[i][2];
                                        }
                                    }
//                                console.log(classCount);

                                    NodePoint[i][3] = RecordData[i].id;
                                    dataStr = dataStr + NodePoint[i][3] + "," + NodePoint[i][0] + "," + NodePoint[i][1] + "," + NodePoint[i][2] + "\n";
//                                console.log(dataStr);
                                }

                                d3.select(element[0]).select('svg .rad').remove();


                                var svg = d3.select('svg')
                                    .append('g')
                                    .attr('class', 'rad')
                                    .attr("width", 600).attr("height", 500)
                                    .attr("transform", "translate(" + 800 + "," + 50 + ")");

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
                                        var color1 = ["#006650", "#f5ab00", "#db4527", "#005687", "#C0FF3E", "#B452CD", "#8B1A1A", "#87CEFA", "#7CFC00", "#00F5FF", "#FFFF00", "#FF3E96", "#CD9B1D", "#CCCCCC", "#9400D3", "#7AC5CD"];

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


                                var dunnsindex = (dunnsIndex(classCount, NodePoint));

//                                console.log("dunnsindex:"+dunnsindex+"  "+ordertxt);




                            svg.append('text')
                                .text('Dunns Index: '+dunnsindex.toFixed(3))
//                                .attr('x',width)
//                                .attr('y',height)
                                .attr('dx',50)


                        });//.data


                        function getSumUpX(RecordData, Radius, orderNum) {
                            var TempUpX = 0;
                            for (var i = 0; i < orderNum; i++) {
                                TempUpX = TempUpX + r * RecordData[i] * Math.cos(Radius[i]);
                            }
                            return TempUpX;
                        }

                        function getSumUpY(RecordData, Radius, orderNum) {
                            var TempUpY = 0;
                            for (var i = 0; i < orderNum; i++) {
                                TempUpY = TempUpY + r * RecordData[i] * Math.sin(Radius[i]);
                            }
                            return TempUpY;
                        }

                        function getSumDown(RecordData, orderNum) {
                            var TempDown = 0;
                            for (var i = 0; i < orderNum; i++) {
                                TempDown = TempDown + RecordData[i];
                            }
                            return TempDown;
                        }


                    }


            }
        }
    }
);





