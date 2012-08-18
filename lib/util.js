var _ = require( 'underscore');

module.exports = {

    /**
     * Merge dependence A with dependence B
     * Note that a `dependence` is an Array, with the first element depend on the rest of the array.
     * ex: dependence `[ 'a', 'b', 'c' ]` means that `a` rely on `b` and `c`, however `b` and `c` are no dependencies.
     * This method merge two given `dependence`, and return a merged `dependence`.
     * ex: merge `[ 'a', 'b', 'c' ]` with `[ 'b', 'e', 'f' ] will return `[ 'a', 'b', 'e', 'f', 'c' ]
     * Note an `self-dependence` or an `dependence conflicting` is found, this method will trow an Error.
     *
     * @param itemOne
     * @param itemTwo
     * @return {*}
     */
    dependenceMerge: function( itemOne, itemTwo ){
        /**
         * d->e,f
         */
        var insert;
        /**
         * a->c,d
         */
        var beInserted;

        if( itemOne.indexOf( itemTwo[ 0 ] ) >= 0 ){
            beInserted = itemOne;
            insert = itemTwo;
        }
        else if( itemTwo.indexOf( itemOne[ 0 ] ) >= 0 ) {
            beInserted = itemTwo;
            insert = itemOne;
        }
        else {
            return undefined;
        }

        // Do the merge!
        var insertPoint = insert[ 0 ];
        var insertItems = insert.splice( 1 );
        var insertIndex = beInserted.indexOf( insert[ 0 ] );
        var currentInsertIndex = insertIndex;

        insertItems.forEach(function( item ){

            var itemIndex = beInserted.indexOf( item );

            // If item is not yet in beInserted, insert it after the insertPoint.
            if( itemIndex < 0 ){
                beInserted.splice( currentInsertIndex + 1, 0, item );
                // Increasing currentInsertIndex to ensure item will be insert one after one.
                currentInsertIndex++;
            }
            else {
                // If itemIndex equals to insertIndex, means item and insertPoint is the same, which is not allowed.
                // If itemIndex is smaller than insertIndex, it means insert and beInserted is conflicting.
                if( itemIndex <= insertIndex ){

                    throw new Error( 'A incorrectly dependence is found when merging dependence item: ' +
                        JSON.stringify( insert ) + ' with: ' + JSON.stringify( beInserted ));
                }
            }
        });

        return beInserted;
    },

    /**
     * Combine a list of `dependence` item into on complete `dependence`
     * ex: [ [ 'a', 'b', 'f' ], [ 'b', 'e', 'c' ], [ 'c', 'd' ] ] --> [ 'a', 'b', 'e', 'c', 'd', 'f' ]
     *
     * @param list
     * @return {*}
     */
    comboDependenceList: function( list ){

        var self = this;
        var lastLength = list.length;

        do{
            // Save length before combo.
            lastLength = list.length;

            list.forEach(function( itemOne, indexOne ){

                if( itemOne !== undefined ){
                    list.forEach(function( itemTwo, indexTwo ){

                        if( itemOne !== itemTwo ){
                            var mergeItem = self.dependenceMerge( itemOne, itemTwo );
                            if( mergeItem ){
                                list[ indexOne ] = mergeItem;
                                list[ indexTwo ] = undefined;
                            }
                        }
                    });
                }
            });

            // Remove all the `undefined` elements.
            list = _.compact( list );
        }
        // Note that if last list length equals to current list, it means no more combo job can be done.
        while( list.length > 1 && lastLength > list.length );

        // If list length is larger than `1`, it means there is multiple `dependence` in this list.
        // it can not be merge!
        if( list.length > 1 ){
            throw new Error( 'More than one dependence exist in this list: ' + JSON.stringify( list ) );
        }

        // Return the only one `dependence`.
        return list[ 0 ];
    }
};