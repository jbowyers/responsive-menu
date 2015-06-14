# About Responsive Menu #

**jQuery Responsive Menu** is a drop-down menu for responsive websites. It is a **jQuery plugin** that includes a 
JavaScript file and CSS file as well as sample HTML.

* **Description**: Drop-down Menu jQuery plugin for responsive layouts
* **Repository**: https://github.com/jbowyers/responsive-menu
* **Demo**: http://responsive-menu.com
* **Bower**: jquery-responsive-menu
* **Requires**: jQuery
* **Author**: jbowyers
* **Copyright**: 2015 jbowyers
* **License**: GPLv3
* **Version: 0.2.1**

## Demo ##

Visit http://responsive-menu.com to view a responsive demo

## Basic Setup ##

* **Download** - Download and extract the Responsive Menu zip files - https://github.com/jbowyers/responsive-menu
* **Copy files** - Copy the responsive-menu.js and responsive-menu.css files to your project
* **Setup Menu HTML** - Open the responsive-menu.html sample file and copy and past the menu html into the 
html files in your project. Or, setup existing menus in your project to work with Responsive Menu (see Configuration).
* **Link to CSS and JavaScript files** - Add link and script references to your HTML files
* **Initialize Responsive Menu** - Activate the plugin using jQuery (see Configuration)

### Using Bower Package Manager ###

The Responsive Menu repo is registered as a bower package as jquery-responsive-menu.

## Configuration ##

### Suggested HTML ###
```html

    <div class="rm-container">
        <a class="rm-toggle rm-button rm-nojs" href="#">Menu</a>
        <nav class="rm-nav rm-nojs rm-lighten">
            <ul> ...
```
### Theme class options ###

**Options**: rm-lighten, rm-darken.  
rm-lighten theme lightens menu item backgrounds and is best used if your design requires a dark menu background color.
rm-darken theme darkens menu item backgrounds and is best used if your design required a light menu background color.
You can set the menu background color to any color to work with the chosen theme.

### Sample jQuery ###
```javascript

    jQuery(function ($) {
        var menu = $('.rm-nav').rMenu({

            // Optional Settings
            minWidth: '960px',
    
        });
    });
```
### Full List of Options ###

#### minWidth ####
Minimum width for expanded layout in pixels - String  
Should match media query in css file. Must be in pixels and include px units if not using Modernizr.  
default: '769px'

#### transitionSpeed ####
The opening and closing speed of the menus in milliseconds  
default: 400

#### jqueryEasing ####
The jQuery easing function - used with jQuery transitions  
default: 'swing'  
options: 'swing', 'linear'

#### css3Easing ####
The CSS3 transitions easing function - used with CSS3 transitions  
default: 'ease'

#### toggleBtnBool ####
Use button as Toggle Link - instead of text  
default: true

#### toggleSel ####
The Toggle Link selector  
default: '.rm-toggle'

#### menuSel ####
The menu/sub-menu selector  
default: 'ul'

#### menuItemsSel ####
The menu items selector  
default: 'li'


#### animateBool ####
Use CSS3 animation/transitions  
default: true  
Do not use animation/transitions: false

#### accelerateBool ####
Force GPU Acceleration 
default: false  
Force: true

#### developmentMode ####
Use development mode - outputs information to console  
default: false

### The Toggle Button ###

An optional menu-btn.png file is included. By default, the same image is included in the CSS as a data URI
so the png file is not required unless you would prefer to use the png file instead of the data URI.

### Dependencies ###
jQuery, Modernizr (optional)

### How to run tests ###
No testing framework at this time

### Task Managers ###
Gruntfile.js and package.json files are included if you want to manage tasks using Grunt.  
Note: The Grunt file uses configuration information contained in the package.json

### Deployment instructions ###
The git repo is versioned and includes a Bower configuration file so the repo can be easily included in your project as a dependency.

## Contribution guidelines ##

Contributions are much appreciated and welcomed.

### Who do I talk to? ###

jbowyers