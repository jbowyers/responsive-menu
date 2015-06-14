
/**
 * Responsive Menu
 * Version: 0.2.1
 * URL: private
 * Description: A drop-down responsive Menu for responsive layouts
 * Requires: jQuery
 * Optional: Modernizr
 * Author: jbowyers
 * Copyright: 2014-2015 jbowyers
 * License: This file is part of Responsive Menu.
 * Responsive Menu is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Responsive Menu is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses/
 */

;(function( $, window, document, Math, undefined ) {

    'use strict';
    var pluginName = 'rMenu';

    /**
     * The plugin
     * @param {object} el - The menu container typically a nav element
     * @param {object} options - plugin options object litteral
     * @returns {Plugin}
     * @constructor
     */
    var Plugin = function( el, options ) {

        // Clone this object
        var o = this;

        /**
         * Initialize option defaults and set options =============================
         * @type {{minWidth: string, toggleSel: string, menuSel: string, menuItemsSel: string, transitionSpeed: number, animateBool: string, accelerateBool: string}}
         */
        o.optionsInit = {

            /**
             * Minimum width for expanded layout in pixels - String Should match media query in css file
             * Must be in pixels and include px units if not using Modernizr.
             * @default '769px'
             */
            minWidth: '769px',

            /**
             * The opening and closing speed of the menus in milliseconds
             * @default 400
             */
            transitionSpeed: 400,

            /**
             * The jQuery easing function - used with jQuery transitions
             * @default 'swing'
             * @options 'swing', 'linear'
             */
            jqueryEasing: 'swing',

            /**
             * The CSS3 transitions easing function - used with CSS3 transitions
             * @default 'ease'
             */
            css3Easing: 'ease',

            /**
             * Use button as Toggle Link - instead of text
             * @default true
             */
            toggleBtnBool: true,

            /**
             * The Toggle Link selector
             * @default '.rm-toggle'
             */
            toggleSel: '.rm-toggle',

            /**
             * The menu/sub-menu selector
             * @default 'ul'
             */
            menuSel: 'ul',

            /**
             * The menu items selector
             * @default 'li'
             */
            menuItemsSel: 'li',

            /**
             * Use CSS3 animation/transitions Boolean
             * @default true
             * Do not use animation/transitions: false
             */
            animateBool: true,

            /**
             * Force GPU Acceleration Boolean
             * @default false
             * Do not force: false
             */
            accelerateBool: false,

            /**
             * the setup complete callback function
             * @default 'false'
             */
            setupCallback: false,

            /**
             * the tabindex start value - integer
             * @default 1
             */
            tabindexStart: 1,

            /**
             * Use development mode - outputs information to console
             * @default false
             */
            developmentMode: false
        };
        o.options = $.extend( {}, o.optionsInit, options );

        // Define public objects and vars =========================================

        // Toggle Link object
        o.tButton = $( o.options.toggleSel );

        // The class applied to the toggle Link element to make it a button
        o.tButtonClass = 'rm-button';

        // The class applied to the toggle Link element when it is visible
        o.tButtonShowClass = 'rm-show';

        // The class applied to the toggle Link element when it is visible
        o.tButtonActiveClass = 'rm-active';

        // Nav element object - contains the menus
        o.el = $( el );

        // The class the plugin adds to the nav element
        o.navElementClass = 'rm-nav';

        // Container object - contains everything - the Nav element and Toggle Link
        o.container = o.el.parent();

        // The class the plugin adds to the container of the nav element
        o.containerClass = 'rm-container';

        // The class applied to container element to trigger expanded layout
        o.expandedClass = 'rm-layout-expanded';

        // The class applied to container element to trigger contracted layout
        o.contractedClass = 'rm-layout-contracted';

        // The class that is removed from the toggle and nav element when JS is supported
        o.noJSClass = 'rm-nojs';

        // All menu elements
        o.menus = o.el.find( o.options.menuSel );

        // The class applied to all menu elements
        o.menuClass = 'rm-menu';

        // Top level menu object - contains the menus
        o.topMenu = o.el.children( o.options.menuSel );

        // The class the plugin adds to the top menu element
        o.topMenuClass = 'rm-top-menu';

        // The class applied to menu/sub-menu element when menu is expanded
        o.menuExpandedClass = 'rm-menu-expanded';

        // The class applied to menu/sub-menu element when menu is hidden
        o.menuHiddenClass = 'accessibly-hidden';

        // The class the plugin adds to the menu elements when calculating height
        o.menuCalcClass = 'rm-calculate';

        // The class applied to all menu items
        o.menuItemClass = 'rm-menu-item';

        // The focused parent element
        o.itemFocused = false;

        // The class applied to menu items that contain a sub-menu
        o.parentClass = 'rm-parent';

        // The class applied to a menu item when its menu is expanded
        o.itemHoverClass = 'rm-hover';

        // The class applied to the first menu item
        o.itemFirst = 'rm-first';

        // The class applied to the last menu item
        o.itemLast = 'rm-last';

        // The class applied to the second to last menu item
        o.item2ndLast = 'rm-2nd-last';

        // The CSS3 animate class variable
        o.animateClass = 'rm-css-animate';

        // The CSS3 animate Boolean
        o.animateBool = o.options.animateBool;

        // The GPU accelerate class variable
        o.accelerateClass = 'rm-accelerate';

        // The GPU accelerate Boolean
        o.accelerateBool = o.options.accelerateBool;

        // The touchmove Boolean - did a touchmove event just occur
        o.touchMoveBool = false;

        // Resize and Pause hover event timer function
        o.timer = false;

        // The window width - used to verify a window width change
        o.windowWidth = $( window ).width();


        /**
         * Initiate plugin =========================================
         * @returns {Plugin}
         */
        o.init = function() { // Should only be called once

            // Set up the plugin
            o.setup();

            // Window event handlers
            $( window ).on({

                // Reset on screen resize
                'resize': function() {

                    // Test if width has resized - as opposed to height
                    if ($( window ).width() !== o.windowWidth) {

                        // Update the window width
                        o.windowWidth = $( window ).width();

                        // Adjust layout
                        clearTimeout( o.timer );
                        o.timer = setTimeout( o.adjust, 500 );

                    }
                }
            });

            // Run setupCallback function
            if ( typeof( o.options.setupCallback ) === "function" ) {
                o.options.setupCallback();
            }

            return this;
        };

        /**
         * Setup plugin ============================================================
         * @returns {Plugin}
         */
        o.setup = function() { // Can be called again to reset plugin

            // Add the container class to the nav element's parent element
            o.container.addClass( o.containerClass );

            // add rm-button class if using button
            if ( o.options.toggleBtnBool ) {
                o.tButton.addClass( o.tButtonClass );
            } else {
                o.tButton.removeClass( o.tButtonClass );
            }

            // Remove o.noJSClass class and add click event to Toggle Link
            o.tButton
                .removeClass( o.noJSClass )
                .off( 'mousedown.rm focusin.rm click.rm' )

                // Use mousedown and focus to trigger toggle
                .on( 'mousedown.rm focusin.rm', tButtonFocus )

                // Disable click events
                .on( 'click.rm', tButtonClick )

                .attr( 'tabindex', 0 )
            ;

            // Add menu class and make submenus accessibly hidden
            o.menus
                .addClass( o.menuClass )
                .attr( 'aria-hidden', 'false' )
                .hide();

            // Add top menu class
            o.topMenu.addClass( o.topMenuClass );

            // Adjust o.animateBool
            if ( o.animateBool ) { // using CSS3 transitions

                // Check if transitions and acceleration are supported
                if ( typeof Modernizr !== 'undefined' ) { // Test with Modernizr
                    if ( !Modernizr.csstransitions ) {
                        o.animateBool = false;
                        o.accelerateBool = false;
                    } else if ( !Modernizr.csstransforms3d ) {
                        o.accelerateBool = false;
                    }
                } else if ( !transitionsSupported() ) {
                    o.animateBool = false;
                    o.accelerateBool = false;
                } else if ( !transform3DSupported()  ) {
                    o.accelerateBool = false;
                }
            } else {
                o.accelerateBool = false;
            }

            // Add animate and accelerate classes if CSS3 animation
            if ( o.animateBool ) {
                o.menus.addClass( o.animateClass );
                if ( o.accelerateBool ) {
                    o.menus.addClass( o.accelerateClass );
                }
            }

            // Add and remove classes and click events
            o.el
                .removeClass( o.noJSClass )
                .addClass( o.navElementClass )
                .off( 'focusin.rm focusout.rm click.rm touchend.rm touchmove.rm' )

                // Use focus to trigger menu item focus/hover behaviour
                .on( 'focusin.rm', o.options.menuItemsSel, itemFocus )

                // De-focus menu on focus out
                .on( 'focusout.rm', o.topMenu, menuBlur )

                // Use click and touchend to trigger click behaviour
                .on( 'click.rm touchend.rm', o.options.menuItemsSel, itemClick )

                // Set touchMoveBool to true on touchmove event
                .on( 'touchmove.rm', o.options.menuItemsSel, touchMove )
                .find( o.options.menuItemsSel )
                    .each( function(i) {
                        var $el = $( this );
                        $el
                            .addClass( o.menuItemClass)
                            .children( 'a' ).attr( 'tabindex', 0 )
                        ;
                        if ( $el.is( ':first-child') ) {
                            $el.addClass( o.itemFirst );
                        }
                        if ( $el.is( ':last-child') ) {
                            $el.addClass( o.itemLast )
                                .prev().addClass( o.item2ndLast );
                        }
                    })
                    .addBack()
                    .removeClass( o.parentClass )
                    .has( o.options.menuSel )
                        .addClass( o.parentClass )
            ;

            // Apply initial layout and adjustments
            o.adjust();

            return this;
        };

        /**
         * Adjust plugin ============================================================
         * @param {String} minWidth  - the min-width value (including units)
         * minWidth must be in pixels if not using Modernizr. Should match media query in css file
         */
        o.adjust = function( minWidth ) {

            // Get the breakpoint minimum width
            minWidth = typeof minWidth !== 'undefined' ? minWidth : o.options.minWidth;

            // Check browser width - set menu layout
            if ( typeof Modernizr !== 'undefined' && Modernizr.mq('only all') ) { // MQs supported - Test with Modernizr
                if ( o.options.developmentMode ) {
                    console.log( 'Modernizr: MQ supported' );
                }
                if ( !Modernizr.mq( '( min-width: ' + minWidth + ' )' ) ) {
                    o.layoutContracted();
                } else {
                    o.layoutExpanded();
                }

            } else { // Unable to detect MQ support - Test width using outerWidth - less reliable
                if ( o.options.developmentMode ) {
                    console.log( 'unable to detect MQ support' );
                }
                if ( $( window ).outerWidth() < parseInt( minWidth ) ) {
                    o.layoutContracted();
                } else {
                    o.layoutExpanded();
                }
            }
        };

        // External Helper Functions ===============================================

        /**
         * Contracted layout
         * @returns {Plugin}
         */
        o.layoutContracted = function() {

            if ( !o.container.hasClass( o.contractedClass ) ) { // not contracted

                // Contract any expanded siblings and their children
                menuBlur( { 'type': 'layoutContracted' } );

                // Apply Contracted class
                o.container
                    .removeClass( o.expandedClass )
                    .addClass( o.contractedClass )
                    .find( '.' + o.itemHoverClass ).removeClass( o.itemHoverClass );

                if ( o.animateBool ) { // using CSS3 transitions

                    // Recalculate menu heights
                    o.calculateHeights();
                }

                // Remove hover events
                o.el.off( 'mouseenter.le mouseleave.le' );

                // Show Toggle Link and setup topMenu
                o.tButton.addClass( o.tButtonShowClass );
                if ( !o.tButton.hasClass( o.tButtonActiveClass ) ) { // topMenu not active

                    // Hide topMenu
                    o.topMenu
                        .addClass( o.menuHiddenClass )
                        .show()
                        .removeClass( o.menuExpandedClass )
                    ;
                } else { // topMenu is active

                    // Show topMenu
                    o.topMenu
                        .removeClass( o.menuHiddenClass )
                        .show()
                        .addClass( o.menuExpandedClass );
                    if ( o.animateBool ) { // Using CSS3 transitions
                        o.topMenu
                            .css({
                                'max-height': 'none'
                            })
                        ;
                    }
                }
            }

            if ( o.options.developmentMode ) {
                console.log( 'responsive-menu: contracted layout' );
            }
            return this;
        };

        /**
         * Expanded layout
         * @returns {Plugin}
         */
        o.layoutExpanded = function() {

            if ( !o.container.hasClass( o.expandedClass ) ) { // not expanded

                // Contract any expanded siblings and their children
                menuBlur( { 'type': 'layoutExpanded' } );

                // Apply expanded class to container
                o.container
                    .removeClass( o.contractedClass )
                    .addClass( o.expandedClass  )
                    .find( '.' + o.itemHoverClass ).removeClass( o.itemHoverClass );

                if ( o.animateBool ) { // using CSS3 transitions

                    // Recalculate menu heights
                    o.calculateHeights();
                }

                // Re-apply mouse events
                o.el.off( 'mouseenter.le mouseleave.le' )

                    // Add mouseenter to all menu items to trigger focus
                    .on( 'mouseenter.le', o.options.menuItemsSel, itemFocus )

                    // Add mouseleave to trigger focus when re-entering parent of expanded menu
                    .on( 'mouseleave.le', o.options.menuItemsSel, itemLeave )

                    // Add mouseleave on topmenu to trigger menu blur
                    .on( 'mouseleave.le', o.topMenu, menuBlur )
                ;

                // Show Menu - Hide Toggle Link
                o.tButton.removeClass( o.tButtonShowClass );
                o.topMenu.removeClass( o.menuHiddenClass )
                    .show()
                    .addClass( o.menuExpandedClass );
                if ( o.animateBool ) { // Using CSS3 transitions
                    o.topMenu
                        .css({
                            'max-height': 'none',
                            'overflow': 'visible'
                        })
                    ;
                }
            }
            if ( o.options.developmentMode ) {
                console.log( 'responsive-menu: expanded layout' );
            }
            return this;
        };

        /**
         * Calculate the heights of each submenu and store in data object, reset styles
         * Used when CSS3 transitions are enabled
         * @returns {Plugin}
         */
        o.calculateHeights = function() {

            // Unstyle menus to original state to measure heights and then reapply styles
            o.menus
                .addClass( o.menuCalcClass )
                .removeClass( o.menuExpandedClass )
                .attr( 'style', '' )
                .show( 0 );

            // Reselect to force application of styles
            o.menus.each( function () {
                    var $el = $( this );
                    $el
                        .data( 'height', $el.height() )
                    ;
                })
                .css( {
                    'max-height': '0'
                })
                .removeClass( o.menuCalcClass )
            ;
            return this;
        };

        /**
         * Toggle visibility of entire menu
         * @param {Object} el - The toggle Link element
         */
        o.toggleMenu = function( el ) {

            // Contract all sub-menus
            contract( o.topMenu );

            if ( !o.topMenu.hasClass( o.menuHiddenClass ) ) { // topMenu is visible

                // Hide topMenu
                $( el ).removeClass( o.tButtonActiveClass );
                contract( o.container );

            } else { // menu is hidden

                // Show topMenu
                $( el ).addClass( o.tButtonActiveClass );
                o.topMenu.removeClass( o.menuHiddenClass );
                if ( o.animateBool ) { // Using CSS3 transitions
                    o.topMenu.css( 'max-height', '0' );
                } else { // Use jQuery animation
                    o.topMenu.hide( 0 );
                }
                expand( o.el );
            }

        };

        // internal Event Handler Functions ===============================================

        /**
         * Toggle Btn focus and mousedown event handler
         * @param {event} e - event object
         */
        var tButtonFocus = function( e ) {

            e.stopPropagation();

            var $el = $( e.target );

            clearTimeout( o.timer );
            o.timer = setTimeout( function () {
                o.toggleMenu( e.target );
            }, 100 );
        };

        /**
         * Toggle Btn Click event handler
         * @param {event} e - event object
         */
        var tButtonClick = function( e ) {

            e.preventDefault();
            e.stopPropagation();
        };

        /**
         * Item click and touchend event handler
         * @param {event} e - event object
         */
        var itemClick = function( e ) {

            var $el = $( e.currentTarget );

            e.stopPropagation();

            if ( ( $el.hasClass( o.itemHoverClass ) || !$el.hasClass( o.parentClass ) ) && !o.touchMoveBool ) {
                location.href = $el.children( 'a' ).attr('href');
                menuBlur( e );
            } else if ( e.type !== 'touchend' ) {
                e.preventDefault();
            }

            o.touchMoveBool = false;
        };

        /**
         * Menu item focus and mouseenter event handler -
         * Triggers: focus, mouseenter
         * @param {event} e - event object
         */
        var itemFocus = function( e ) {

            // get current target before it changes
            var $el = $( e.currentTarget );

            e.stopPropagation();

            // Add focus if item does not have focus
            if ( e.type !== 'focusin' ) {
                $el.children( 'a' ).not( ':focus' ).focus();
            }
            o.itemFocused = $el;

            clearTimeout( o.timer );
            o.timer = setTimeout( function () {

                // Expand topmenu if toggle button is active and menu is contracted
                if ( o.tButton.hasClass( o.tButtonShowClass ) && !o.tButton.hasClass( o.tButtonActiveClass )) {
                    o.toggleMenu( o.tButton.get(0) );
                }

                // Expand menu
                if ( $el.hasClass( o.parentClass ) ) {

                    if ( !$el.hasClass( o.itemHoverClass ) ) {

                        // Contract any expanded siblings and their children
                        contract( $el.parent() );

                        expand( $el );
                    }
                } else {
                    // Contract any expanded siblings and their children
                    contract( $el.parent() );
                }
            }, 100 );
        };

        /**
         * Touchmove event handler
         * @param {event} e - event object
         */
        var touchMove = function( e ) {
            o.touchMoveBool = true;
        };

        /**
         * Topmenu mouseleave and foucusout event handler
         * Triggers: mouseleave, focusout
         * @param {event} e - event object
         */
        var menuBlur = function( e ) {

            // Define event type if e is undefined
            e = e || { 'type': 'callback' };

            clearTimeout( o.timer );
            o.timer = setTimeout( function () {

                if ( o.itemFocused ) {
                    o.itemFocused.children( 'a' ).blur();
                    o.itemFocused = false;
                }
                contract( o.topMenu );
            }, 100 );
        };

        /**
         * Sub-menu item mouseleave event handler - used with expanded layout
         * Triggers: mouseleave
         * @param {event} e - event object
         */
        var itemLeave = function( e ) {

            // get current target before it changes
            var $el = $( e.currentTarget );

            clearTimeout( o.timer );
            o.timer = setTimeout( function () {

                // Focus the parent element of the expanded menu
                $el.parent().parent().children( 'a' ).focus();
            }, 100 );
        };

        /**
         * The CSS3 Transition End Contract event handler - used to add call-back functions to CSS3 transitions
         * @param {event} e - event object
         */
        var transitionEndContract = function( e ) {

            if ( e.originalEvent.propertyName === 'max-height' ) {

                var $el = $( e.currentTarget );
                e.stopPropagation();

                // Menu Contracted
                $el
                    .css( {
                        'transition': '',
                        'max-height': '0',
                        'overflow': 'hidden'
                    } )
                    .removeClass( o.menuExpandedClass )
                    .off( 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd' )
                    .parent().find( '.' + o.itemHoverClass ).addBack().removeClass( o.itemHoverClass )
                ;

                if ( $el.hasClass( o.topMenuClass ) ) { // is topMenu

                    // accessibly hide topMenu
                    $el
                        .addClass( o.menuHiddenClass )
                        .show( 0 );
                }

                // Scroll to expanded menu
                scrollMenu( o.itemFocused );
            }
        };

        /**
         * The CSS3 Transition End Expand event handler - used to add call-back functions to CSS3 transitions
         * @param {event} e - event object
         */
        var transitionEndExpand = function( e ) {

            if ( e.originalEvent.propertyName === 'max-height' ) {
                var $el = $( e.currentTarget );
                e.stopPropagation();

                // Menu expanded
                $el
                    .removeClass( o.menuHiddenClass )
                    .css( {
                        'transition': '',
                        'max-height': 'none',
                        'overflow': 'visible'
                    } )
                    .addClass( o.menuExpandedClass )
                    .off( 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd' )
                ;
                $el.parent( '.' + o.parentClass ).addClass( o.itemHoverClass );

                // Scroll to expanded menu
                scrollMenu( o.itemFocused );
            }
        };

        // Internal Helper Functions ===============================================

        /**
         * Contract sub-menus
         * @param {Object} $parent - The parent element of the menu Item initiating the event
         */
        var contract = function( $parent ) {

            var $menus = $parent.find( o.options.menuSel );

            if ( o.animateBool ) { // Using CSS3 transitions

                // Set max-height to height of each expanded menu
                $menus.each( function(){
                    var $el = $( this );
                    if ( $el.height() !== 0 ) {
                        $el
                            .css({
                                'max-height': $el.height(),
                                'transition': 'max-height ' + String( o.options.transitionSpeed / 1000 ) + 's ' + o.options.css3Easing,
                                'overflow': 'hidden'
                            })
                            .on( 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', transitionEndContract )
                        ;
                    } else {
                        $menus.not( $el );
                    }
                });

                // Must force a redraw so transition will occur
                $menus.hide(0).show(0);

                // Contract menu
                $menus
                    .css({
                        'max-height': '0'
                    })
                    .removeClass( o.menuExpandedClass )
                ;

            } else { // Use jQuery animation

                // Contract menus
                $menus.each( function() {

                    var $el = $( this );

                    if ( $el.height() !== 0 ) {

                        $el
                            .slideUp( o.options.transitionSpeed, o.options.jqueryEasing, function () {

                                $el
                                    .css( 'overflow', 'visible' )
                                    .removeClass( o.menuExpandedClass )
                                    .parent( '.' + o.parentClass )
                                    .removeClass( o.itemHoverClass )
                                ;

                                if ( $el.hasClass( o.topMenuClass ) ) {
                                    o.topMenu.addClass( o.menuHiddenClass );
                                }

                                // Scroll to expanded menu
                                scrollMenu( o.itemFocused );
                            })
                        ;
                    }
                });
            }
        };

        /**
         * Expand sub-menu
         * @param {Object} $el - The menu Item initiating the event
         */
        var expand = function( $el ) {

            // Define menu
            var $menu = $el.children( o.options.menuSel );

            // Remove hover class from siblings
            $el.siblings( '.' + o.itemHoverClass )
                .removeClass( o.itemHoverClass );

            if ( o.animateBool ) { // Using CSS3 transitions

                // Expand menu
                $menu
                    .css({
                        'transition': 'max-height ' + String( o.options.transitionSpeed / 1000 ) + 's ' + o.options.css3Easing,
                        'max-height': $menu.data('height')
                    })
                    .on( 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', transitionEndExpand )
                ;
            } else { // Use jQuery animation

                // Expand menu
                $menu
                    .slideDown( o.options.transitionSpeed, o.options.jqueryEasing, function() {
                        $el.addClass( o.itemHoverClass );
                        $menu
                            .addClass( o.menuExpandedClass )
                            .css( 'overflow','visible' )
                        ;
                        console.log('jquery expand');

                        // Scroll to expanded menu
                        scrollMenu( o.itemFocused );
                    })
                ;
            }
        };

        // initialize ----------------------------------------------------------------
        o.init( el );

        return this;
    };

    /**
     * Create plugin obects
     * @param {Object} options - Plugin options
     * @returns {*}
     */
    $.fn[ pluginName ] = function( options ) {

        // Return collection of elements
        return this.each( function() {
            var $el = $( this );
            if ( !$el.data( pluginName ) ) {
                $el.data( pluginName, new Plugin( this, options ) );
            }
        });
    };

    // Out of Scope Private functions ==================================================

    /**
     * Test for transform3d support
     * @returns {boolean}
     */
    var transform3DSupported = function() {
        var el = document.createElement('p'),
            has3d,
            transforms = {
                'webkitTransform':'-webkit-transform',
                'OTransform':'-o-transform',
                'msTransform':'-ms-transform',
                'MozTransform':'-moz-transform',
                'transform':'transform'
            };

        // Add it to the body to get the computed style
        document.body.insertBefore(el, null);

        for(var t in transforms){
            if( el.style[t] !== undefined ){
                el.style[t] = 'translate3d(1px,1px,1px)';
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }

        document.body.removeChild(el);

        return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    };

    /**
     * Test for CSS3 transitions support
     * @returns {boolean}
     */
    var transitionsSupported = function() {
        var b = document.body || document.documentElement,
            s = b.style,
            p = 'transition';

        if (typeof s[p] === 'string') { return true; }

        // Tests for vendor specific prop
        var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
        p = p.charAt(0).toUpperCase() + p.substr(1);

        for (var i=0; i<v.length; i++) {
            if (typeof s[v[i] + p] === 'string') { return true; }
        }

        return false;
    };

    /**
     * Scroll Menu into viewport if off screen
     * @returns {boolean}
     */
    var scrollMenu = function( $el ) {

        if ( $el.length ) {

            var viewTop = $( window ).scrollTop();
            var viewBottom = viewTop + $( window ).height();
            var boundsTop = $el.offset().top;
            var boundsBottom = boundsTop + $el.outerHeight();

            if ( boundsBottom > viewBottom || boundsTop < viewTop ) {
                $( 'html, body' ).animate( { scrollTop: boundsTop }, 'slow' );
            }
        }
    };

})( jQuery, window, document, Math );