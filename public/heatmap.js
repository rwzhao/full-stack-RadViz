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
                dimensions: "=?"

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
                        .attr("width", width + options.margin.left + options.margin.right)
                        .attr("height", height + options.margin.top + options.margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + options.margin.left + "," + options.margin.top + ")");

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

                        render();
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
                        .call(drag);

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

//                scope.$watch("dimensions", debounce(function() {
//                    console.log('false12')
//                    render();
//                },true),400);

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

            }
        }
    }
);





