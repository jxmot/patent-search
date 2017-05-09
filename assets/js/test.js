$('#test1').on('click', runTest1);

function runTest1() {
//    patents.search('patents', '', 'motyl', '');
    patents.get('http://www.patentsview.org/api/patents/query?q={"_and":[{"inventor_last_name":"motyl"},{"_or":[{"assignee_organization":"WMS Gaming Inc."},{"assignee_organization":"Bally Gaming, Inc."}]}]}&f=["app_date","patent_title","patent_number","patent_date","patent_abstract"]&s=[{"app_date":"asc"},{"patent_number":"asc"}]');
}


// gets better results...
$('#test2').on('click', runTest2);

function runTest2() {
    patents.search('patents', 'WMS Gaming Inc.', 'motyl', '');
    patents.search('patents', 'Bally Gaming, Inc.', 'motyl', '');
}

$('#test3').on('click', runTest3);

function runTest3() {
    //var patList = removeDuplicates(rawPatents, "patent_title", true);
    renderPatents(rawPatents);
}

function renderPatents(patData) {
    var source   = $("#patent-template").html();
    var template = Handlebars.compile(source);
    var context = {patents: patData};
    var html    = template(context);

    $('#target').append(html);
}

$(document).on('patentsDataRead', function(event, arg) {
        console.log('Event(patentsDataRead) - done, rawPatents read = ' + rawPatents.list.length);
    }
);




$(document).on('patentsDone', patentsDone);

function patentsDone(event, patData) {

    var renderData = {
        list: removeDuplicates(patData.list, "patent_title", true),
        search_url: patData.search_url,
        last_search: patData.last_search
    };

    renderPatents(renderData);

    console.log(JSON.stringify(renderData, null, 4));
}



$(document).on('patentsNone', patentsNone);

function patentsNone(event, patData) {
    console.log(patData);
}

///////////
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
 }
