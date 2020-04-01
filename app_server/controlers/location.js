module.exports.homeList = function(req, res, next) {
  res.render('locations-list', { 
  	title: 'Loc8r. Find places to work with wi-fi near you!',
  	sidebar: 'lead Looking fpr wifi and set? Loc8r helps you find placeto work when out with coffe and cake? Let Loc8r help you find place you are looking for.',
  	pageHeader: {
  		title: 'Loc8r',
  		strapline: 'Find places to work with wi-fi near you!',
  		},
  	locations: [{
	  	name: 'Srarcups',
	  	address: '125 Hight Street, Reading, RG6 1PS',
	  	rating: 3,
	  	facilities: ['Hot drinks!', 'Food!', 'Premium wi-fi!'],
	  	distance: '100m'
  		},
  		{
	  	name: 'CooffeStreet',
	  	address: '125 Hight Street, Reading, RG6 1PS',
	  	rating: 5,
	  	facilities: ['Hot drinks!', 'Food!', 'Premium wi-fi!'],
	  	distance: '200m'
  		},
  		{
	  	name: 'City Bar',
	  	address: '125 Hight Street, Reading, RG6 1PS',
	  	rating: 2,
	  	facilities: ['Hot drinks!', 'Food!', 'Premium wi-fi!'],
	  	distance: '50m'
  		},
	]
  	 });
};
module.exports.locationInfo = function(req, res, next) {
  res.render('location-info', { 
  	title: 'Starcups',
  	sideBar: {
  		textLide: 'Starcups is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
  		text: 'If you"ve been and you like it - or if you don"t - please leave a review to help other people just like you.'
  	},
  	location:
  	{
	  	name: 'Starcups',
	  	address: '125 Hight Street, Reading, RG6 1PS',
		  rating: 3,
		  facilities: ['Hot drinks!', 'Food!', 'Premium wi-fi!'],
		  openingtime: [
  	{
  		days:'Monday - Friday',
  		opening: "7:00am",
  		closing: '7:00pm',
  		closed: false
  	},
  	{
  		days: 'Saturday',
  		opening: "8:00am",
  		closing: "5:00pm",
  		closed:false
  	},
  	{
  		days: 'Sunday',
  		closed: true	
  	}],
  	reviews: [
	 {
	 	rating: 5,
	 	autor: 'Simon Holmes',
	 	date: '16 July 2013',
	 	text: 'What a great place. I can"t say enough good things about it.'
	 },
	 {
	 	rating: 3,
	 	autor: 'Charlie Chaplin',
	 	date: '16 July 2013',
	 	text: 'It was okay. Coffee wasn"t great, but the wifi was fast.'
	 },
	 {
	 	rating: 4,
	 	autor: 'Olena Mokhnatska',
	 	date: '12 May 2019',
	 	text: 'What a great place. I can"t say enough good things about it.'
	 }
	]
	},
	
	
  	  	
});
};
module.exports.addReview = function(req, res, next) {
  res.render('location-review-form', { 
  	title: 'Review Starcups on Loc8r',
  	pageHeader: {
  		title: 'Review Starcups on Loc8r'
  	},
  	user: {
  		displayName:  "Olena Mokhnatska"
  	}
  	 });
  	}
      /*{ name: 'Footbar', address: '1 Hight Street, Reading, RG6 1PS', rating: 3, facilities: ['Hot drinks!', 'Food!', 'Premium wi-fi!'],openingtime: [{days:'Monday - Friday',opening: "7:00am",closing: '7:00pm',closed: false},{days: 'Saturday',opening: "8:00am",closing: "5:00pm", closed:false},{days: 'Sunday',closed: true}],reviews: [{rating: 5, autor: 'Simon Holmes',date: '16 July 2013',text: 'What a great place. I can"t say enough good things about it.'},{rating: 3,autor: 'Charlie Chaplin',date: '16 July 2013',text: 'It was okay. Coffee wasn"t great, but the wifi was fast.'},{rating: 4,autor: 'Olena Mokhnatska',date: '12 May 2019',text: 'What a great place. I can"t say enough good things about it.'}]}*/