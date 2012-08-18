var dependenceParser = require( '../lib/dependenceParser.js' );
var parser = require( './dependenceRequire.parser.js' );
var target = 'foo/index.js';

console.log( dependenceParser.parse( target, parser ) );

