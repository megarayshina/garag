export function initAttributes(map, wmsLayer) {
    // Создаём overlay для popup
    var popup = new ol.Overlay({
        element: document.getElementById('popup'),
        autoPan: true
    });
    map.addOverlay(popup);

    // Обработчик клика по карте
    map.on('singleclick', function(evt) {
        // Получаем URL для запроса GetFeatureInfo
        var url = wmsLayer.getSource().getFeatureInfoUrl(
            evt.coordinate,
            map.getView().getResolution(),
            'EPSG:3857',
            { INFO_FORMAT: 'application/json' }
        );

        if (!url) return;

        // Отправка запроса на сервер
        fetch(url)
            .then(function(response) { return response.json(); })
            .then(function(data) {
                if (!data.features || data.features.length === 0) return;

                // Формируем HTML таблицу атрибутов
                var props = data.features[0].properties;
                var html = "<table>";
                for (var k in props) {
                    if (k === "geom") continue; // пропускаем геометрию
                    html += "<tr><td><b>" + k + "</b></td><td>" + props[k] + "</td></tr>";
                }
                html += "</table>";

                // Вставляем содержимое в popup и показываем его
                document.getElementById('popup-content').innerHTML = html;
                popup.setPosition(evt.coordinate);
            });
    });
}
