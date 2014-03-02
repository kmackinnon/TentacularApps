function resultsComputed(data, status, jqXHR) {
	
}

var responses = {
	priorities: [],
	languages: [],
	emigratingfrom: '',
	nightlife: false,
	industry: 0,
	temp: 0,
	budget: 0,
	rain: 0,
	transit: 0
}

Reveal.initialize({
	controls: false,
	progress: false
});

$(document).ready(function() {
	$('#backbutton').click(function(e) {
		Reveal.navigateLeft();
	});

	/* Select/deselect toggle-item's */
	$('.toggle-item').click(function(e) {
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
		} else {
			$(this).addClass('active');
		}
	});

	$('.list-group.single-select .list-group-item').click(function(e) {
		$('.list-group.single-select .list-group-item.active').removeClass('active')
		$(this).addClass('active');
	});

	/*
		1: Employment
		2: Climate
		3: Culture
		4: Lifestyle
	*/
	$('.hoverimage').click(function(e) {
		if (!$(this).hasClass('selected')) {
			var newLen = responses.priorities.push($(this).attr('index'));

			$(this).attr('rank', newLen);
			$(this).addClass('selected');

			if (responses.priorities.length == 4)
				Reveal.navigateRight();
		} else {
			/* TODO: uncheck */
			var index = responses.priorities.indexOf($(this).attr('index'));
			responses.priorities.splice(index, 1);

			for (var i = index; i < responses.priorities.length; i++) {
				$('[index=' + responses.priorities[i] + ']').attr('rank', i + 1)
			}

			$(this).removeClass('selected');
			$(this).removeAttr('rank');
		}
	});

	$('#language .navigate-right').click(function(e) {
		$('#language .active').each(function(index) {
			responses.languages.push(this.lang);
		});
	});

	$('#emigratingfrom a').click(function(e) {
		responses.emigratingfrom = $(this).attr('index');
	});

	$('#nightlife a').click(function(e) {
		responses.nightlife = $(this).attr('index');
	});

	$('#industry a').click(function(e) {
		responses.industry = $(this).attr('index');
	});

	$('#temp a').click(function(e) {
		responses.temp = $(this).attr('index');
	});

	$('#rain a').click(function(e) {
		responses.rain = $(this).attr('index');
	});

	$('#transit a').click(function(e) {
		responses.transit = $(this).attr('index');
	});

	$('#budget a').click(function(e) {
		responses.budget = $(this).attr('index');
		
		console.log(responses)
		console.log(encodeURIComponent(JSON.stringify(responses)))
		
		/* AJAX POST request to /quiz */
		$.ajax('/', {
			type: 'POST',
			data: responses,
			success: resultsComputed
		});
	});
});