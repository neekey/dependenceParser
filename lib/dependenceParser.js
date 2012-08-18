var Fs = require( 'fs' );
var Path = require( 'path' );
var _ = require( 'underscore' );
var util = require('./util');

/**
 * The dependence info of every files,like:
 *  { 'a.js': [ 'b.js', 'c.js' ] }
 * @type {Object}
 * @private
 */
var _dependenceInfo = {};

/**
 * Get all the dependence info about the target file.
 * @param {String} target
 * @param {Function} requireParser
 */
module.exports.parse = DependenceParser = function( target, parser ){

    // Get the absolute path.
    var targetAbsPath = Path.resolve( process.cwd(), target );
    // Recursive read files and get dependence info, and set to `_dependenceInfo`.
    recursiveFile( targetAbsPath, parser );
    // Calculate the whole dependence based on `_dependenceInfo`.
    var dependenceList = calculateDependenceOrder();

    return {
        list: dependenceList,
        info: _dependenceInfo
    };
};

/**
 * Recursive read files and get their dependence info.
 *
 * @param {String} target the path to read.
 * @param {Function} requireParser( fileData ) the dependence parser to get dependence info from a file.
 */
function recursiveFile( target, requireParser ){

    var _arguments = arguments;
    var fileData;

    try{
        fileData = Fs.readFileSync( target );
    }
    catch(e) {
        throw new Error( e );
    }

    var dependPaths = requireParser( fileData.toString() );
    recordDependence( target, dependPaths );

    dependPaths.forEach(function( path ){

        var absPath = Path.resolve( Path.dirname( target ), path );
        _arguments.callee( absPath, requireParser );
    });

}

/**
 * Save dependence info of a file.
 *
 * @param {String} target
 * @param {Array} dependence like: [ '/path/to/mod/a.js', '/path/to/mod/b.js' ]
 */
function recordDependence( target, dependence ){
    _dependenceInfo[ target ] = [];
    dependence.forEach(function( dep ){
        var absDep = Path.resolve( Path.dirname(target), dep );
        _dependenceInfo[ target ].push( absDep );
    });
}

/**
 * Calculate dependence info based on _dependenceInfo.
 *
 * @param dependenceInfo
 * @return {*}
 */
function calculateDependenceOrder( dependenceInfo ){
    dependenceInfo = dependenceInfo || _dependenceInfo;
    var dependenceList = [];
    _.each( dependenceInfo, function( dep, key ){

        var dependenceItem = [ key ];
        dep.forEach(function( d ){
            dependenceItem.push( d );
        });

        dependenceList.push( dependenceItem );
    });

    return util.comboDependenceList( dependenceList );
}