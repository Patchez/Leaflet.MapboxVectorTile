var debug = {};

var featureCount = 0;

var styleRef = "styleCICO";

var map = L.map('map').setView([21, 80], 5); // India

L.tileLayer('http://{s}.tiles.mapbox.com/v3/spatialdev.map-c9z2cyef/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'examples.map-i86knfo3'
}).addTo(map);


var pbfSource = new L.TileLayer.MVTSource({
  url: "http://spatialserver.spatialdev.com/services/postgis/cicos_2014/geom/vector-tiles/{z}/{x}/{y}.pbf?fields=type,id",
  debug: false,
  clickableLayers: null,

  getIDForLayerFeature: function(feature) {
    // console.log(feature.properties.id);
    return feature.properties.id;
  },

  /**
   * The filter function gets called when iterating though each vector tile feature (vtf). You have access
   * to every property associated with a given feature (the feature, and the layer). You can also filter
   * based of the context (each tile that the feature is drawn onto).
   *
   * Returning false skips over the feature and it is not drawn.
   *
   * @param feature
   * @returns {boolean}
   */
  filter: function(feature, context) {
    //return feature.properties.type != 'Mobile Money Agent';
    return true;
  },

  /**
   * When we want to link events between layers, like clicking on a label and a
   * corresponding polygon freature, this will return the corresponding mapping
   * between layers. This provides knowledge of which other feature a given feature
   * is linked to.
   *
   * @param layerName  the layer we want to know the linked layer from
   * @returns {string} returns corresponding linked layer
   */
  layerLink: function(layerName) {
    if (layerName.indexOf('_label') > -1) {
      return layerName.replace('_label', '');
    }
    return layerName + '_label';
  },

  /**
   * Specify which features should have a certain z index (integer).  Lower numbers will draw on 'the bottom'.
   *
   * @param feature - the PBFFeature that contains properties
   */
  layerOrdering: function(feature) {
    //This only needs to be done for each type, not necessarily for each feature. But we'll start here.
    if (feature && feature.properties) {
      feature.properties.zIndex = CICO_LAYERS[feature.properties.type].zIndex || 5;
    }
  },

  style: function(feature) {
    var style = {};
    var selected = style.selected = {};
    var pointRadius = 1;

    function ScaleDependentPointRadius(zoom) {
      //Set point radius based on zoom
      var pointRadius = 2;
      if (zoom >= 0 && zoom <= 7) {
        pointRadius = 1;
      }
      else if (zoom > 7 && zoom <= 10) {
        pointRadius = 2;
      }
      else if (zoom > 10) {
        pointRadius = 3;
      }

      return pointRadius;
    }

    var type = feature.type;
    switch (type) {
      case 1: //'Point'
        // unselected
        // console.log(CICO_LAYERS[feature.properties.type].color);
        style.color = CICO_LAYERS[feature.properties.type].color || '#808080';
        style.radius = ScaleDependentPointRadius;
        // selected
        style.selected = {
          color: 'rgba(0,255,255,0.5)',
          radius: 6
        };
        break;
      case 2: //'LineString'
        // unselected
        style.color = 'rgba(161,217,155,0.8)';
        style.size = 3;
        // selected
        style.selected = {
          color: 'rgba(0,255,255,0.5)',
          size: 6
        };
        break;
      case 3: //'Polygon'
        // unselected
        style.color = 'rgba(149,139,255,0.4)';
        style.outline = {
          color: 'rgb(20,20,20)',
          size: 2
        };
        // selected
        style.selected = {
          color: 'rgba(255,255,0,0.5)',
          outline: {
            color: '#00ffff',
            size: 3
          }
        };

    }

    return style;
  },

  onClick: function(evt) {
    // TODO: handle off-feature click.  evt.feature.properties == undefined
    console.log(evt.feature.properties);
    console.log(evt);
    // content = JSON.stringify(evt.feature.properties)
    content = evt.feature.properties;
    console.log(content)
    var popup = L.popup();
    popup.setLatLng(evt.latlng);
    // popup.setContent(evt.feature.properties);
    popup.setContent('<p> ID: ' + content.id + '<br /> Type: ' + content.type + '</p>')
    popup.openOn(map);
  }

});

debug.mvtSource = pbfSource;

