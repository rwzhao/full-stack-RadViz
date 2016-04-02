/**
 *
 * Created by Chih-Hao on 16/4/2.
 */

d3.csv("./flowers.csv", function (error, data1) {

    var dimensions = [];

    var n;
    if (error) {
        throw error;
    } else {
        dimensions = (d3.keys(data1[0]).filter(function (d) {
            return d !== "species" && d !== 'id';
        }));
    }



    var d = new Array();
    for(var i=0;i<dimensions.length;i++)
    {
        d[i]=new Array();
    }

    for(var i =0;i<data1.length;i++)
    {
        for(var ii=0;ii<dimensions.length;ii++)
        {
            var t = dimensions[ii];
            d[ii].push(+data1[i][t]);
        }
    }


    n = dimensions.length;
    for(var i=0;i<n;i++)
    {
        var tmpMin = d3.min(d[i]);
        var tmpMax = d3.max(d[i]);
        for(var j=0;j<d[0].length;j++) {
            d[i][j] = (d[i][j] - tmpMin) / (tmpMax - tmpMin);
            d[i][j].toFixed(2);
        }
    }


    for (var i = 0; i < n; i++)
        for (var j = 0; j < d[0].length; j++) {
         console.log(d[i][j]+" "+i + " "+j);
        }
});
