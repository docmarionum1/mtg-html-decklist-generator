var includes = [
	'<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">',
	'<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>',
	'<script src="//docmarionum1.github.io/mtg-html-decklist-generator/lib/inlinetooltip.1.0.js"></script>',
    '<script src="//docmarionum1.github.io/mtg-html-decklist-generator/lib/inlinemtg.1.0.js"></script>'].join("");

var deckStyle;

function parseDecklist(raw) {
	var decklistContainer = $('<div></div>');
	var decklist = $('<div></div>').addClass('decklist').addClass('row');

	var column = $('<div></div>').addClass('column');
	var columns = [column];

	var tokens = markdown.parse(raw);
	for (var i = 1; i < tokens.length; i++) {
		if (i == 1 && tokens[i][0] == "para" && typeof tokens[i][1] == 'object' && tokens[i][1][0] == 'em') {
			var titleRow = $('<div></div>').addClass('title');
			var titletext = $('<h2></h2>').text(tokens[i][1][1]);
			titleRow.append(titletext);
			decklistContainer.append(titleRow);
		} else if (tokens[i][0] == 'hr' && columns.length < 4) {
			column = $('<div></div>').addClass('column');
			columns.push(column);
		} else if (tokens[i][0] == 'header') {
			column.append($('<h3></h3>').text(tokens[i][2]).addClass('section'));
		} else if (tokens[i][0] == 'para') {
			var cards = tokens[i][1].split("\n");
			for (var j = 0; j < cards.length; j++) {
				var num = cards[j].split(' ', 1)[0];
				var card = cards[j].split(' ').slice(1).join(' ');
				if (num && card) {
					var div = $('<div></div>');
					div.append($('<span></span>').text(num).addClass('count'));
					div.append($('<span></span>').text(card).addClass('inlinemtg').addClass('card'));
					column.append(div);
				}
			}
		}
	}

	for (var i = 0; i < columns.length; i++) {
		var width = 12/columns.length
		decklist.append(columns[i].addClass('col-md-' + width));
	}

	decklistContainer.append(decklist);

	$("#preview").html(decklistContainer.html());

	var style = $('<style></style>').html(deckStyle);
	decklistContainer.append(style);

	$("#source").text(includes + decklistContainer.html());

	inlinemtg.linkcards( $( document ) );
}

$(function() {
	var onChange = function(e) {
		parseDecklist($("#decklist").val());
	};

	$("#decklist").keyup(onChange);
	$("#decklist").change(onChange);

	var changeStyle = function(e) {
		var href = 'css/decklist_styles/' + $("#styleDropdown").val() + '.css';
		$("#decklistStyle").attr('href', href);
		$.get(href, function(d) {
			deckStyle = d;
			parseDecklist($("#decklist").val());
		});
	};

	$("#styleDropdown").change(changeStyle);

	$("#source").focus(function() { $(this).select(); } );

	changeStyle();

	$("#decklist").height($("#decklistHelp").height());
});
