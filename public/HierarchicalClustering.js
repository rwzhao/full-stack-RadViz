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
//  console.log(data.length);
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
                if (i==j) continue;

                var tmp1=[];
                    tmp1=myMap.get(key[i]);
                var tmp2=[];
                    tmp2 =myMap.get(key[j]);
                var dis = calculateDis(tmp1,tmp2);
//                console.log(dis);
                if(dis>tmpMax)
                {
                    console.log(dis);
                    tmpMax=dis;
                    tmpx=key[i];
                    tmpy=key[j];
                }

            }
        }

        console.log(tmpy+" "+tmpx);
        if((myMap.get(tmpy)).length>((myMap.get(tmpx)).length))
        {
            var tmp = tmpy;
            tmpy=tmpx;
            tmpx=tmp;
        }

        var tmpArr = [];
        tmpArr=myMap.get(tmpx).concat(myMap.get(tmpy));
        console.log(tmpArr);
        myMap.set(tmpx,tmpArr);
        myMap.remove(tmpy);

    }

    function calculateDis(tmp1,tmp2)
    {
        var len1= tmp1.length;
        var len2= tmp2.length;
        var dis =0;

        for(var i=0;i<len1;i++)
        {
            for(var j =0;j<len2;j++)
            {
                dis+=data[tmp1[i]][tmp2[j]];
            }
        }
        return dis/(len1*len2);
    }

}



Hcluster(data);


