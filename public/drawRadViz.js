/**
 *
 * Created by Chih-Hao on 16/1/13.
 */

function drawRadViz()
{
    var width = 600, height = 500;

//    document.getElementById("RadViz").removeChild(document.getElementsByClassName('.radviz'));

    var svg = d3.select(RadViz).append("svg").attr('class','radviz').attr("width",width).attr("height", height) ;


    var dimdata = [];
    for ( var i = 0; i < DimNum; i++) {
        dimdata[i] = 1;
    }


//draw arc
    var pie = d3.layout.pie().sort(null);
    var arc = d3.svg.arc()
            .startAngle(function(d,i){
                return (UnitRadius*i+90-0.5*UnitRadius+1)* Math.PI/180})
            .endAngle(function(d,i){return (UnitRadius*i+90+0.5*UnitRadius)*Math.PI/180})
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
        .attr("fill",function(d, i) {
            var color1=["#006650","#f5ab00","#db4527","#005687","#ffddcc"];
            return color1[i];
        })
        .attr("d", arc);
//show Dimension Point
    svg.selectAll("circle")
        .data(DimPoint)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return d[0]+centerX;
        })
        .attr("cy", function(d) {
            return d[1]+centerY;
        }).attr("r", 4)
        .attr("opacity",0.8);

    svg.selectAll("text")
        .data(DimPoint)
        .enter()
        .append("text")
        .text(function(d) {
            return d[2];
        })
        .attr("x", function(d) {
            return d[0]+centerX ;
        }).attr("y", function(d) {
            return d[1]+centerY;
        }).attr("font-family", "sans-serif")
        .attr("font-size", 15)
        .attr("stroke-width",2)
        .attr("fill", "black");


//show data point
    var Nodes = svg.selectAll("RadViz")
        .data(FianlNodePoint)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("id",function(d,i){return i;})
        .attr("cx",function(d,i){ return d[0]; })
        .attr("cy",function(d,i){return d[1];})
        .attr("r", 4.5)
        .attr("class","nodes")
        .style("opacity",0.8)
        .style("fill",function(d, i) {
            var color;
            if (d[2] == "1")
                color = "#ffc2ce";
            else if (d[2] == "2")
                color = "#0ffa1d";
            else if (d[2] == "3")
                color = "#fee905";
            return color;
        });

    Nodes.on("mouseenter",function(){d3.select(this).style('fill','red')

        var x = d3.select(this).attr('cx');
        var y = d3.select(this).attr('cy');

//                    alert(x+" "+y)
//                    var sequence = new Array();
        sequence = kNN(FianlNodePoint,[x,y],5);
        var NN=  Nodes.filter(function(d,i){
            var flag=false;
            for(var i=0;i<sequence.length;i++)
            {
                if(d[3]==sequence[i]){
                    flag=true;
                }
            }
            return flag;
        }).style('fill','red')

    })
        .on('mouseleave',function(d,i){Nodes.style("fill",function(d, i) {
            var color;
            if (d[2] == "1")
                color = "#ffc2ce";
            else if (d[2] == "2")
                color = "#0ffa1d";
            else if (d[2] == "3")
                color = "#fee905";
            return color;
        })})

        .style("stroke", "black")
        .style("stroke-width", 0.8)
        .append("title")
        .text(function(d) { return "point"+d[3]+"-class:"+d[2]; })

    Nodes.on('click',function(d,i){

//                   var x = d3.select(this).attr('cx')
//                   var y = d3.select(this).attr('cy')

        var x = d[0];
        var y = d[1];

//                    alert(x+" "+y)
//                    var sequence = new Array();
        sequence = kNN(FianlNodePoint,[x,y],5);
//                    alert(sequence);
        var Str="";
        for(var kk=0;kk<sequence.length;kk++){
            Str=Str+FianlNodePoint[sequence[kk]][2]+"  ";
        }
        alert(Str);



    })

    var KNum =15;
    var right = 0;
    for(var i=0;i<FianlNodePoint.length;i++) {
        var tmp = new Array();
        tmp = [FianlNodePoint[i][0], FianlNodePoint[i][1]];
//                    console.log(tmp);

        sequence = kNN(NodePoint, tmp, KNum);
        var count1 = 0;
        var count2 = 0;
        var count3 = 0;
        for (var kk = 0; kk < sequence.length; kk++) {
            if (FianlNodePoint[sequence[kk]][2] == 1) {
                count1++;
            } else if (FianlNodePoint[sequence[kk]][2] == 2) {
                count2++;
            } else if (FianlNodePoint[sequence[kk]][2] == 3) {
                count3++;
            }
        }

        var max = Math.max(count1, Math.max(count2, count3))
        var predict = 0;
        if (count1 == max) {
            predict = 1;
        } else if (count2 == max) {
            predict = 2;
        } else if (count3 == max) {
            predict = 3;
        }
        if (FianlNodePoint[i][2] == predict) {
            right++;
        } else {
            console.log("predict is " + predict + " NodePoint is " + FianlNodePoint[i][2])
        }
    }
    console.log(right);

//    var dunnsindex = (dunnsIndex(2,FianlNodePoint));
//
//    svg.append('text')
//        .text('Dunns Index: '+dunnsindex.toFixed(3))
//        .attr('x',width)
//        .attr('y',height)
//        .attr('dx',-250)
}

function clone(o){
    var k, ret= o, b;
    if(o && ((b = (o instanceof Array)) || o instanceof Object)) {
        ret = b ? [] : {};
        for(k in o){
            if(o.hasOwnProperty(k)){
                ret[k] = clone(o[k]);
            }
        }
    }
    return ret;
}