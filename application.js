// Test to make sure this is injected

$(document).ready(function() {
	console.log('js injected');

	// a little helper function that lets you select an element at x,y (start at 0,0)
	// (watch out for the non-middle rows - x will always be "along from the left")
	function at(x,y){
		return $('.board .myrow').eq(x).find('div').eq(y);
	}

	// clear the text of all the squares
	function clear(){
		$('.board .myrow div').text('').removeClass('selected')
	}

	var Piece = function(x,y,colour){
		this.x=x;
		this.y=y;
		this.colour=colour;
	};

	// initialise pieces
	var white = new Piece(16,8,'white');
	var black = new Piece(0,8,'black');

	// create array of pieces
	var pieces = [white,black];

	function draw(x,y,colour){
		if (colour==='white') {
			at(x,y).html("<span class='piece'>&#9817;</span>");
		}
		else {
			at(x,y).html("<span class='piece'>&#9823;</span>");
		}
	}

	var render = function(){
		clear();

		for (i=0;i<pieces.length;i++){
			draw(pieces[i].x ,pieces[i].y, pieces[i].colour);
		}

		$('.myrow').each(function(row){
			$(this).find('> div').each(function(col){
				$(this).data('coords', {row:row, col:col})
			});
		});

		$('.piece').draggable({
			cursor: 'hand',
			containment: ".board"
		});

		$('.board .myrow div').droppable({
			accept: '.piece',
			hoverClass: 'hover',
			drop: function(event, ui) {

				var old_square = ui.draggable;
				var new_square = this;
				var args = [$(old_square).parent().data('coords').row,$(old_square).parent().data('coords').col,
					$(new_square).data('coords').row,$(new_square).data('coords').col];

				move(args[0],args[1],args[2],args[3],1);

			},
		});

	}


	// render the initial board - this is noe done through socket.io
	render();

	// create global variables to contral the turns
	var turn=0; 			// this is the turn number
	var lastPiece=-1; 		// this will hold the index of the last piece moved
	var lastMoveJump=0; 	// this will tell if the last move was a jump
	var shingShang=0;		// this will tell if there's been a shing shang
	var gameOver=0;


});