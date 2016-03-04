/**
 *
 * Created by Chih-Hao on 16/1/7.
 */

function drawArraw(svg,NodePoint) {

    var count = NodePoint.length;
    console.log("count is :"+count);

    for(var i=0;i<count;i++) {
        var defs = svg.append("defs");

        var arrowMarker = defs.append("marker")
            .attr("id", "arrow")
            .attr("markerUnits", "strokeWidth")
            .attr("markerWidth", "12")
            .attr("markerHeight", "12")
            .attr("viewBox", "0 0 12 12")
            .attr("refX", "6")
            .attr("refY", "6")
            .attr("orient", "auto");

        var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";

        arrowMarker.append("path")
            .attr("d", arrow_path)
            .attr("fill", "#000");

        var length = 15;


        console.log(NodePoint[i][0])


//        var x = NodePoint[i][0];
//        var y = NodePoint[i][1];
//        var angle = NodePoint[i][4];
//        console.log(angle);
//        var cos = Math.cos(angle*Math.PI/180);
//        var sin = Math.sin()
//        console.log('cos:'+cos)

        var line = svg.append("line")
            .attr("x1", NodePoint[i][0]+'px')
            .attr("y1", NodePoint[i][1]+'px')
            .attr("x2", (NodePoint[i][0]+length*Math.cos(NodePoint[i][4]*Math.PI/180))+'px')
            .attr("y2", (NodePoint[i][1]+length*Math.sin(NodePoint[i][4]*Math.PI/180))+'px')
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("marker-end", "url(#arrow)");
    }
}