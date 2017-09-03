/*
    review.js

    File contains code to render the flash card deck and run the
    user interaction with the cards. The first card is rendered and
    event handler is set to handle user clicks on the card deck.

    Requirements:
        Array of cards to display must be stored in local storage 
        under the 'cards' key.

    TODO:
        * Add animation for transition to next card.
        * Action for user to take when end of deck is reached.

    Last modified by JD on 9/3/17 at 9:30 AM.
*/

// retrieve cards array from local storage
var cards = JSON.parse( localStorage.getItem( 'cards' ) || [] );

// id for element that will contain card elements
var cardContainerId = "card-container";

// active card pulled from the deck
var currentCard;

// setup the deck and shuffle
deck.setCards( cards );
deck.shuffle();

// get the first card from the deck (pop the card)
currentCard = deck.popCard();

// render the card
renderCard( cardContainerId, currentCard );

// Handles click event on the next card button
function handleNextCardBtn() {
    console.log("clicked next");
	// if the user has gone through the deck ...
	if ( !deck.cardsRemaining() ) {
		// ... user has gone through the deck
		// unset current card and update view
		currentCard = null;
		renderEndOfDeck( cardContainerId );			

	// if cards remain in the deck ...		
	} else {
		// ... get the next card and render it
		currentCard = deck.popCard();
		renderCard( cardContainerId, currentCard );
	}
}

/*
    Functions for rendering a card
    --------------------------------------------------------------- */
// Returns an html element for a card
function getCardElement ( front, back = false ) {
    // card element values
    var cardCss = {
        'height': '250px'
    };
    var btnClass = 'btn btn-primary'
        + ' btn-sm pull-right';

    // jquery objects for elements
    var $cardDiv = $( '<div>' );
    var $front = $( '<div>' );
    var $back = $( '<div>' );
    var $btn = $( '<button class="' + btnClass 
        + '">Next</button>' );

    // height must be fixed else text overflow problems may occur
    $cardDiv
        .append( [$front, $back] )
        .css( cardCss );

    // give each side the panel class from bootstrap
    $front.addClass( 'panel panel-default front' );
    $back.addClass( 'panel panel-default back' );

    // add a panel-body with text for each side of card
    // and a next button
    // front
    $( '<div>' )
        .text( front )
        .addClass( 'panel-body' )
        .append( $btn.clone() )
        .appendTo( $front );
    // back
    $( '<div>' )
        .text( back )
        .addClass( 'panel-body' )
        .append( $btn )
        .appendTo( $back );


    // set flip behavior from jQuery.flip.js library
    $cardDiv.append( [$front, $back] ).flip( {

        // setting for flip animation
        'reverse': true, // card flips back in opposit direction
        'speed': 300, // speed in ms
        'forceHeight': true // forces height of card to that of container
    } );
    return $cardDiv.get();
}

// Renders a card in the element with an id = containerId. Reterns
// the container element
function renderCard ( containerId, card, reverse = false ) {
    var cardEl;
    var $cardCont = $( "#" + containerId );

    // clear the card container
    $cardCont.empty();

    if ( reverse ) {
        // swap front and back parameters to reverse the card
        cardEl = getCardElement( card.back.text, card.front.text );
    } else {
        // get card in standard (not reversed) configuration
        cardEl = getCardElement( card.front.text, card.back.text );
    }
    // append the card to the container and return the element
    var container = $cardCont.append( cardEl ).get();
    return container;
}

// Renders end of deck view in card container. Returns element.
function renderEndOfDeck( containerId ) {
    
    var endOfDeckText = "End of Deck";

    return $("#" + containerId )
        .empty()
        .append("<p>" + endOfDeckText + "</p>")
        .get();
}

$( document ).ready( function() {
	if ( cards.length ) {
		// Listen for click event on the next card button
		$( "#" + cardContainerId ).on( 'click', function( e ) {
            if ( e.target.nodeName === 'BUTTON' ) {
                handleNextCardBtn();
            }
        } );
	}	
} );