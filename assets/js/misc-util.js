/* ************************************************************************ */
/*
    Miscellaneous Utility Functions                          (c) 2016 jim motyl

        A collection of functions that I've found useful and have decided to
        put them in this module.
*/
/*
    The functions contained here are (see the function comments 
    for details) - 

        capitalizeWords(str)
        findInString(find, str)
        replaceAt(str, index, endIndex, replStr)

*/
miscutil = (function() {

    var miscutil = {};

    /*
        Capitalize words in a string
    */
    miscutil.capitalizeWords = function(str) {  
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });  
    };
    
    /*
        Usage:
    
        var srcStr = 'this is a string, replace %this - well?';
        var tagStr = '%this';
        var repStr = 'my brain';
        var outStr = '';
    
        var idx = findInString(tagStr, srcStr);
    
        outStr = replaceAt(srcStr, idx, idx+tagStr.length, repStr);
    
    
        outStr === 'this is a string, replace my brain - well?'
    */
    /*
        Find Substring within a String and Return the Index of
        the start of the Substring
    */
    miscutil.findInString = function(find, str) {
// muted        console.log('findInString() - find = ' + find);
// muted        console.log('findInString() - str  = ' + str);
        var idx = str.indexOf(find, 0);
// muted        console.log('findInString() - found at = ' + idx);
        return idx;
    };
    
    /*
        Within a String select an index range and replace what's 
        there with a replacement string.
    */
    miscutil.replaceAt = function(str, index, endIndex, replStr) {
    
        var retStr = '';
    
        // let's be sure the the arguments are the 
        // appropriate types and that the args make
        // some sense in regards to length and value
        if((str.length > 0) && (index >= 0) && (endIndex > index) && (replStr.length > 0)) {
// muted                console.log('replaceAt() - before str = ' + str);
            // copy all everything to the left of the find position, then
            // the find, and then copy everything to the right
            retStr = str.substr(0, index) + replStr + str.substr(endIndex);
// muted                console.log('replaceAt() - after  retStr = ' + retStr);
        } else {
            console.log('replaceAt() - ERROR');
        }
        return retStr;
    };

    return miscutil;
})();

