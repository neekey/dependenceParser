// Dependence parser for `dependenceRequire(['a.js','b.js'])` like.
var Fs = require( 'fs' );

module.exports = function( filePath ){

    var data = Fs.readFileSync( filePath).toString();
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