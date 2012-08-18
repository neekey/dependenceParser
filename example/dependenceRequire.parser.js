// Dependence parser for `dependenceRequire(['a.js','b.js'])` like.
module.exports = function( data ){

    var Ex = /^dependenceRequire\s*\(\s*(\[?\s*[\w'"\.\/,\-]+\s*\]?)\s*\)/g;
    var dependenceList = [];
    var testResult;
    var depArrStr;
    var depArr;

    while( ( testResult = Ex.exec( data ) ) !== null ){

        depArrStr = testResult[ 1 ];
        if( depArrStr ){
            try{
                depArr = eval( '(' + depArrStr + ')' );
            }
            catch(e){
                // Just leave it..
            }
            dependenceList = dependenceList.concat( depArr );
        }
    }

    return dependenceList;
};