//Leaflet images config:
L.Icon.Default.imagePath = './scripts/images'

$("#searchclear").click(function(){
    $("#searchinput").val('');
});


var map = L.map('map').setView([-27.29368, 134.12109], 4);

var hereMaps = L.tileLayer.provider('HERE.terrainDay', {
    app_id: '0wCRmjJq9GwLTuaWPCao',
    app_code: 'bhOAcQk5lyWeAvuleaUyjg'
}).addTo(map);

var url =
'http://gnaf.agl.pw/geoserver/ows?'

$('#searchbox .typeahead').autocomplete({

  // How many charaters before we fire the 'source' function?
  minLength: 1,

  // Given a request string, do something to figure out what
  // a good set of options would be, and call the reponse function
  // with those options as an argument.
  source: addressSource,

  // Given a selection event, do something with the
  // ui element that was clicked on.
  select: addressAction

});

var marker = null;

function addressAction(ui, data) {
	var feature = data.item.feature;
	var lon = feature.geometry.coordinates[0],
		lat = feature.geometry.coordinates[1];
	map.setView([lat, lon],12)
	if(marker) {
		map.removeLayer(marker);
	}
	marker = L.marker([lat, lon]).addTo(map);
	marker.bindPopup(feature.properties.address).openPopup();
}

function addressSource( requestString, responseFunc ) {

  // Strip crazy (non-alpha) characters from the input string.
  var querystr = requestString.term.replace(/[^0-9a-zA-Z ]/g, "");

  // If there's nothing left after stripping, just return null.
  if ( querystr.length == 0 ) {
    response([]);
    return;
  }

  // Form the input parameters into a standard viewparams
  // object string.
  var viewParamsStr = viewparamsToStr({
    query: querystr
  });

  // Set up the parameters for our WFS call to the address_autocomplete
  // web service.
  var wfsParams = {
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeName: 'gnaf:address_search',
    outputFormat: 'application/json',
    srsname: 'EPSG:4326',
    viewparams: viewParamsStr
  };

  // Call the WFS web service, and call the response on completion
  $.ajax({
    url: url,
    data: wfsParams,
    type: "GET",
    dataType: "json",

    // What to do once the HTTL call is complete?
    success: function(data, status, xhr) {

      var arr = [];
      for (var i = data.features.length - 1; i >= 0; i--) {
      	var f = data.features[i];
      	arr.push({
          label: f.properties.address,
          value: f.properties.address,
          feature: f
        }); 
      }

      responseFunc(arr);
    }

  });

};

function viewparamsToStr(obj) {
  var str = '';
  $.each(obj, function(k,v) {
    str.length && (str += ';');
    str += k + ':' + v;
  });
  return str;
};