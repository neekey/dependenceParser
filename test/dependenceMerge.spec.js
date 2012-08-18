var Util = require( '../lib/util' );

describe('Test for util method `dependenceMerge`', function(){


    it( 'Normal', function(){

        var itemOne = [ 'a', 'b', 'c' ];
        var itemTwo = [ 'b', 'e' ];
        var expectItem = [ 'a', 'b', 'e', 'c' ];

        var actualItem = Util.dependenceMerge( itemOne, itemTwo );

        expect( actualItem ).toEqual( expectItem );
    });

    it( 'reverse', function(){
        var itemOne = [ 'a', 'b', 'c' ];
        var itemTwo = [ 'b', 'e' ];
        var expectItem = [ 'a', 'b', 'e', 'c' ];

        var actualItem = Util.dependenceMerge( itemTwo, itemOne );

        expect( actualItem ).toEqual( expectItem );
    });

    it( 'unique', function(){
        var itemOne = [ 'a', 'b', 'c' ];
        var itemTwo = [ 'f', 'e' ];
        var expectItem = undefined;

        var actualItem = Util.dependenceMerge( itemOne, itemTwo );

        expect( actualItem ).toEqual( expectItem );
    });

    it( 'overlap', function(){
        var itemOne = [ 'a', 'b', 'c', 'f' ];
        var itemTwo = [ 'b', 'e', 'c' ];
        var expectItem = [ 'a', 'b', 'e', 'c', 'f' ];

        var actualItem = Util.dependenceMerge( itemOne, itemTwo );

        expect( actualItem ).toEqual( expectItem );
    });

    it( 'equal', function(){

        var itemOne = [ 'b', 'e', 'c' ];
        var itemTwo = [ 'b', 'e', 'c' ];
        var expectItem = [ 'b', 'e', 'c' ];

        var actualItem = Util.dependenceMerge( itemOne, itemTwo );

        expect( actualItem ).toEqual( expectItem );
    });

    it( 'self dependence', function(){

        var itemOne = [ 'e', 'e', 'f' ];
        var itemTwo = [ 'b', 'e', 'c' ];
        var ifError = false;

        try {
            var actualItem = Util.dependenceMerge( itemOne, itemTwo );
        }
        catch( e ){
            ifError = true;
        }

        expect( actualItem ).toEqual( undefined );
        expect( ifError ).toEqual( true );
    });

    it( 'dependence conflicting', function(){

        var itemOne = [ 'e', 'c', 'f' ];
        var itemTwo = [ 'c', 'e', 'b' ];
        var ifError = false;

        try {
            var actualItem = Util.dependenceMerge( itemOne, itemTwo );
        }
        catch( e ){
            ifError = true;
        }

        expect( actualItem ).toEqual( undefined );
        expect( ifError ).toEqual( true );
    });

    it( 'empty dependence', function(){

        var itemOne = [ 'b', 'e', 'c' ];
        var itemTwo = [ 'e' ];
        var expectItem = [ 'b', 'e', 'c' ];

        var actualItem = Util.dependenceMerge( itemOne, itemTwo );

        expect( actualItem ).toEqual( expectItem );
    });

    it( 'the order', function(){

        var itemOne = [ 'b', 'e', 'c' ];
        var itemTwo = [ 'c', 'd', 'f' ];
        // Make sure it doesn't become `...'c', 'f', 'd'
        var expectItem = [ 'b', 'e', 'c', 'd', 'f' ];

        var actualItem = Util.dependenceMerge( itemOne, itemTwo );

        expect( actualItem ).toEqual( expectItem );
    });
});