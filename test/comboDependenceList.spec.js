var Util = require( '../lib/util' );

describe('Test for util method `comboDependenceList`', function(){


    it( 'Normal', function(){

        // a <- b <- e
        //        <- c <- d
        //   <- f
        var list = [
            [ 'a', 'b', 'f' ],
            [ 'b', 'e', 'c' ],
            [ 'c', 'd' ]
        ];
        var expectList = [ 'a', 'b', 'e', 'c', 'd', 'f' ];

        var actualList = Util.comboDependenceList( list );

        expect( actualList ).toEqual( expectList );
    });

    it( 'multiple dependence', function(){

        // a <- b <- e
        //        <- c <- d
        // h <- f
        var list = [
            [ 'a', 'b' ],
            [ 'b', 'e', 'c' ],
            [ 'h', 'f' ]
        ];
        var ifError = false;

        try{
            var actualList = Util.comboDependenceList( list );
        }
        catch( e ){
            ifError = true;
        }

        expect( actualList ).toEqual( undefined );
        expect( ifError ).toBe( true );
    });
});