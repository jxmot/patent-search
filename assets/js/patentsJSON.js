/* ************************************************************************ */
/*
    When this script is loaded it will retreive patent data from a JSON
    file. After the file is read it will parse it into an object and 
    trigger the "patentsDataRead" event. However, if someting goes wrong
    the "patentsDataFail" event will be triggered.
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
    $(document).trigger('patentsDataFail');
})
/*
    Trigger an event, the client is waiting...
*/
.done(function() {
    rawPatents = JSON.parse(patentsJSON.responseText);
    $(document).trigger('patentsDataRead');
});