var styleButton = document.getElementById('styleButton');
styleButton.addEventListener('click', function(evt){
  console.log(styleRef);
  if (styleRef == "styleCICO"){
    pbfSource.setStyle(style1904);
    styleRef = "style1904"
  } else {
    pbfSource.setStyle(styleCICO);
    styleRef = "styleCICO"
  }
});

//Add layer
map.addLayer(pbfSource);

console.log(pbfSource);

var CICO_LAYERS = {
  'Offsite ATMs': {
    color: '#3086AB',
    infoLabel: 'Offsite ATM',
    providers: null,
    zIndex: 6
  },
  'Bank Branches': {
    color: '#977C00',
    infoLabel: 'Bank Branch',
    providers: null,
    zIndex: 5
  },
  'MFIs': {
    color: '#9B242D',
    infoLabel: 'MFI',
    providers: null,
    zIndex: 7
  },
  'SACCOs': {
    color: '#cf8a57',
    infoLabel: 'SACCO',
    providers: null,
    zIndex: 10
  },
  'Mobile Money Agent': {
    color: '#8CB7C7',
    infoLabel: 'Mobile Money Agent',
    providers: null,
    zIndex: -1
  },
  'MDIs': {
    color: '#825D99',
    infoLabel: 'MDI',
    providers: null,
    zIndex: 6
  },
  'Credit Institution': {
    color: '#6CA76B',
    infoLabel: 'Credit Institution',
    providers: null,
    zIndex: 5
  },
  'MFBs': {
    color: '#825D99',
    infoLabel: 'MFB',
    providers: null,
    zIndex: 7
  },
  'Motor Parks': {
    color: '#bd85b3',
    infoLabel: 'Motor Parks',
    providers: null,
    zIndex: 7
  },
  'Mobile Network Operator Outlets': {
    color: '#a2a2a2',
    infoLabel: 'Mobile Network Operator Outlets',
    providers: null,
    zIndex: 0
  },
  'Post Offices': {
    color: '#FFFF00',
    infoLabel: 'Post Offices',
    providers: null,
    zIndex: 4
  },
  'Post Office': {
    color: '#80ad7b',
    infoLabel: 'Post Offices',
    providers: null,
    zIndex: 6
  },
  'Bus Stand': {
    color: '#80ad7b',
    infoLabel: 'Bus Stands',
    providers: null,
    zIndex: 6
  },
  'Bus Stands': {
    color: '#80ad7b',
    infoLabel: 'Bus Stands',
    providers: null,
    zIndex: 6
  },

  //Kenya
  'Insurance Providers': {
    color: '#3086AB',
    infoLabel: 'Insurance providers',
    providers: null,
    zIndex: 6
  },
  'Money Transfer Service': {
    color: '#977C00',
    infoLabel: 'Money Transfer Service',
    providers: null,
    zIndex: 6
  },
  'Dev Finance': {
    color: '#9B242D',
    infoLabel: 'Dev Finance',
    providers: null,
    zIndex: 6
  },
  'Forex Bureaus': {
    color: '#cf8a57',
    infoLabel: 'Forex Bureaus',
    providers: null,
    zIndex: 6
  },
  'Cap Markets': {
    color: '#825D99',
    infoLabel: 'Cap Markets',
    providers: null,
    zIndex: 6
  },
  'Pension Providers': {
    color: '#a2a2a2',
    infoLabel: 'Pension providers',
    providers: null,
    zIndex: 6
  },
  'Purchase Lease Factoring': {
    color: '#80ad7b',
    infoLabel: 'Purchase Lease Factoring',
    providers: null,
    zIndex: 6
  },
  'Bank Agent': {
    color: '#80ad7b',
    infoLabel: 'Bank Agent',
    providers: null,
    zIndex: 6
  },
  'Bank and Mortgage': {
    color: '#80ad7b',
    infoLabel: 'Banks and Mortgage',
    providers: null,
    zIndex: 6
  },
  'Commercial Bank': {
    color: '#80ad7b',
    infoLabel: 'Commercial Bank',
    providers: null,
    zIndex: 3
  },

  'PostBank': {
    color: '#bd85b3',
    infoLabel: 'Post Bank',
    providers: null,
    zIndex: 6
  },

  //Nigeria New Post Offices
  'NIPOST Post Office': {
    color: '#80ad7b',
    infoLabel: 'NIPOST Post Offices',
    providers: null,
    zIndex: 6
  },
  'NIPOST Post Shop': {
    color: '#80ad7b',
    infoLabel: 'NIPOST Post Shops',
    providers: null,
    zIndex: 6
  },
  'NIPOST Postal Agency': {
    color: '#80ad7b',
    infoLabel: 'NIPOST Postal Agencies',
    providers: null,
    zIndex: 6
  },

  //India
  'Postal Outlets': {
    color: '#E6DC00',
    infoLabel: 'Postal Outlets',
    providers: null,
    zIndex: 3
  },
  'Commercial Banks': {
    color: '#80ad7b',
    infoLabel: 'Commercial Banks',
    providers: null,
    zIndex: 2
  },
  'Bank Customer Service Points': {
    color: '#977C00',
    infoLabel: 'Bank Customer Service Points',
    providers: null,
    zIndex: 4
  }
};
var OffsiteATMs = {
  'Offsite ATMs': {
    color: '#ff0000',
    infoLabel: 'Offsite ATM',
    providers: null,
    zIndex: 6
  },
  'Bank Branches': {
    color: '#808080',
    infoLabel: 'Bank Branch',
    providers: null,
    zIndex: 5
  },
  'MFIs': {
    color: '#808080',
    infoLabel: 'MFI',
    providers: null,
    zIndex: 7
  },
  'SACCOs': {
    color: '#808080',
    infoLabel: 'SACCO',
    providers: null,
    zIndex: 10
  },
  'Mobile Money Agent': {
    color: '#808080',
    infoLabel: 'Mobile Money Agent',
    providers: null,
    zIndex: -1
  },
  'MDIs': {
    color: '#808080',
    infoLabel: 'MDI',
    providers: null,
    zIndex: 6
  },
  'Credit Institution': {
    color: '#808080',
    infoLabel: 'Credit Institution',
    providers: null,
    zIndex: 5
  },
  'MFBs': {
    color: '#808080',
    infoLabel: 'MFB',
    providers: null,
    zIndex: 7
  },
  'Motor Parks': {
    color: '#808080',
    infoLabel: 'Motor Parks',
    providers: null,
    zIndex: 7
  },
  'Mobile Network Operator Outlets': {
    color: '#808080',
    infoLabel: 'Mobile Network Operator Outlets',
    providers: null,
    zIndex: 0
  },
  'Post Offices': {
    color: '#808080',
    infoLabel: 'Post Offices',
    providers: null,
    zIndex: 4
  },
  'Post Office': {
    color: '#808080',
    infoLabel: 'Post Offices',
    providers: null,
    zIndex: 6
  },
  'Bus Stand': {
    color: '#808080',
    infoLabel: 'Bus Stands',
    providers: null,
    zIndex: 6
  },
  'Bus Stands': {
    color: '#808080',
    infoLabel: 'Bus Stands',
    providers: null,
    zIndex: 6
  },

  //Kenya
  'Insurance Providers': {
    color: '#808080',
    infoLabel: 'Insurance providers',
    providers: null,
    zIndex: 6
  },
  'Money Transfer Service': {
    color: '#808080',
    infoLabel: 'Money Transfer Service',
    providers: null,
    zIndex: 6
  },
  'Dev Finance': {
    color: '#808080',
    infoLabel: 'Dev Finance',
    providers: null,
    zIndex: 6
  },
  'Forex Bureaus': {
    color: '#808080',
    infoLabel: 'Forex Bureaus',
    providers: null,
    zIndex: 6
  },
  'Cap Markets': {
    color: '#808080',
    infoLabel: 'Cap Markets',
    providers: null,
    zIndex: 6
  },
  'Pension Providers': {
    color: '#808080',
    infoLabel: 'Pension providers',
    providers: null,
    zIndex: 6
  },
  'Purchase Lease Factoring': {
    color: '#808080',
    infoLabel: 'Purchase Lease Factoring',
    providers: null,
    zIndex: 6
  },
  'Bank Agent': {
    color: '#808080',
    infoLabel: 'Bank Agent',
    providers: null,
    zIndex: 6
  },
  'Bank and Mortgage': {
    color: '#808080',
    infoLabel: 'Banks and Mortgage',
    providers: null,
    zIndex: 6
  },
  'Commercial Bank': {
    color: '#808080',
    infoLabel: 'Commercial Bank',
    providers: null,
    zIndex: 3
  },

  'PostBank': {
    color: '#808080',
    infoLabel: 'Post Bank',
    providers: null,
    zIndex: 6
  },

  //Nigeria New Post Offices
  'NIPOST Post Office': {
    color: '#808080',
    infoLabel: 'NIPOST Post Offices',
    providers: null,
    zIndex: 6
  },
  'NIPOST Post Shop': {
    color: '#808080',
    infoLabel: 'NIPOST Post Shops',
    providers: null,
    zIndex: 6
  },
  'NIPOST Postal Agency': {
    color: '#808080',
    infoLabel: 'NIPOST Postal Agencies',
    providers: null,
    zIndex: 6
  },

  //India
  'Postal Outlets': {
    color: '#808080',
    infoLabel: 'Postal Outlets',
    providers: null,
    zIndex: 3
  },
  'Commercial Banks': {
    color: '#808080',
    infoLabel: 'Commercial Banks',
    providers: null,
    zIndex: 2
  },
  'Bank Customer Service Points': {
    color: '#808080',
    infoLabel: 'Bank Customer Service Points',
    providers: null,
    zIndex: 4
  }
};

