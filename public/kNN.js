/**
 *
 * Created by Chih-Hao on 15/11/26.
 */
function EuclidDistance(a,b){
    var tmpDis=0.0;

    for(var i=0;i< b.length;i++)
    {
        tmpDis=tmpDis+(a[i]-b[i])*(a[i]-b[i]);
    }
//	console.log('tmpDis is:'+ Math.sqrt(tmpDis));
    return Math.sqrt(tmpDis);

}

function kNN(data,newData,k){

    var distance = new Array();
    for(var i = 0;i<data.length;i++){

        distance[i]=EuclidDistance(data[i],newData);
    }
//    console.log(distance)

    if(k-1<=data.length){

        var tmpDistance = new Array();
        for(var j =0;j<distance.length;j++)
        {
            tmpDistance[j]=new Array();
            tmpDistance[j][0]=distance[j];
            tmpDistance[j][1]=j;
//            console.log(tmpDistance[j][0]+" point"+tmpDistance[j][1]);

        }



        tmpDistance.sort(function(a,b){return a[0]- b[0]});

        var s = '';
        for(var iii=0;iii<distance.length;iii++){
            s=s+tmpDistance[iii][0]+" "+tmpDistance[iii][1]+'\n';
        }
//        console.log(s)

        var sequence = new Array();
        var str="";
        for(var jj=0;jj<k;jj++)
        {
//            str=str+tmpDistance[jj+1][1]+" "+tmpDistance[jj+1][0]+'\n';

            sequence[jj]=tmpDistance[jj+1][1];
        }
//        console.log(str)
        return sequence;
    }
}


