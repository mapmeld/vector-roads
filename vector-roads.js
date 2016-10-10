// Generic Leaflet setup
var map = L.map('map').setView([40.7615876,-73.9520119], 16);
map.attributionControl.setPrefix('');

new L.Hash(map);

// pass these values
L.drawnLayer('5Vy5RHT', 'roads', function(geojson, canvasctx) {
  geojson.features.map(function(feature) {
    var hidden = ['path', 'rail'];
    if (feature.properties.name && hidden.indexOf(feature.properties.kind) === -1) {
      CustomDrawFunction(feature, canvasctx);
    }
  });
}).addTo(map);

function distance(p1, p2) {
  return Math.pow(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2), 0.5);
}

function CustomDrawFunction(feature, canvasctx) {
  var coords = feature.geometry.coordinates;
  canvasctx.strokeStyle = '#000';
  var lastDrawnPoint = null;
  var lastDrawnDistance = 0;
  var p1 = coords[0];
  var p2;
  for (var pt = 1; pt < coords.length; pt+=2) {
    p2 = coords[pt];
    if (!lastDrawnPoint || distance(lastDrawnPoint, p1) > lastDrawnDistance) {
      lastDrawnPoint = p1;
      lastDrawnDistance = canvasctx.measureText(feature.properties.name).width;
    }
    drawLabel(canvasctx, feature.properties.name, p1, p2);
    p1 = p2;
  }
}

// via http://stackoverflow.com/questions/5068216/placing-text-label-along-a-line-on-a-canvas
function drawLabel( ctx, text, p1, p2, alignment, padding ){
  if (!alignment) alignment = 'center';
  if (!padding) padding = 0;

  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  var p, pad;
  if (alignment=='center'){
    p = p1;
    pad = 1/2;
  } else {
    var left = alignment=='left';
    p = left ? p1 : p2;
    pad = padding / Math.sqrt(dx*dx+dy*dy) * (left ? 1 : -1);
  }

  ctx.save();
  ctx.textAlign = alignment;
  ctx.translate(p.x+dx*pad,p.y+dy*pad);
  ctx.rotate(Math.atan2(dy,dx));
  ctx.fillText(text,0,0);
  ctx.restore();
}
