/* ************************************************************************ */
/*

    

*/
var rawPatents = [];

var patentsJSON = $.getJSON('data/patents.json')
.fail(function() {
    /*
     * Will investigate how to determine 
     * the type of error and handle it 
     * appropriately.
     */
    console.log('patentsJSON - error');
})
/*
    Trigger an event, the client is waiting...
*/
.done(function() {
    rawPatents = JSON.parse(patentsJSON.responseText);
    $(document).trigger('patentsDataRead');
});

