function parseDecklist(raw) {
	//var decklist = {};
	var decklistContainer = $('<div></div>');
	var decklist = $('<div></div>');
	decklistContainer.append(decklist);
	//var column = $('<div>)
	
	var column = $('<div></div>');
	var columns = [column];
	//var header = null;
	var tokens = markdown.parse(raw);
	for (var i = 1; i < tokens.length; i++) {
		if (tokens[i][0] == 'hr' && columns.length < 4) {
			column = $('<div></div>');
			columns.push(column);
		} else if (tokens[i][0] == 'header') {
			column.append($('<h3></h3>').text(tokens[i][2]));
		} else if (tokens[i][0] == 'para') {
			//console.log(tokens[i][1].split("\n"));
			var cards = tokens[i][1].split("\n");
			for (var j = 0; j < cards.length; j++) {
				var num = cards[j].split(' ', 1)[0] + " ";
				var card = cards[j].split(' ').slice(1).join(' ')
				var div = $('<div></div>');
				div.append($('<span></span>').text(num));
				div.append($('<span></span>').text(card).addClass('inlinemtg'));
				column.append(div);
			}
		}
	}

	for (var i = 0; i < columns.length; i++) {
		var width = 12/columns.length
		decklist.append(columns[i].addClass('col-md-' + width));
	}

	//console.log(decklist);

	$("#preview").html(decklist.html());
	$("#source").text(decklistContainer.html());

	inlinemtg.linkcards( $( document ) );
}

$(function() {
	var onChange = function(e) {
		parseDecklist($("#decklist").val());
	};

	$("#decklist").keyup(onChange);
	$("#decklist").change(onChange);

	parseDecklist($("#decklist").val());

	$("#decklist").height($("#decklistHelp").height());
});