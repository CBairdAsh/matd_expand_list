# A Material Design Expanded List with Javascript / JQuery

MatD Expanded List is a small component that can generate a Material Design expanded list.

### Browser Support

The MatD Expanded List is intended for "modern" browsers ( Chrome, Safari, Edge, Firefox, etc ) and IE11

### Dependencies

MatD Expanded List has been tested on jQuery 3.3.1 but should work with jQuery 2.1 and 1.7

### How to use

To get started, place the following lines in your web page or application:

    <link rel="stylesheet" href="js/matd_expand_list/matd_expandlist.css" type="text/css" media="screen" />
	<script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
	<script type="text/javascript" src="s/matd_expand_list/matd_expand_list.min.js"></script>

Then, provide an array of objects that represent the visible areas of the expanded list, with the command targeting the zone the list should appear in. Like so:

$('#test').matd_expandlist({...});

### Option Syntax

There are three main zones to an expanded list: the Header, Subheader and Details. Of these, the header is required.

All three support any type of content, even HTML tags. It is recommended that the rich experience ( images, html, etc ) be reserved for the detail area.

### License

Copyright (c) 2019 C. B. Ash

Licensed under the MIT License

While this is my own pet project, I always enjoy getting suggestions for improvement here.
