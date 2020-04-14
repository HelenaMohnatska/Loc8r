const request = require('request');
let apiOptions = {
  server: "http://localhost:3000"
};
if(process.env.NODE_ENV === 'production'){
  apiOptions.server = 'https://whispering-thicket-40617.herokuapp.com/';
}



const renderHomepage =  function(req, res, responseBody) {
  let message;
  if (!( responseBody instanceof Array)) {
    message = "api lookup error";
    responseBody = [];
  } else {
    if(!responseBody.length) {
      message = "no places found nearby";
    }
  }
  
  res.render('locations-list', { 
    message: message,
    title: 'Loc8r. Find places to work with wi-fi near you!',
    sidebar: 'lead Looking fpr wifi and set? Loc8r helps you find placeto work when out with coffe and cake? Let Loc8r help you find place you are looking for.',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wi-fi near you!',
      },
    locations: responseBody
    
})

}

module.exports.homeList = function(req, res) {
  const path = '/api/locations';
  let requestOptionals = {
    url: apiOptions.server + path,
    method: "GET",
    json: {},
    qs: {
      lng: 2.1566,
      lat: 7.0247,
      maxDistance: 20
    }
  };
  
  request(requestOptionals, function(err, response, body) {
    let data = body;
    if(response.statusCode === 200 && data.length){
      for(let i = 0; i < data.length;i++) {
        data[i].distance = _formatDistance(data[i].distance);
      }

    renderHomepage(req, res, data);  
    }  else {
      _showError(req, res, response.statusCode);
    }
  })
  
 };

const _formatDistance = function(distance) {
  if(distance && typeof(distance) === 'number') {
    let numDistance, unit;
    if(distance > 1) {
      numDistance = parseFloat(distance).toFixed(1);
      unit = 'km';
    } else {
      numDistance = parseInt(distance *1000, 10);
      unit = 'm'
    }
    return numDistance +' '+ unit;
  } else {
    throw new Error ("distance is not a number or distance is empty");
  }
}

const renderDetailPage = function (req, res, locDetail) {

    res.render('location-info', { 
    title: locDetail.name,
    sideBar: {
      textLide: 'Starcups is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      text: 'If you"ve been and you like it - or if you don"t - please leave a review to help other people just like you.'
    },
    location: locDetail
});
}

module.exports.locationInfo = function(req, res) {

  const path = '/api/locations/'+req.params.locationid;
  let requestOptionals = {
    url: apiOptions.server + path,
    method: "GET",
    json: {},
    
  };
  request(requestOptionals, (err, response, body)=> {
    let data = body;
    if(response.statusCode === 200){    
    data.coords = {
      lng: body.coords[0],
      lat: body.coords[1]
    }
    renderDetailPage(req, res, data);
    } else {
      _showError(req, res, response.statusCode);
    }

  })
   
};

const _showError = function (req, res, status) {
  let title, content;
  if(status === 404) {
    title = "404, page not found";
    content = "Oh, dear. Looks like we cant find page, sorry" 
  } else {
    title = status + " something is gone wrong";
    content = " something somewhere, has gone a little bit wrong "
  }
  res.status(status);
  res.render('generic-text', {
    title: title,
    content: content
  })
}
module.exports.doAddReview = function (req, res) {
  /*method post page Add review*/
  const locationId = req.params.locationid;
  const path = '/api/locations/' + locationId + '/reviews';
  const formObject = {
      author: req.body.name,
      rating: parseInt(req.body.rating, 10),
      textReview: req.body.review
  }
  let requestOptionals = {
    url: apiOptions.server + path,
    method: "POST",
    json: formObject
    
  };
  if(!formObject.author || !formObject.rating || !formObject.textReview) {
    res.redirect('/location/' + locationId + '/review/new?err=val');
    return;
  }
  request(requestOptionals, (err, response, body)=> {
      if(response.statusCode === 201) {
          res.redirect('/location/'+locationId);
      } else if(response.statusCode === 400 && body.name && body.name
        === 'ValidationError') {
        console.log(body);
        res.redirect('/location/' + locationId + '/review/new?err=val')
      }
       else {
      _showError(req, res, response.statusCode);
    }
  })
};


const renderReviewForm = function(req, res, resData) {
  console.log(req.query.err);
  res.render('location-review-form', { 
    title: 'Review '+resData.name+' on Loc8r',
    error: req.query.err,
    pageHeader: {
      title: 'Review '+resData.name+' on Loc8r'
          },
    user: {
      displayName:  "Olena Mokhnatska"
    }
     });
} 

module.exports.addReview = function(req, res, resData) {
  /*method get page Add review*/
  const path = '/api/locations/'+req.params.locationid;
  let requestOptionals = {
    url: apiOptions.server + path,
    method: "GET",
    json: {},
};
  request(requestOptionals, (err, response, body)=> {
    let data = body;
    if(response.statusCode === 200){    
    data.coords = {
      lng: body.coords[0],
      lat: body.coords[1]
    }
    renderReviewForm(req, res, data);
    } else {
      _showError(req, res, response.statusCode);
    }

  })
  
}
      /*{ name: 'Lake', address: '1 Hight Street, Reading, RG6 1PS', rating: 3, facilities: ['Hot drinks!', 'Food!', 'Premium wi-fi!'], "coords" : [ 41.40338, 2.17403 ],openingtime: [{days:'Monday - Friday',opening: "7:00am",closing: '7:00pm',closed: false},{days: 'Saturday',opening: "8:00am",closing: "5:00pm", closed:false},{days: 'Sunday',closed: true}],reviews: [{rating: 5, autor: 'Simon Holmes',date: '16 July 2013',text: 'What a great place. I can"t say enough good things about it.'},{rating: 3,autor: 'Charlie Chaplin',date: '16 July 2013',text: 'It was okay. Coffee wasn"t great, but the wifi was fast.'},{rating: 4,autor: 'Olena Mokhnatska',date: '12 May 2019',text: 'What a great place. I can"t say enough good things about it.'}]}*/