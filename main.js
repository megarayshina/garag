const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.XYZ ({url:'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'})
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([55.57664653143523, 56.433597037676975]),
    zoom: 12.8,
  }),
});

//добавление векторного слоя ГАРАЖИ с геосервера
const garagLay = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: 'http://localhost:8080/geoserver/garag/wms',
    params: {
        'LAYERS': 'garag:garag', 
        'TILED': true,
        'FORMAT': 'image/png'},
    }),
    serverType: 'geoserver',
    visible: true
  });

  //добавление векторного слоя tz с геосервера
const tzLay = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: 'http://localhost:8080/geoserver/garag/wms',
    params: {
        'LAYERS': 'garag:ТЗ_4326', 
        'TILED': true,
        'FORMAT': 'image/png'},
    }),
    serverType: 'geoserver',
    visible: true
  });

//добавление слоев одним массивом
const layers = [tzLay, garagLay];
layers.forEach(function(layer){map.addLayer(layer);});

//включаем чекбокс tz
const checkbox_tz = document.getElementById('tz');
checkbox_tz.addEventListener('change', function(e) {
  tzLay.setVisible(e.target.checked);
});

// отображение координат положения курсора
const mousePositionControl = new ol.control.MousePosition({
  coordinateFormat: ol.coordinate.createStringXY(4),
  projection: 'EPSG:4326',
  target: document.getElementById('mouse-position'),
  });
  map.addControl(mousePositionControl);

// добавление масштабной линейки
const scale = new ol.control.ScaleLine();
map.addControl(scale);

//подключение атрибутов
import {initAttributes} from './attributes.js';
initAttributes(map, garagLay);