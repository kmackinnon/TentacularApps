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
	console.log(data);
	Reveal.navigateRight();

	data = {
		first: {
			city: "Calgary",
			prov: "Alberta"
		},
		second: {
			city: "Toronto",
			prov: "Ontario"
		},
		third: {
			city: "Montreal",
			prov: "Quebec"
		}
	}

	var url = 'http://maps.googleapis.com/maps/api/staticmap?format=png&sensor=false&size=640x480&scale=2&maptype=roadmap&style=feature:administrative.country|visibility:off&style=feature:water|visibility:on&style=feature:landscape|color:0x808080&style=feature:administrative.province|element:labels.text.fill|visibility:off&style=feature:administrative|element:labels.text.fill|visibility:off';
	url += '&markers=color:red|label:1|' + encodeURIComponent(data.first.city) + ',' + encodeURIComponent(data.first.prov);
	url += '&markers=color:red|label:2|' + encodeURIComponent(data.second.city) + ',' + encodeURIComponent(data.second.prov);
	url += '&markers=color:red|label:3|' + encodeURIComponent(data.third.city) + ',' + encodeURIComponent(data.third.prov);

	$('#first').text(data.first.city + ', ' + data.first.prov);
	$('#second').text(data.second.city + ', ' + data.second.prov);
	$('#third').text(data.third.city + ', ' + data.third.prov);

	$('#map').attr('src', url);
}