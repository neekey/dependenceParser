dependenceParser
=======

`DependenceParser`是一个简单的文件依赖解析器，它专注与处理依赖关系，根据文件之间的关系，构造出一个文件顺序列表。

`DependenceParser`不关心`如何从一个文件中解析出这个文件对于其他文件的依赖`，这块工作通过给定不同的`parser`来实现，`DependenceParser`本身不提供这块的具体实现。

`DependenceParser`的初衷就是为其他的模块解析器提供底层支持。你需要做的，就是专注于如何从一个文件中提取出你需要的依赖信息。

## 使用

具体例子可以参考`example/parse.js`.下面的例子先是构造了一个用于解析使用`dependenceRequire( ['a.js', 'b.js']);`这样的语法的解析器，然后使用`dependenceParser`完成文件的依赖关系解析.

下面为`parser`的定义，唯一需要注意的是，`parser`是一个`function`,它接受一个参数，也就是需要解析的文件字符串，最后返回一个依赖文件列表数组。
```
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

利用改解析器，我们便可以用来解析我们的文件(见`example`).
```
var dependenceParser = require( '../lib/dependenceParser.js' );
var parser = require( './dependenceRequire.parser.js' );
var target = 'foo/index.js';

console.log( dependenceParser.parse( target, parser ) );
```

最终会输出：
```
    { list:
       [ '/users/neekey/Dropbox/nodejs/app/dependanceParser/example/foo/index.js',
         '/users/neekey/Dropbox/nodejs/app/dependanceParser/example/foo/mod_a.js',
         '/users/neekey/Dropbox/nodejs/app/dependanceParser/example/foo/mod_b.js',
         '/users/neekey/Dropbox/nodejs/app/dependanceParser/example/foo/mod_c.js' ],
      info:
       { '/users/neekey/Dropbox/nodejs/app/dependanceParser/example/foo/index.js': [ '/users/neekey/Dropbox/nodejs/app/dependanceParser/example/foo/mod_a.js' ],
         '/users/neekey/Dropbox/nodejs/app/dependanceParser/example/foo/mod_a.js':
          [ '/users/neekey/Dropbox/nodejs/app/dependanceParser/example/foo/mod_b.js',
            '/users/neekey/Dropbox/nodejs/app/dependanceParser/example/foo/mod_c.js' ],
         '/users/neekey/Dropbox/nodejs/app/dependanceParser/example/foo/mod_b.js': [],
         '/users/neekey/Dropbox/nodejs/app/dependanceParser/example/foo/mod_c.js': [] } }
```

其中`list`为根据文件间的依赖关系构造的文件顺序列表，`info`为每个文件对应的直接依赖文件列表。

That'all!

## License
(The MIT License)

Copyright (c) 2012 Neekey ni184775761@gmail.com;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.