/* ************************************************************************ */
/*
    Patent Search Application
    
    Created for the purpose of developing code to retreive and render 
    U.S. patent data for use in a resume.
*/

// will contain the DOM target for HTML output
var patentTarget = '';

/*
    Call patents.get() with a complete API URL
*/
$('#patentsget').on('click', patentsGet);

function patentsGet() {
    patentTarget = '#target1';
    
    patents.get('http://www.patentsview.org/api/patents/query?q={"_and":[{"inventor_last_name":"motyl"},{"_or":[{"assignee_organization":"WMS Gaming Inc."},{"assignee_organization":"Bally Gaming, Inc."}]}]}&f=["app_date","patent_title","patent_number","patent_date","patent_abstract"]&s=[{"app_date":"asc"},{"patent_number":"asc"}]');
};

/*
    Call patents.search() more than once to obtain all patents
*/
$('#patentssearch').on('click', patentsSearch);

var searchList = [];

function patentsSearch() {
    
    patentTarget = '#target2';

    searchList = [];
    
    // Create a search item (contains args for the patent search) and
    // save it globally in an array.
    var searchitem = Object.assign({},
    {
        ep: 'patents', 
        a: 'WMS Gaming Inc.', 
        ln: 'motyl', 
        fn: ''
    });
    
    searchList.push(searchitem);

    // Create and save....
    searchitem = Object.assign({},
    {
        ep: 'patents', 
        a: 'Bally Gaming, Inc.', 
        ln: 'motyl', 
        fn: ''
    });

    searchList.push(searchitem);

    // will be triggered when a HTML render has completed
    $(document).on('renderDone', searchNext);
    
    // get it started...
    searchNext();
};

/*
    Perform the next seqential patent search, if none exist
    then stop listening for the trigger.
*/
function searchNext() {
    if(searchList.length > 0) {
        var search = searchList.shift();
        patents.search(search.ep, search.a, search.ln, search.fn);
    } else $(document).off('renderDone');
};

/*
    Render previously retrieved, saved, and read-in patent data from a JSON 
    file.
*/
$('#patentsread').on('click', patentsRead);

function patentsRead() {
    //var patList = removeDuplicates(rawPatents, "patent_title", true);
    renderPatents('#target3', rawPatents);
};

/*
    The JSON file containing the patent data is read and parsed when the 
    document is loaded. This happens in patentsJSON.js
*/
$(document).on('patentsDataRead', function(event, arg) {
        console.log('Event(patentsDataRead) - done, rawPatents read = ' + rawPatents.list.length);
    }
);

// in case something didn't work....
$(document).on('patentsDataFail', function(event, arg) {
        console.log('Event(patentsDataFail) - FAIL');
    }
);

/* ************************************************************************ */
/*
    The previous .get() or .search() has completed.
*/
$(document).on('patentsDone', patentsDone);

// 'patData' contains the found patents
function patentsDone(event, patData) {

    // set up the render data...
    var renderData = {
        list: removeDuplicates(patData.list, "patent_title", true),
        search_url: patData.search_url,
        last_search: patData.last_search
    };

    // render to HTML at the specified DOM tag (target)
    renderPatents(patentTarget, renderData);

    if( ((patentTarget === '#target1') && (document.getElementById('logChk1').checked === true)) || 
        ((patentTarget === '#target2') && (document.getElementById('logChk2').checked === true)) ) {
        console.log('---- START ----');
        console.log(JSON.stringify(renderData, null, 4));
        console.log('----- END -----');
    }
    
    // used when sequential search & render operations are necessary
    $(document).trigger('renderDone');
};

/*
    It's likely that no patents were found
*/
$(document).on('patentsNone', patentsNone);

// 'searchURL' will contain the URL used for the failed search
function patentsNone(event, searchURL) {
    console.log('patentsNone() - search URL follows....');
    console.log(searchURL);
};

/*
    A failure occured during the AJAX call
*/
$(document).on('patentsFail', patentsFail);

// 'queryData' should contain the AJAX query
function patentsFail(event, queryData) {
    console.log('patentsFail() - query data follows....');
    console.log(queryData);
};

/* ************************************************************************ */
/*
    Render patent JSON data into HTML
    
*/
function renderPatents(target, patData) {
    var source   = $("#patent-template").html();
    var template = Handlebars.compile(source);
    var context  = {patents: patData, uid: target.slice(1,target.length)};
    var html     = template(context);

    $(target).append(html);
};

/*
    Remove duplicate objects from an array using a specified
    property name's value in the comparison for a duplicate.

    Where :
        arr     - the array of objects
        prop    - the property name of the value to use in 
                  the comparison
    keepFirst   - true = keep the first, discard the rest
                  false = keep the last one found
*/
function removeDuplicates(arr, prop, keepFirst) {
    var new_arr = [];
    var lookup  = {};

    // for each object in the array...
    for (var i in arr) {
        // are we keeping the first one found, or the last?
        // 
        // if keep the last then copy the object and use the property value as the key to the copy
        // else if there has been no previous copy made then make a copy
        //     otherwise don't copy it and move on to the next object
        if(keepFirst === false) lookup[arr[i][prop]] = arr[i];
        else if(lookup[arr[i][prop]] === undefined) lookup[arr[i][prop]] = arr[i];
    }
 
    // 
    for (i in lookup) {
        new_arr.push(lookup[i]);
    }
 
    return new_arr;
};