var styleCICO = function(feature) {
  var style = {};
  var selected = style.selected = {};
  var pointRadius = 1;

  function ScaleDependentPointRadius(zoom) {
    //Set point radius based on zoom
    var pointRadius = 1;
    if (zoom >= 0 && zoom <= 7) {
      pointRadius = 1;
    }
    else if (zoom > 7 && zoom <= 10) {
      pointRadius = 2;
    }
    else if (zoom > 10) {
      pointRadius = 3;
    }

    return pointRadius;
  }

  var type = feature.type;
  switch (type) {
    case 1: //'Point'
      // unselected
      // console.log(CICO_LAYERS[feature.properties.type].color);
      style.color = CICO_LAYERS[feature.properties.type].color || '#808080';
      style.radius = ScaleDependentPointRadius;
      // selected
      style.selected = {
        color: 'rgba(0,255,255,0.5)',
        radius: 6
      };
      break;
    case 2: //'LineString'
      // unselected
      style.color = 'rgba(161,217,155,0.8)';
      style.size = 3;
      // selected
      style.selected = {
        color: 'rgba(0,255,255,0.5)',
        size: 6
      };
      break;
    case 3: //'Polygon'
      // unselected
      style.color = 'rgba(149,139,255,0.4)';
      style.outline = {
        color: 'rgb(20,20,20)',
        size: 2
      };
      // selected
      style.selected = {
        color: 'rgba(255,255,0,0.5)',
        outline: {
          color: '#d9534f',
          size: 3
        }
      };

  }

  return style;
};

