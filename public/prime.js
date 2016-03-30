/**
 *
 * Created by Chih-Hao on 16/3/30.
 */
var data = new Array(4);

data[0]=[1,-0.12,0.87,0.82];
data[1]=[-0.12,1,-0.43,-0.37];
data[2]=[0.87,-0.43,1,0.96];
data[3]=[0.82,-0.37,0.96,1];

function prime(data)
{
    var len = data.length;
    var used = d3.set();
    var toUse = d3.set();
    used.add(0);
    for(var i=1;i<len;i++)
    {
        toUse.add(i);
    }



   while(toUse.values().length!=0){
        var tmpUsed =-1,tmpToUse=-1;
        var tmpMin =-9999;
        used.forEach(function(value){
            toUse.forEach(function(value1){
                console.log(value);
                if(tmpMin<data[value][value1]){
                    tmpMin=data[value][value1];
                    tmpUsed=value;
                    tmpToUse=value1;
                }
            })
        })
        used.add(tmpToUse);
        toUse.remove(tmpToUse);
        console.log(tmpToUse+" and "+tmpUsed+"  "+data[tmpToUse][tmpUsed]);


    }




}

prime(data);