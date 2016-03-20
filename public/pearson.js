function calculate(x,y){
    var sumx = 0,sumy = 0,sumSqrx = 0,sumSqry = 0,sumXY = 0;
    for(var i=0;i< x.length;++i){
        sumx += x[i];
        sumy += y[i];

        sumSqrx += x[i]*x[i];
        sumSqry += y[i]*y[i];

        sumXY += x[i]*y[i];
    }
    var ret = (sumXY* x.length - sumx * sumy) / (Math.sqrt((sumSqrx* x.length - sumx*sumx)) * Math.sqrt((sumSqry* y.length - sumy*sumy)) );
    console.log(ret);
    return ret;
}