var style1904 = function(feature) {
  var style = {};
  var selected = style.selected = {};
  var pointRadius = 1;

  function ScaleDependentPointRadius(zoom) {
    //Set point radius based on zoom
    var pointRadius = 1;
    if (zoom >= 0 && zoom <= 7) {
      pointRadius = 1;
    }
    else if (zoom > 7 && zoom <= 10) {
      pointRadius = 2;
    }
    else if (zoom > 10) {
      pointRadius = 3;
    }

    return pointRadius;
  }

  var type = feature.type;
  switch (type) {
    case 1: //'Point'
      // unselected
      style.color = OffsiteATMs[feature.properties.type].color || '#3086AB';
      style.radius = ScaleDependentPointRadius;
      // selected
      style.selected = {
        color: 'rgba(0,255,255,0.5)',
        radius: 6
      };
      break;
    case 2: //'LineString'
      // unselected
      style.color = 'rgba(161,217,155,0.8)';
      style.size = 3;
      // selected
      style.selected = {
        color: 'rgba(0,255,255,0.5)',
        size: 6
      };
      break;
    case 3: //'Polygon'
      // unselected
      style.color = 'rgba(149,139,255,0.4)';
      style.outline = {
        color: 'rgb(20,20,20)',
        size: 2
      };
      // selected
      style.selected = {
        color: 'rgba(255,255,0,0.5)',
        outline: {
          color: '#d9534f',
          size: 3
        }
      };

  }

  return style;
};
