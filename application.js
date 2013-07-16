// Test to make sure this is injected

$(document).ready(function() {
	console.log('js injected');

	$('.piece').draggable({
		cursor: 'hand',
		containment: ".board"
	});

	$('.board .myrow div').droppable({
		accept: '.piece',
		hoverClass: 'hover',
		drop: function(event, ui) {

			console.log(this);

		var old_square = ui.draggable;
		var new_square = this;
		// var args = [$(old_square).parent().data('coords').row,$(old_square).parent().data('coords').col,
		// 	$(new_square).data('coords').row,$(new_square).data('coords').col];

		// console.log(args);

		},
	});

});