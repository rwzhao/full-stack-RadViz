/**
 *
 * Created by Chih-Hao on 16/3/29.
 */


var data = new Array(4);

data [0] = new Array();
data[0]=[1,-0.12,0.87,0.82];
data[1]=[-0.12,1,-0.43,-0.37];
data[2]=[0.87,-0.43,1,0.96];
data[3]=[0.82,-0.37,0.96,1];

function Hcluster(data)
{
//	console.log(data.length);
    var len = data.length;
    var myMap = d3.map();

    for(var i=0;i<data.length;i++)
    {
        myMap.set(i,[i]);
    }

//    console.log(myMap);

    for(var i=0;i<len;i++)
    {
        data[i][i]=-9999;
    }
    var clusterNum=data.length;
    while (clusterNum>1) {
        merge();
        clusterNum--;
    }
    console.log(myMap);

    function merge()
    {
        var tmpMax =-9999;
        var tmpx=-1,tmpy=-1;
        var key = myMap.keys();
        for(var i =0;i<key.length;i++) {
            for (var j = 0; j < key.length; j++) {
                if (i == j) continue;
                if (tmpMax < data[i][j]) {
                    tmpMax = data[i][j];
                    tmpx = i;
                    tmpy = j;
                }
            }
        }

        var tmpArr = [];
        tmpArr=myMap.get(tmpx).concat(myMap.get(tmpy));
        console.log(tmpArr);
        myMap.set(tmpx,tmpArr);
        myMap.remove(tmpy);

    }

}



Hcluster(data);


