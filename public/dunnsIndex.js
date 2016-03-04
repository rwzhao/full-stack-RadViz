/**
 *
 * Created by Chih-Hao on 16/1/12.
 */

function dunnsIndex(clusters_number,NodePoint) {

    var s = new Set();
    var distance = new Array(clusters_number + 1);
    for (var i = 0; i < NodePoint.length; i++) {
        if (s.has(NodePoint[i][2])) {
            distance[NodePoint[i][2]].push(NodePoint[i]);
        } else {
            distance[NodePoint[i][2]] = new Array();
            distance[NodePoint[i][2]].push(NodePoint[i]);
            s.add(NodePoint[i][2]);
        }
    }
    var withinDis = -99999;


//    console.log(distance[1]);

    for (var i = 1; i <= clusters_number; i++)
    {
        for(var j = 0;j<distance[i].length;j++)
        {
            for(var k=j+1;k<distance[i].length;k++)
            {
                var tmpDis = Math.sqrt((distance[i][j][0]-distance[i][k][0])*(distance[i][j][0]-distance[i][k][0])+(distance[i][j][1]-distance[i][k][1])*(distance[i][j][1]-distance[i][k][1]));

                if(withinDis<tmpDis)
                {
                    // for test
//                    console.log(distance[i][j][0]+"  "+distance[i][k][0]);
//                    console.log(distance[i][j][1]+"  "+distance[i][k][1]);
//                    console.log(distance[i][j][3]+"  :  "+distance[i][k][3]);
//                    console.log(tmpDis);
                    withinDis=tmpDis;
                }
            }
        }
    }


    var maxBetDis =-99999;
    for(var i = 1; i<=clusters_number;i++)
    {
        for(var j=i+1;j<=clusters_number;j++)
        {
            var tmpdis = calDisBetweenClusters(distance,i,j);
            if(maxBetDis<tmpdis)
            {
                maxBetDis=tmpdis;
            }
        }

    }


    return maxBetDis/withinDis;


}


function calDisBetweenClusters(distance,i,j){

    var maxBetweenDis = -99999;
    for(var ii=0;ii<distance[i].length;ii++){
        for(var jj=0;jj<distance[j].length;jj++)
        {
            var tmpDis = Math.sqrt((distance[i][ii][0]-distance[j][jj][0])*(distance[i][ii][0]-distance[j][jj][0])+(distance[i][ii][1]-distance[j][jj][1])*(distance[i][ii][1]-distance[j][jj][1]));
            if(maxBetweenDis<tmpDis){
                maxBetweenDis=tmpDis;
            }
         }
    }
    return maxBetweenDis;
}
