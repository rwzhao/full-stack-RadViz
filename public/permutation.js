/**
 *
 * Created by Chih-Hao on 16/1/13.
 */

//circle permutation

var used = new Array();
var perm = new Array();

var res = new Array();

var tot = 0;

function print_perm()
{
    tot++;
    document.write("<p>");
    for (var i = 0; i < perm.length; i++){
        document.write(perm[i]+" ");
    }
    document.writeln("</p>");
}


function addToRes(){
    tot++;
    res.push(perm.slice());

}

function generate_array(nownum, totnum)
{
    if (nownum == totnum)
//        print_perm();
        addToRes()
    else

        for (var i = 2; i <= totnum; i++){
            if (!used[i])
            {
                //console.log(nownum,i,used[i]);
                perm[nownum] = i;
                used[i] = true;
                generate_array(nownum + 1, totnum);
                used[i] = false;
            }
        }
}


function get_permutation(n)
{
//    var  n = prompt("Please Enter N");
    for (var i  = 0 ; i <= n; i++){
        used[i] = false;
    }
    perm[0] = 1;
    generate_array(1, n);
    //console.log(tot);
//    console.log(res);
    return res;
}

