/*
 * autodividers unit tests
 */

(function ($) {
  $.mobile.defaultTransition = "none";

	module( "Autodividers" );

	asyncTest( "Adds dividers based on first letters of list items.", function() {
		$.testHelper.pageSequence([
			function() {
				$.testHelper.openPage( '#autodividers-test' );
			},

			function() {
				var $new_page = $( '#autodividers-test' );

				ok( $new_page.hasClass( 'ui-page-active' ) );
				ok( $new_page.find( '.ui-li-divider' ).length === 4 );

				start();
			}
		]);
	});

	asyncTest( "Responds to addition/removal of list elements.", function() {
		$.testHelper.pageSequence([
			function() {
				$.testHelper.openPage( '#autodividers-test' );
			},

			function() {
				var $new_page = $( '#autodividers-test' );
				ok($new_page.hasClass( 'ui-page-active' ));

				var $listview = $new_page.find( 'ul' );

				// should remove all existing dividers
				ok( $new_page.find( 'li:contains("SHOULD REMOVE")' ).length === 0 );

				// add li; should add an "X" divider
				$listview.append( '<li>x is for xanthe</li>' );
				ok( $new_page.find( '.ui-li-divider' ).length === 5 );
				ok( $new_page.find( '.ui-li-divider' ).is( ':contains("X")' ) );

				// adding the same element again should create a valid list
				// item but no new divider
				ok( $new_page.find( '.ui-li-static' ).length === 5 );
				$listview.append( '<li>x is for xanthe</li>' );
				ok( $new_page.find( '.ui-li-divider' ).length === 5 );
				ok( $new_page.find( '.ui-li-divider:contains("X")' ).length === 1 );
				ok( $new_page.find( '.ui-li-static' ).length === 6 );

				// should ignore addition of non-li elements to the list
				$listview.find( 'li:eq(0)' ).append( '<span>ignore me</span>' );
				ok( $new_page.find( '.ui-li-divider' ).length === 5 );
				ok( $new_page.find( '.ui-li-static' ).length === 6 );

				// add li with the same initial letter as another li
				// but after the X li item; should add a second "B" divider to the
				// end of the list
				$listview.append( '<li>b is for barry</li>' );
				ok( $new_page.find( '.ui-li-divider' ).length === 6 );
				ok( $new_page.find( '.ui-li-divider:contains("B")' ).length === 2 );

				// remove the item with a repeated "b"; should remove the second
				// "B" divider
				$listview.find( 'li:contains("barry")' ).remove();
				ok( $new_page.find( '.ui-li-divider' ).length === 5 );
				ok( $new_page.find( '.ui-li-divider:contains("B")' ).length === 1 );

				// remove li; should remove the "A" divider
				$listview.find( 'li:contains("aquaman")' ).remove();
				ok( $new_page.find( '.ui-li-divider' ).length === 4 );
				ok( !$new_page.find( '.ui-li-divider' ).is( ':contains("A")' ) );

				// adding another "B" item after "C" should create two separate
				// "B" dividers
				$listview.find( 'li:contains("catwoman")' ).after( '<li>b is for barry</li>' );
				ok( $new_page.find( '.ui-li-divider' ).length === 5 );
				ok( $new_page.find( '.ui-li-divider:contains("B")' ).length === 2 );

				// if two dividers with the same letter have only non-dividers
				// between them, they get merged

				// removing catwoman should cause the two "B" dividers to merge
				$listview.find( 'li:contains("catwoman")' ).remove();
				ok( $new_page.find( '.ui-li-divider:contains("B")' ).length === 1 );

				// adding another "D" item before the "D" divider should only
				// result in a single "D" divider after merging
				$listview.find( 'li:contains("barry")' ).after( '<li>d is for dan</li>' );
				ok( $new_page.find( '.ui-li-divider:contains("D")' ).length === 1 );

				start();
			}
		]);
	});

	module( "Autodividers Selector" );

	asyncTest( "Adds divider text from links.", function() {
		$.testHelper.pageSequence([
			function() {
				$.testHelper.openPage( '#autodividers-selector-test' );
			},

			function() {
				var $new_page = $( '#autodividers-selector-test' );
				ok($new_page.hasClass( 'ui-page-active' ));

				// check we have the right dividers based on link text
				var $list = $( '#autodividers-selector-test-list1' );
				ok( $list.find( '.ui-li-divider' ).length === 4 );
				ok( $list.find( '.ui-li-divider:eq(0):contains(A)' ).length === 1 );
				ok( $list.find( '.ui-li-divider:eq(1):contains(B)' ).length === 1 );
				ok( $list.find( '.ui-li-divider:eq(2):contains(C)' ).length === 1 );
				ok( $list.find( '.ui-li-divider:eq(3):contains(D)' ).length === 1 );

				// check that adding a new item with link creates the right divider
				$list.append( '<li><a href="">e is for ethel</a></li>' );
				ok( $list.find( '.ui-li-divider:eq(4):contains(E)' ).length === 1 );

				start();
			}
		]);
	});

	asyncTest( "Adds divider text based on custom selector.", function() {
		$.testHelper.pageSequence([
			function() {
				$.testHelper.openPage( '#autodividers-selector-test' );
			},

			function() {
				var $new_page = $( '#autodividers-selector-test' );
				ok($new_page.hasClass( 'ui-page-active' ));

				// check we have the right dividers based on custom selector
				var $list = $( '#autodividers-selector-test-list2' );
				ok( $list.find( '.ui-li-divider' ).length === 4 );
				ok( $list.find( '.ui-li-divider:eq(0):contains(E)' ).length === 1 );
				ok( $list.find( '.ui-li-divider:eq(1):contains(F)' ).length === 1 );
				ok( $list.find( '.ui-li-divider:eq(2):contains(G)' ).length === 1 );
				ok( $list.find( '.ui-li-divider:eq(3):contains(H)' ).length === 1 );

				// check that adding a new item creates the right divider
				$list.append( '<li><div><span class="autodividers-selector-test-selectme">' +
				'i is for impy</span></div></li>' );

				ok( $list.find( '.ui-li-divider:eq(4):contains(I)' ).length === 1 );

				start();
			}
		]);
	});

	asyncTest( "Adds divider text based on full text selected by custom selector.", function() {
		$.testHelper.pageSequence([
			function() {
				$.testHelper.openPage( '#autodividers-selector-test' );
			},

			function() {
				var $new_page = $( '#autodividers-selector-test' );
				ok($new_page.hasClass( 'ui-page-active' ));

				var $list = $( '#autodividers-selector-test-list3' );
				ok( $list.find( '.ui-li-divider' ).length === 2 );
				ok( $list.find( '.ui-li-divider:eq(0):contains(eddie)' ).length === 1 );
				ok( $list.find( '.ui-li-divider:eq(1):contains(frankie)' ).length === 1 );

				start();
			}
		]);
	});
})(jQuery);
