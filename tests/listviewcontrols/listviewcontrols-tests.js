/*
 * listviewcontrols unit tests
 */
(function ($) {
    $.mobile.defaultTransition = "none";

    module("listviewcontrols");

    asyncTest("constructor validates options when applied programmatically", function () {
        var target = $('#listviewcontrols-test-validates-target');
        var controlsSelector = '#listviewcontrols-test-validates-controls';
        var controls = $(controlsSelector);

        var check = function (testNumber, options) {
          console.log("***** test " + testNumber);
          target.listviewcontrols(options);
          var hasClass = target.hasClass('ui-listviewcontrols-listview');
          target.listviewcontrols('destroy');
          equal(hasClass, false, 'test ' + testNumber);
        };

        // no options
        check(1);

        // controlPanelSelector is falsy
        check(2, {controlPanelSelector: null});
        check(3, {controlPanelSelector: undefined});

        // modesAvailable is bad
        check(4, {controlPanelSelector: controlsSelector, modesAvailable: null});
        check(5, {controlPanelSelector: controlsSelector, modesAvailable: false});
        check(6, {controlPanelSelector: controlsSelector, modesAvailable: 0});
        check(7, {controlPanelSelector: controlsSelector, modesAvailable: ''});
        check(8, {controlPanelSelector: controlsSelector, modesAvailable: {}});
        check(9, {controlPanelSelector: controlsSelector, modesAvailable: []});
        check(10, {controlPanelSelector: controlsSelector, modesAvailable: ['']});
        check(11, {controlPanelSelector: controlsSelector, modesAvailable: ['string']});
        check(12, {controlPanelSelector: controlsSelector, modesAvailable: [null, null]});
        check(13, {controlPanelSelector: controlsSelector, modesAvailable: [0, 0]});
        check(14, {controlPanelSelector: controlsSelector, modesAvailable: ['', '']});
        check(15, {controlPanelSelector: controlsSelector, modesAvailable: ['string', {}]});
        check(16, {controlPanelSelector: controlsSelector, modesAvailable: [{}, 'string']});
        check(17, {controlPanelSelector: controlsSelector, modesAvailable: [0, 'string']});
        check(18, {controlPanelSelector: controlsSelector, modesAvailable: ['string', 0]});

        // mode is bad
        check(19, {controlPanelSelector: controlsSelector, modesAvailable: ['foo', 'bar'], mode: null});
        check(20, {controlPanelSelector: controlsSelector, modesAvailable: ['foo', 'bar'], mode: false});
        check(21, {controlPanelSelector: controlsSelector, modesAvailable: ['foo', 'bar'], mode: ''});
        check(22, {controlPanelSelector: controlsSelector, modesAvailable: ['foo', 'bar'], mode: 'zoink'});

        // controlPanelSelector references invalid element
        check(23, {controlPanelSelector: '', modesAvailable: ['foo', 'bar'], mode: 'foo'});
        check(24, {controlPanelSelector: 'noelement', modesAvailable: ['foo', 'bar'], mode: 'foo'});

        // controlPanelShowIn is bad
        check(25, {controlPanelSelector: controlsSelector, modesAvailable: ['foo', 'bar'], mode: 'foo', controlPanelShowIn: true});
        check(26, {controlPanelSelector: controlsSelector, modesAvailable: ['foo', 'bar'], mode: 'foo', controlPanelShowIn: 'zoink'});

        // all options valid
        target.listviewcontrols({
            controlPanelSelector: controlsSelector,
            modesAvailable: ['foo', 'bar'],
            mode: 'foo',
            controlPanelShowIn: 'foo'
        });
        equal(target.hasClass('ui-listviewcontrols-listview'), true);
        equal(controls.hasClass('ui-listviewcontrols-panel'), true);
        target.listviewcontrols('destroy');

        start();
    });

    asyncTest("constructor supplies defaults correctly", function () {
        var target = $('#listviewcontrols-test-defaults-target');
        var controlsSelector = '#listviewcontrols-test-defaults-controls';
        var controls = $(controlsSelector);

        target.listviewcontrols({controlPanelSelector: controlsSelector});

        deepEqual(target.listviewcontrols('option', 'modesAvailable'),
              ['edit', 'view'],
              "Should default to 'edit' and 'view' as modesAvailable");

        equal(target.listviewcontrols('option', 'mode'),
              'view',
              "Should default to 'view' as mode");

        equal(target.listviewcontrols('option', 'controlPanelShowIn'),
              'edit',
              "Should default to showing control panel in 'edit' mode");

        equal(target.hasClass('ui-listviewcontrols-listview'), true);
        equal(controls.hasClass('ui-listviewcontrols-panel'), true);

        target.listviewcontrols('destroy');

        start();
    });

})(jQuery);
