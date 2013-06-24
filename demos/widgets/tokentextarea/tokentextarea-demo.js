( function( $, window ) {
	$.mobile.document.one( "pagecreate", "#tokentextarea", function() {
		var $tta = $( ":jqmData(role='tokentextarea')" ),
			$popup = $( ".tta-popup .ui-popup-text" );

		$( "#TTAaddItemTest" ).on( "click", function() {
			$tta.tokentextarea( "add", "additem" );
		});

		$( "#TTAremoveItemTest" ).on( "click", function() {
			$tta.tokentextarea( "remove", 0 );
		});

		$( "#TTAinputTextTest" ).on( "click", function() {
			$tta.tokentextarea( "inputText", "Hello~~~" );
		});

		$( "#TTAgetInputTextTest" ).on( "click", function() {
			var input = $tta.tokentextarea( "inputText" );
			$popup.text( "Input string : " + input );
		});

		$( "#TTAremoveAllItemTest" ).on( "click", function() {
			$tta.tokentextarea( "remove" );
		});

		$( "#TTAgetSelectedItemTest" ).on( "click", function() {
			var content = $tta.tokentextarea( "select" );
			$popup.text( "Select content : " + content );
		});

		$( "#TTAselectItemTest" ).on( "click", function() {
			$tta.tokentextarea( "select", 0 );
		});

		$( "#TTAlengthTest" ).on( "click", function() {
			var length = $tta.tokentextarea( "length" );
			$popup.text( "Length : " + length );
		});

		$( "#TTAfocusInTest" ).on( "click", function() {
			$tta.tokentextarea( "focusIn", 0 );
		});

		$( "#TTAfocusOutTest" ).on( "click", function() {
			$tta.tokentextarea( "focusOut", 0 );
		});

		$( "#TTAdestroyTest" ).on( "click", function() {
			$tta.tokentextarea( "destroy" );
		});
	});

	$.mobile.document.one( "pagecreate", "#addressbook", function() {
		var self = this,
			$address = $( "#addressbook" );

		self.itemSelected = false;

		$address.on( "mousedown", function() {
			self.itemSelected = false;
		});

		$address.on( "mouseup", function() {
			self.itemSelected = true;
		});

		$( "#contentList a" ).on( "click", function() {
			if ( self.itemSelected ) {
				var arg = $( this ).text();
				$( ":jqmData(role='tokentextarea')" ).tokentextarea( "add", arg );
				history.back();
			}
		});
	});
} ( jQuery, window ) );
