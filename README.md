# patent-search

This repository contains the code I used for collecting *patent* data that I've used in my resume. At a previous job I had the opportunity to be creative and submit ideas for consideration in becoming patents. 

* [Overview](https://bitbucket.org/jxmot/patent-search/overview#markdown-header-overview)
* [Patent API](https://bitbucket.org/jxmot/patent-search/overview#markdown-header-patent-api)
* [Architecture](https://bitbucket.org/jxmot/patent-search/overview#markdown-header-architecture)
* [Future](https://bitbucket.org/jxmot/patent-search/overview#markdown-header-future)

# Overview

This is a client-side application implemented with :

* HTML/CSS and JavaScript/JQuery
* Handlebars
* Bootstrap

The primary purpose for this application was to develop the necessary code for retrieving U.S. patent data. The retrieved data is rendered in HTML using Handlebars.

# Patent API

I have used an API provided by <http://www.patentsview.org>. And I've implemented code for use with their *inventors* and *patents* end-points.

The API is well documented and they provide 7 end-points.

# Architecture

The files described here are - 

* **`index.html`** - main page
* **`assets/js/patentsJSON.js`** - reads the patent data JSON file when `index.html` is loaded
* **`assets/js/patent-app.js`** - high level logic and calls to `patents.*` functions
* **`assets/js/patents.js`** - `.get()` and `.search()`

# Future

I plan on implementing the patent search as an API served with NodeJS and ExpressJS. At this time I'm planning the following features - 

* Calls to my API will not **always** cause a call to be made to the *Patents View* API. Instead it will return data that has been saved in a JSON file.
* The patent data JSON file can be refreshed via an API call, or by the passage of a configurable amount of time. The amount of time will probably be expressed as a number of days.
* Refreshing the patent data can occur when any of the following occurs (*this would be configurable*) - 
    * The refresh time interval has passed and a call to retrieve data has occurred.
    * A background task is running, and when the refresh time interval has passed the patent data will be automatically updated.


