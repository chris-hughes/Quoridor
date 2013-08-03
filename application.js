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

	// initial number of walls
	var whiteWalls=7;
	var blackWalls=7;

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
		$('#whiteWalls').text(whiteWalls);
		$('#blackWalls').text(blackWalls);

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

	// render the initial board
	render();

	// setup wallplacer button
	$('#wallplacer').click(function() {
		if (gameOver==0){
			// event is triggered before class is changed so this mihght look backwards
		    if (!$(this).hasClass('active')) {
		    	$('.open').addClass('receive');
		    	$('.piece').draggable('disable');
		    }
		    else {
		    	$('.open').removeClass('receive');
		    	$('.piece').draggable('enable');
		    }
		}
  	});

  	// placing a wall (can only happen if wallplacer button is active)
  	$('.open').click(function(){
  		// stop people placing walls where they are already placed
  		if ($(this).hasClass('placed')) {
  			return;
  		}
  		else {
  			if ((turn % 2===0 && whiteWalls>0)||(turn % 2===1 && blackWalls>0)){
		  		if ($('#wallplacer').hasClass('active')){
			  		$(this).removeClass('open receive').addClass('placed');
			  		if (turn % 2===0){
						whiteWalls--;
					} else {
						blackWalls--;
					}
			  		turn++;
					$('#log').text(" ");
					if (turn % 2===0){
						$('#log').text("White's Turn");
						$('#turn_icon').css('color','white').text("White's Turn");
					} else {
						$('#log').text("Black's Turn");
						$('#turn_icon').css('color','black').text("Black's Turn");
					}

					$('#wallplacer').button('toggle');
					$('.open').removeClass('receive');
					render();
		  		}
		  	}
		  	else {
				$('#log').text("Not enough walls");
			}
  		}
  	});

	// function to check if a piece was jumped
	function jumped(startx,starty,newx,newy,piece){
		if (Math.abs(newx-startx)===2 || Math.abs(newy-starty)===2){
				return -1;
		}

		// jumping south
		else if (newx-startx===4 && newy-starty===0){
			var jumpPiece=-1;
			for (i=0;i<pieces.length;i++){
				if (pieces[i].x===(startx+2) && pieces[i].y===starty) {
					jumpPiece=i;
				}
			}
			return jumpPiece;	
		}

		// jumping west
		else if (newx-startx===0 && newy-starty===-4){
			var jumpPiece=-1;
			for (i=0;i<pieces.length;i++){
				if (pieces[i].x===(startx) && pieces[i].y===(starty-2)) {
					jumpPiece=i;
				}
			}
			return jumpPiece;
		}

		// jumping north
		else if (newx-startx===-4 && newy-starty===0){
			var jumpPiece=-1;
			for (i=0;i<pieces.length;i++){
				if (pieces[i].x===(startx-2) && pieces[i].y===(starty)) {
					jumpPiece=i;
				}
			}
			return jumpPiece;
		}

		// jumping east
		else if (newx-startx===0 && newy-starty===4){
			var jumpPiece=-1;
			for (i=0;i<pieces.length;i++){
				if (pieces[i].x===(startx) && pieces[i].y===(starty+2)) {
					jumpPiece=i;
				}
			}
			return jumpPiece;
		}

	}

	// function to check move is legal
	function legalMove(startx,starty,newx,newy,piece,movePiece){
		// check if they're trying to move off the board
		if (newx<0 || newx>16 || newy<0 || newy>16){
			render();
			$('#log').text('Can not move piece off the board');
			return false;
		}

		// check if they're trying to move too far or diagonally
		if (Math.abs(newx-startx)>0 && Math.abs(newy-starty)>0){
			render();
			$('#log').text('You cannot move diagonally');
			return false;
		}
		else if (Math.abs(newx-startx)>4 || Math.abs(newy-starty)>4) {
			render();
			$('#log').text('You can not move that far');
			return false;
		}


		// check to see if it was a jump and if so what piece was jumped
		// value of -1 means no jump was made
		var jumpPiece = jumped(startx,starty,newx,newy,piece);

		// if no jump then you can only move 1
		if (jumpPiece==-1 && Math.abs(newx-startx)+Math.abs(newy-starty)>2){
			render();
			$('#log').text('You can not move that far');
			return false;			
		}

		// if you've jumped you must move 2 (not coded as not necessary)

		// else it's a legal move
		else {
			return true;
		}

	}

	// check to see if someone has won
	function win(movePiece){
		var whiteDragonCount=0;
		var blackDragonCount=0;
		for (i=0;i<pieces.length;i++){
			if (pieces[i].colour==='white' && pieces[i].x===0) {
				$('#log').text('White wins!!! Sucks to be black');
				gameOver=1;
				return;
			}
			else if (pieces[i].colour==='black' && pieces[i].x===16) {
				$('#log').text('Black wins!!! Sucks to be white');
				gameOver=2;
				return;
			}
		}

	}

	// create global variables to contral the turns
	var turn=0; 			// this is the turn number
	var lastPiece=-1; 		// this will hold the index of the last piece moved
	var lastMoveJump=0; 	// this will tell if the last move was a jump
	var shingShang=0;		// this will tell if there's been a shing shang
	var gameOver=0;

	function move(startx,starty,newx,newy){

		// check if the game is over
		if (gameOver>0){
			win();	// this is just an easier way of logging who has won
			return;
		}

		// find the piece you are trying to move in the pieces array
		var movePiece=-1;
		for (i=0;i<pieces.length;i++){
			if (pieces[i].x===startx && pieces[i].y===starty) {
				movePiece=i;
			}
		}

		if (movePiece<0){
			render();
			$('#log').text("No piece to move in starting cell");
			return;
		}
		else if (turn % 2===0 && pieces[movePiece].colour==="black"){
			movePiece=-1; // this will stop the turn from happening
			render();
			$('#log').text("it is White's turn");
			return;
		}
		else if (turn % 2===1 && pieces[movePiece].colour==="white"){
			$('#log').text("it is Black's turn");
			render();
			movePiece=-1; // this will stop the turn from happening
			return;
		}


		// check to see if there is already a piece in the target cell
		var allowMove=-1;
		for (i=0;i<pieces.length;i++){
			if (pieces[i].x===newx && pieces[i].y===newy) {
				allowMove=i;
			}
		}
		if (allowMove>-1){
			render();
			$('#log').text("Piece already in target cell");
			return;
		}

		// move the piece if it's allowed
		var allow=legalMove(startx,starty,newx,newy,pieces[movePiece],movePiece);
		if (allow===false){
			return;
		}
		if (movePiece>-1 && allowMove<0){
			if (allow===true){
				pieces[movePiece].x=newx;
				pieces[movePiece].y=newy;
			}
			else if (allow>-1){
				if (allow<movePiece){
					pieces[movePiece-1].x=newx;
					pieces[movePiece-1].y=newy;
				}
				else {
					pieces[movePiece].x=newx;
					pieces[movePiece].y=newy;	
				}
			}

			// check for a winner
			win();
			if (gameOver>0){
				render();
				$('.piece').draggable("disable");
				return;
			}
			else {
				lastPiece=-1;
				turn++;
				$('#log').text(" ");
				if (turn % 2===0){
					$('#log').text("White's Turn");
					$('#turn_icon').css('color','white').text("White's Turn");
				} else {
					$('#log').text("Black's Turn");
					$('#turn_icon').css('color','black').text("Black's Turn");
				}
			}

			render();
		}
	}




});