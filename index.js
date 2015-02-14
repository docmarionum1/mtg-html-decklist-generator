var includes = [
	'<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">',
	'<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>',
	'<script src="//cdn.rawgit.com/NickolasReynolds/9305934/raw/ba30c0e5ddb5f56cf69dcc5e8bc5b20717936830/inlinetooltip.1.0.js"></script>',
    '<script src="//cdn.rawgit.com/NickolasReynolds/9306194/raw/a23cf6c5f02d4edae8a443098e195070e6652252/inlinemtg.1.0.js"></script>'].join("");

var deckStyle;

function parseDecklist(raw) {
	//var decklist = {};
	var decklistContainer = $('<div></div>');

	var style = $('<style></style>').html(deckStyle);
	decklistContainer.append(style);

	var decklist = $('<div></div>').addClass('decklist').addClass('row');
	decklistContainer.append(decklist);
	//var column = $('<div>)
	
	var column = $('<div></div>').addClass('column');
	var columns = [column];
	//var header = null;
	var tokens = markdown.parse(raw);
	for (var i = 1; i < tokens.length; i++) {
		if (tokens[i][0] == 'hr' && columns.length < 4) {
			column = $('<div></div>').addClass('column');
			columns.push(column);
		} else if (tokens[i][0] == 'header') {
			column.append($('<h3></h3>').text(tokens[i][2]).addClass('section'));
		} else if (tokens[i][0] == 'para') {
			//console.log(tokens[i][1].split("\n"));
			var cards = tokens[i][1].split("\n");
			for (var j = 0; j < cards.length; j++) {
				var num = cards[j].split(' ', 1)[0] + " ";
				var card = cards[j].split(' ').slice(1).join(' ');
				var div = $('<div></div>');
				div.append($('<span></span>').text(num).addClass('count'));
				div.append($('<span></span>').text(card).addClass('inlinemtg').addClass('card'));
				column.append(div);
			}
		}
	}

	for (var i = 0; i < columns.length; i++) {
		var width = 12/columns.length
		decklist.append(columns[i].addClass('col-md-' + width));
	}


	$("#preview").html(decklistContainer.html());
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