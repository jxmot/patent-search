# patent-search

This repository contains the code I used for collecting *patent* data that I've used in my resume. At a previous job I had the opportunity to be creative and submit ideas for consideration in becoming patents. 

* [Overview](#overview)
* [Patent API](#patent-api)
* [Architecture](#architecture)
* [Features](#features)
* [Future](#future)

# Overview

This is a client-side application implemented with :

* HTML/CSS and JavaScript/JQuery
* Handlebars
* Bootstrap

The primary purpose for this application was to develop the necessary code for retrieving U.S. patent data. The retrieved data is rendered in HTML using Handlebars. Optionally, the patent data can be sent to the browser's console as JSON formatted data.

# Patent API

I have used an API provided by <http://www.patentsview.org>. And I've implemented code for use with their *inventors* and *patents* end-points.

The API is well documented and they provide 7 end-points.

**NOTE :** According the the *Patents View* website - "*The current version of the PatentsView API delivers data on patents granted through December 16, 2016.*"

# Architecture

The primary files are - 

* **`index.html`** - main page and the Handlebars script
* **`assets/js/patentsJSON.js`** - reads the patent data JSON file when `index.html` is loaded
* **`assets/js/patent-app.js`** - high level logic and calls to `patents.*` functions
* **`assets/js/patents.js`** - `.get()` and `.search()`
* **`data/patents.json`** - contains patent data

# Features

* Used CSS to disable text selection and copying.
* Sequential searching is possible.
* The rendered HTML of each patent is under a collapsible heading and body

# Future

I plan on implementing the patent search as an API served with NodeJS and ExpressJS. At this time I'm planning the following features - 

* Calls to my API will not **always** cause a call to be made to the *Patents View* API. Instead it will return data that has been saved in a JSON file.
* The patent data JSON file can be refreshed via an API call, or by the passage of a configurable amount of time. The amount of time will probably be expressed as a number of days.
* Refreshing the patent data can occur when any of the following occurs (*this would be configurable*) - 
    * The refresh time interval has passed and a call to retrieve data has occurred.
    * A background task is running, and when the refresh time interval has passed the patent data will be automatically updated.

---
<img src="http://webexperiment.info/extcounter/mdcount.php?id=patent-search">
