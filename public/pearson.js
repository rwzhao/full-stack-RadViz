function get_pearson_co(X, Y){
 
    if (X.length != Y.length){
        console.log('wrong length');
    }
    
    
    var n = X.length;
    //console.log(n);
    
    var aveX ,aveY;
    aveX = 0; aveY = 0;
    var p;
    for (var i = 0; i < n; i++)aveX += X[i];
    aveX = (aveX * 1.0) / n;
    for (var i = 0; i < n; i++)aveY += Y[i];
    aveY = (aveY * 1.0) / n;
    
    
    //console.log(aveX, aveY);
    
    var t0, t1, t2;
    t0 = 0; t1 = 0; t2= 0; 
    for (var i = 0; i < n; i++){
        t0 += (X[i] - aveX) * (Y[i] - aveY);
        t1 += (X[i] - aveX) * (X[i] - aveX);
        t2 += (Y[i] - aveY) * (X[i] - aveY); 
    }
    
   // console.log(t0, t1, t2);
    
    var result;
    result = t0 * 1.0 / Math.sqrt(t1 * t2);
    
//    console.log(result);
    return result;
}