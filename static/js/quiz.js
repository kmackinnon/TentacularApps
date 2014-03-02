var responses = {
	priorities: [],
	languages: [],
	emigratingfrom: '',
	population: 0,
	industry: 0,
	income: 0,
	rain: 0,
	transit: 0
}

Reveal.initialize({
	controls: false,
	progress: false,
	keyboard: false
});

$(document).ready(function() {
	$('#backbutton').click(function(e) {
		Reveal.navigateLeft();
	});

	$('#about').click(function() {
		$('#aboutdialog').modal();
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
		$('#language .active a').each(function(index) {
			responses.languages.push($(this).attr('lang'));
		});
	});

	$('#emigratingfrom a').click(function(e) {
		responses.emigratingfrom = $(this).attr('index');
	});

	$('#population a').click(function(e) {
		responses.population = $(this).attr('index');
	});

	$('#industry a').click(function(e) {
		responses.industry = $(this).attr('index');
	});

	$('#rain a').click(function(e) {
		responses.rain = $(this).attr('index');
	});

	$('#transit a').click(function(e) {
		console.log($(this).attr('index'))
		responses.transit = $(this).attr('index');
	});

	$('#budget a').click(function(e) {
		responses.income = $(this).attr('index');

		console.log(responses);
		
		/* AJAX POST request to /quiz */
		$.ajax('/', {
			type: 'POST',
			data: responses,
			success: resultsComputed
		});
	});

	$(document)
		.ajaxStart(function() {
			$('#backbutton').text('Start Again')
			$('#backbutton').attr('disabled', 'disabled');
			$('#backbutton').attr('href', '/');
			$('#backbutton').click(function(e) {});
		})
		.ajaxStop(function() {
			$('#backbutton').removeAttr('disabled');
		});
});

function resultsComputed(data, status, jqXHR) {
	Reveal.navigateRight();

	var url = 'http://maps.googleapis.com/maps/api/staticmap?format=png&sensor=false&size=640x480&scale=2&maptype=roadmap&style=feature:administrative.country|visibility:off&style=feature:water|visibility:on&style=feature:landscape|color:0x808080&style=feature:administrative.province|element:labels.text.fill|visibility:off&style=feature:administrative|element:labels.text.fill|visibility:off';
	url += '&markers=color:red|label:1|' + encodeURIComponent(data.first.city) + ',' + encodeURIComponent(data.first.prov);
	url += '&markers=color:red|label:2|' + encodeURIComponent(data.second.city) + ',' + encodeURIComponent(data.second.prov);
	url += '&markers=color:red|label:3|' + encodeURIComponent(data.third.city) + ',' + encodeURIComponent(data.third.prov);

	$('#first').text(data.first.city + ', ' + data.first.prov);
	$('#second').text(data.second.city + ', ' + data.second.prov);
	$('#third').text(data.third.city + ', ' + data.third.prov);

	$('#map').attr('src', url);
}
