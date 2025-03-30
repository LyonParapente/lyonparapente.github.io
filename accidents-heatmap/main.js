
var heatmapData = {
  data: []
};
for (const [key, value] of Object.entries(accidents)) {
  heatmapData.data.push({lat: value.latitude, lng: value.longitude})
}

var heatmapLayer = new HeatmapOverlay({
  radius: 20,
  maxOpacity: .8,
  scaleRadius: false,
  // if set to false the heatmap uses the global maximum for colorization
  // if activated: uses the data maximum within the current map boundaries
  //   (there will always be a red spot with useLocalExtremas true)
  useLocalExtrema: true,
  // which field name in your data represents the latitude - default "lat"
  latField: 'lat',
  // which field name in your data represents the longitude - default "lng"
  lngField: 'lng',
  // which field name in your data represents the data value - default "value"
  valueField: 'count'
});

heatmapLayer.setData(heatmapData);





var openstreetmap = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
{
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> | <a href="//openstreetmap.fr">OSM France</a>'
});
var opentopomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
{
  attribution: '&copy; <a href="https://www.openstreetmap.org>/copyright">OpenStreetMap</a> | <a href="http://viewfinderpanoramas.org">SRTM</a> | &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
});

var tileLayers =
{
  "OpenStreetMap": openstreetmap,
  "OpenTopoMap": opentopomap
};

var map = L.map('map',
{
  center: new L.LatLng(45.3945, 6.0752),
  zoom: 10,
  layers: [opentopomap, heatmapLayer]
});
map.zoomControl.setPosition('topright');
L.control.scale().addTo(map);
L.control.layers(tileLayers)
  .setPosition('bottomright')
  .addTo(map);


function HandleFilterChange (e)
{
  var gliders_filter = [];
  if (document.getElementById('filter-glider-a').checked) {gliders_filter.push("EN_A")}
  if (document.getElementById('filter-glider-b').checked) {gliders_filter.push("EN_B")}
  if (document.getElementById('filter-glider-c').checked) {gliders_filter.push("EN_C")}
  if (document.getElementById('filter-glider-d').checked) {gliders_filter.push("EN_D")}
  if (document.getElementById('filter-glider-ccc').checked) {gliders_filter.push("CCC")}
  var blessures_filter = [];
  if (document.getElementById('filter-blessures-indemne').checked) {blessures_filter.push("INDEMNE")}
  if (document.getElementById('filter-blessures-legeres').checked) {blessures_filter.push("LEGERES")}
  if (document.getElementById('filter-blessures-graves').checked) {blessures_filter.push("GRAVES")}
  if (document.getElementById('filter-blessures-deces').checked) {blessures_filter.push("DECES")}
  var horaires_filter = [];
  if (document.getElementById('filter-horaire-matin').checked) {horaires_filter.push("matin")}
  if (document.getElementById('filter-horaire-midi').checked) {horaires_filter.push("midi")}
  if (document.getElementById('filter-horaire-apresmidi').checked) {horaires_filter.push("apresmidi")}

  var heatmapData = {
    data: []
  };
  for (const [key, value] of Object.entries(accidents)) {
    if (gliders_filter.includes(value.AC_parapente_classe) &&
      blessures_filter.includes(value.AC_blessures_pilote))
    {
      var d = new Date(value.AC_date_heure);
      var hour = d.getHours();
      var horaire = hour < 11 ? 'matin' : (hour < 15 ? 'midi' : 'apresmidi');
      if (horaires_filter.includes(horaire))
      {
        heatmapData.data.push({lat: value.latitude, lng: value.longitude})
      }
    }
  }
  heatmapLayer.setData(heatmapData);
}

L.Control.FiltersControl = L.Control.extend({
  onAdd: function (map) {
    var div = document.getElementById('filters');
    div.ondblclick = L.DomEvent.stopPropagation;
    L.DomEvent.on(div, 'change', HandleFilterChange);
    return div;
  },

  onRemove: function(map) {
    var div = document.getElementById('filters');
    div.parentElement.removeChild(div);
  }
});
L.control.filters = function(opts) {
  return new L.Control.FiltersControl(opts);
}
L.control.filters({position: 'topleft'}).addTo(map);
