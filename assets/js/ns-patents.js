/* ************************************************************************ */
/*
    Basic Patent Search                                     (c) 2016 jim motyl

        This module gathers patent data via an API provided by - 

            http://www.patentsview.org/api/inventor.html

        Dependencies - 
            ns-misc-util.js(miscutil) - A module created for containing
            miscellaneous utility functions within a namespace (miscutil).

*/
patents = (function() {

    /*
        Public Properties (do not alter directly)
    */
    var patents = {
        data : {
            search_url: '',
            last_search: '',
            list: []
        }
    };

    /* ******************************************************************** */
    /*
        Private Data

            Data & Variables specific to using endpoints at 
            www.patentsview.org
    */
    var urlParts = [
        'http://www.patentsview.org/api/inventors/query?q={"_and":[',
// NOTE: the 'app_date' is found in -
//      data.patents[].applications[0].app_date
        'http://www.patentsview.org/api/patents/query?q={"_and":[',
        '{"assignee_organization":"%assignee"}',
        '{"inventor_last_name":"%last_name"}',
        '{"inventor_first_name":"%first_name"}',
        ']}',
        '&f=["patent_title","patent_number","patent_date","patent_abstract"]',
// NOTE: the "inventors" end point doesn't return 'app_date'
        '&f=["assignee_organization","app_date","patent_title","patent_number","patent_date","patent_abstract"]',
        '&s=[{"patent_number":"asc"}]'
    ];

    var _urlParts = [
// NOTE: the 'app_date' is found in -
//      data.patents[].applications[0].app_date
        'http://www.patentsview.org/api/patents',
        'http://www.patentsview.org/api/inventors',

        '/query?q=',
        '{"_and":[',
        '{"_or":[',

        '{"assignee_organization":"%assignee"}',
        '{"inventor_last_name":"%last_name"}',
        '{"inventor_first_name":"%first_name"}',

        ']}',
        ',',

        '&f=["patent_title","patent_number","patent_date","patent_abstract"]',
// NOTE: the "inventors" end point doesn't return 'app_date'
        '&f=["assignee_organization","app_date","patent_title","patent_number","patent_date","patent_abstract"]',
        '&s=[{"patent_number":"asc"}]'
    ];



    /*

        http://www.patentsview.org/api/patents/query?

            q={"_and":[{"inventor_last_name":"motyl"}]}
            q={"_and":[{"inventor_last_name":"motyl"},{"_or":[{"assignee_organization":"WMS Gaming Inc."},{"assignee_organization":"Bally Gaming, Inc."}]}]}


            &f=["inventor_last_name","assignee_organization","app_date","patent_title","patent_number","patent_date","patent_abstract"]
            &f=["app_date","patent_title","patent_number","patent_date","patent_abstract"]


            &s=[{"patent_number":"asc"}]



            Successful - 

            http://www.patentsview.org/api/patents/query?
            q={"_and":[{"inventor_last_name":"motyl"},{"_or":[{"assignee_organization":"WMS Gaming Inc."},{"assignee_organization":"Bally Gaming, Inc."}]}]}
            &f=["app_date","patent_title","patent_number","patent_date","patent_abstract"]
            &s=[{"app_date":"asc"},{"patent_number":"asc"}]

    */



    /*
            Index constants for use with urlParts[]
    */
    var URL_PART_INVEP       = 0;
    var URL_PART_PATEP       = URL_PART_INVEP + 1;
                             
    var URL_PART_ASSIGNEE    = URL_PART_PATEP + 1;
    var URL_PART_LASTNAME    = URL_PART_ASSIGNEE + 1;
    var URL_PART_FIRSTNAME   = URL_PART_LASTNAME + 1;
    var URL_PART_QUERYEND    = URL_PART_FIRSTNAME + 1;
    var URL_PART_FLIST_INVEP = URL_PART_QUERYEND + 1;
    var URL_PART_FLIST_PATEP = URL_PART_FLIST_INVEP + 1;
    var URL_PART_SORTBY      = URL_PART_FLIST_PATEP + 1;

    var URL_PART_LAST        = URL_PART_SORTBY;

    /*
            The tags we'll search for in the urlParts[] array at - 
                URL_PART_ASSIGNEE
                URL_PART_LASTNAME
                URL_PART_FIRSTNAME
    */
    var srchTags = ['%assignee', '%last_name', '%first_name'];

    /*
            Index constants for use with srchTags[]
    */
    var SEARCHTAG_ASSIGNEE  = 0;
    var SEARCHTAG_LASTNAME  = SEARCHTAG_ASSIGNEE + 1;
    var SEARCHTAG_FIRSTNAME = SEARCHTAG_LASTNAME + 1;
    /*
        Private Data End (This "private data" is a candidate for conversion
        to a loadable resource by this namespace.)
    */
    /* ******************************************************************** */

    /* ******************************************************************** */
    /*
        Public Method - searchInv(a, ln, fn)

        Use the inventors end point - http://www.patentsview.org/api/inventor.html

        Where -
            ep = the desired enpoint, a string. only compared against.
            a  = The assignee
            ln = Inventor last name
            fn = Inventor first name
    */
    patents.search = function(ep, a, ln, fn) {

        // save the search-for data (mostly for debugging purposes)
        this.assignee   = a;
        this.last_name  = ln;
        this.first_name = fn;

        // start with the first part of the search URL that we're building
        var searchURL;
        if(ep === 'inventors') searchURL = urlParts[URL_PART_INVEP];
        else searchURL = urlParts[URL_PART_PATEP];

        /*
            This is the patent assignee we're going to search for. It might be
            optional for some searches, but not all. The problem with the 
            assignee search parameter is that it must be exact (at least for
            the patentsview.org endpoints). For example - 

                Desired assignee - "ABC Industries, Inc."

                Inexact assignee - "ABC" or "ABC Industries" or "ABC Inc."

                Exact assignee   - "ABC Industries, Inc."

        */
        if(this.assignee != '') {
            var tmp = makeURLPart(URL_PART_ASSIGNEE, SEARCHTAG_ASSIGNEE, this.assignee);
            searchURL += tmp;
        }

        /*
            This is the patent inventor's last name. Note that not all patents
            have a single inventor. If you want to list multiple inventors then
            urlParts[URL_PART_LAST] must be modified.
        */
        if(this.last_name != '') {
            var tmp = makeURLPart(URL_PART_LASTNAME, SEARCHTAG_LASTNAME, this.last_name);
            // if a previous search term was used then separate the terms with a ','.
            if(this.assignee != '') {
                searchURL += ',';
            }
            searchURL += tmp;
        }

        /*
            This is the patent inventor's first name.
        */
        if(this.first_name != '') {
            var tmp = makeURLPart(URL_PART_FIRSTNAME, SEARCHTAG_FIRSTNAME, this.first_name);
            if(this.last_name != '') {
                searchURL += ',';
            }
            searchURL += tmp;
        }

        searchURL += urlParts[URL_PART_QUERYEND];
        if(ep === 'inventors') searchURL += urlParts[URL_PART_FLIST_INVEP];
        else searchURL += urlParts[URL_PART_FLIST_PATEP];

        // complete the search URL
        searchURL += urlParts[URL_PART_SORTBY];
        console.log('patents.search() - searchURL = '+searchURL);

        // do the search now...
        patents.get(searchURL);
    }

    /*
        Public Method - get(url)

        Where - 
            url = The endpoint URL with search parameters
    */
    patents.get = function(url) {

        // save the search URL (mostly for debugging purposes)
        patents.data.search_url = url;

        // wait for the events that can be triggered as the result 
        // of the AJAX get
        $(document).on('patents.read', convert);
        $(document).on('patents.fail', fail);

        // let's time how long it takes to get the data back
        console.time('patentsAjax');

        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json'
        })
        .done(function(result) {
            // how long did it take?
            console.timeEnd('patentsAjax');
            // break any reference, and trigger a 'read'
            // event with the result data
            var data = JSON.parse(JSON.stringify(result));
            $(document).trigger('patents.read', [data]);
        })
        .fail(function(result) {
            // how long did it take?
            console.timeEnd('patentsAjax');
            // what was the result?
            console.log(result);
            // since something didn't work, trigger the 'fail'
            // event and pass along the search parameters.
            var data = {'data':patents.data};
            $(document).trigger('patents.fail', [data]);
        });
    }

    /* ******************************************************************** */
    /*
        Patent Data - convert(event, pvData)

            This handler is triggered by the 'patents.read' event. It is 
            intended for internal use only.

        Where -
            event  = Not used, typical event data
            pvData = An object created from the patentsview data that was
                     returned in the AJAX call.

        Description - 
            This event handler takes the data that was returned from 
            patentsview and finds just the patent data and pushes each found 
            patent onto the patents.data.list[] array.

            If 1 or more patents have been returned then trigger the 
            'patentsDone' event and pass patents.data.list[] to the event 
            handler.

            If no patents were found then trigger the 'patentsNone' event and
            pass the search URL to the event handler.
    */
    function convert(event, pvData) {
        // what did we get?
        console.log(pvData);
        // no patents found yet, clear the list and turn
        // off the 'on' that called us.
        var patFound = false;
        patents.data.list = [];
        patents.data.last_search = new Date().toLocaleDateString();
        $(document).off('patents.read');

        // we're using one of two patentsview API end points, inventors
        // or patents.
        if(pvData.total_inventor_count !== undefined) {
            // using the inventors end point....
            // for each inventor found concatenate their patent lists 
            // onto the main list of patents.
            for(var invIdx = 0; invIdx < pvData.total_inventor_count; invIdx++) {
                for(var patIdx = 0; patIdx < pvData.inventors[invIdx].patents.length; patIdx++) {
                    patents.data.list.push(pvData.inventors[invIdx].patents[patIdx]);
                    // we found at least 1 patent
                    patFound = true;
                }
            }
        } else {
            // using the patents end point....
            if(pvData.total_patent_count > 0) {
                patents.data.list = pvData.patents.map(function(pat) {
                    patFound = true;
                    var patent = {
                        patent_abstract: pat.patent_abstract,
                        patent_date    : pat.patent_date,
                        patent_number  : pat.patent_number,
                        patent_title   : pat.patent_title,
                        app_date       : pat.applications[0].app_date
                    };
                    return(patent);
                });
                console.log(patents.data.list);
            } else console.log('no patents FOUND!');
        }

        // if any patents were found then notify the client with a 
        // copy of the list. if not, then notify the client with a 
        // copy of the search parameters.
        if(patFound === true) {
            var data = JSON.parse(JSON.stringify(patents.data));
            $(document).trigger('patentsDone', [data]);
        } else {
            var data = JSON.parse(JSON.stringify(patents.data.search_url));
            $(document).trigger('patentsNone', [data]);
        }
    }

    /*
        Private Event - fail(event, pvData)

            This handler is triggered by the 'patents.read' event. It is 
            intended for internal use only.

        Where -
            event     = Not used, typical event data
            queryData = An object created from the search parameters that
                        were used in the search.
    */
    function fail(event, queryData) {
        console.log(queryData);

        $(document).off('patents.fail');
        var data = JSON.parse(JSON.stringify(queryData));
        $(document).trigger('patentsFail', [data]);
    }

    /*
        Private Function - makeURLPart(urlPartIdx, srchTagIdx, partStr)

        Where - 

            urlPartIdx = Index for urlParts[] that accesses a portion of the 
                         URL we need to create.
            srchTagIdx = Index for srchTags[] that provides a tag ('$tagname')
                         to be searched for and replaced with 'partStr'.
            partStr    = The string that replaces the found search tag.

        Description - 
            Uses the indices to access urlParts[] and srchTags[] where it will
            create a new string containing the original string found in 
            urlParts[]. It uses miscutil.findInString() and 
            miscutil.replaceAt() to replace tags (formatted as '%taglabel')
            with the string supplied in partStr.
    */
    function makeURLPart(urlPartIdx, srchTagIdx, partStr) {
        var idx = 0;
        var tmp = miscutil.replaceAt(urlParts[urlPartIdx], 
                                     (idx = miscutil.findInString(srchTags[srchTagIdx], urlParts[urlPartIdx])),
                                     (idx + srchTags[srchTagIdx].length), 
                                     partStr);

        return tmp;
    }

    return patents;
})();



