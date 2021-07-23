//var map = L.map('rev_map').setView([53.34009, 22.96185], 8, layers: [base]);

var base = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW5va2VzaCIsImEiOiJja29vOTV2dHkwOTJ0MnBvNWRrdTVkcmc3In0.29EcVcr8uQ1bL_-4j9SWmg', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
})

var map = L.map('rev_map', {
    center: [53.34009, 22.96185],
    zoom: 8,
    layers: [base]
});

var socialLayer = L.geoJSON().addTo(map),
    environmentalLayer = L.geoJSON().addTo(map),
    economicLayer = L.geoJSON().addTo(map),
    spatialLayer = L.geoJSON().addTo(map),
    technicalLayer = L.geoJSON().addTo(map);

var overlayMaps = {
    "Sfera społeczna": socialLayer,
    "Sfera środowiskowa": environmentalLayer,
    "Sfera gospodarcza": economicLayer,
    "Sfera przestrzenno-funkcjonalna": spatialLayer,
    "Sfera techniczna": technicalLayer,
};
var layersControl = L.control.layers(null, overlayMaps, { collapsed: false }).addTo(map);

layersControl.setPosition('topleft');


var RevIcon = L.Icon.extend({
    options: {
        iconSize: [65, 65],
        iconAnchor: [30, 65],
        popupAnchor: [-3, -76]
    }
});

var socialIcon = new RevIcon({ iconUrl: 'https://rewitalizacja.wrotapodlasia.pl/resource/image/154/1175/106/200/0x0.png' }),
    environmentIcon = new RevIcon({ iconUrl: 'https://rewitalizacja.wrotapodlasia.pl/resource/image/154/1175/106/176/0x0.png' }),
    economicIcon = new RevIcon({ iconUrl: 'https://rewitalizacja.wrotapodlasia.pl/resource/image/154/1175/106/199/0x0.png' }),
    spatialIcon = new RevIcon({ iconUrl: 'https://rewitalizacja.wrotapodlasia.pl/resource/image/154/1175/106/179/0x0.png' }),
    technicalIcon = new RevIcon({ iconUrl: 'https://rewitalizacja.wrotapodlasia.pl/resource/image/154/1175/106/203/0x0.png' });

function zoomToFeature(e) {

    if (e.target._bounds) {
        map.fitBounds(e.target.getBounds());
    } else {
        map.setView(e.latlng, 16);
    };
    var layer = e.target;
    info.update(layer.feature.properties);

};

function highlightFeature(e) {
    var layer = e.target;
    info.update(layer.feature.properties);
};

function resetHighlight(e) {

    info.update();
};

function onEachFeature(feature, layer) {
    layer.on({
        //mouseover: highlightFeature,
        //mouseout: resetHighlight,
        click: zoomToFeature,
    });
    switch (feature.properties.sphere) {
        case 'social': return socialLayer.addLayer(layer);
        case 'environmental': return environmentalLayer.addLayer(layer);
        case 'economic': return economiclLayer.addLayer(layer);
        case 'spatial': return spatialLayer.addLayer(layer);
        case 'technical': return technicalLayer.addLayer(layer);
    };

};

function displayCommune(unit) {
    L.geoJSON(unit, {
        style: function (feature) {
            switch (feature.properties.PRtype) {
                case 'LPR': return { color: "#cc393d" };
                case 'GPR': return { color: '#2e5984' };
                default : return { color: '#000000'};
            };
        },
        pointToLayer: function (feature, latlng) {
            switch (feature.properties.sphere) {
                case 'social': return L.marker(latlng, { icon: socialIcon });
                case 'environmental': return L.marker(latlng, { icon: environmentIcon });
                case 'economic': return L.marker(latlng, { icon: economicIcon });
                case 'spatial': return L.marker(latlng, { icon: spatialIcon });
                case 'technical': return L.marker(latlng, { icon: technicalIcon });
            }
        },
        onEachFeature: onEachFeature
    }).addTo(map);
};





var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {


    if (props) {
        if (props.PRtype) {
            this._div.innerHTML = '<h2>Informacje o gminie</h2>' + '<b><p>' + props.name + '</b></p><p>Rodzaj programu: ' 
            + props.PRtype + '</p><p>Tytuł programu: '+ props.PRname + '</p><p>' + props.description + 
            '</p><p><a href="'+props.link+'"target="_blank" title="Strona otworzy się w nowej karcie"> Link do programu rewitalizacji </a></p>';

        } else {
            this._div.innerHTML = '<div class="'+ props.sphere + '"><h2>Informacje o projekcie</h2>' + '<p><b>Tytuł projektu: ' + props.title + '</b></p></div><p>' + props.description +
            '</p>';
        }

    } else {
        this._div.innerHTML = '<b>Kliknij na wybrany projekt lub obszar gminy, by dowiedzieć się więcej.</b>';
    }
};

info.addTo(map);

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');

    div.innerHTML = '<i style="background:#cc393d"></i> LPR <br/><i style="background:#2e5984"></i> GPR';

    return div;
};

legend.addTo(map);

displayCommune(augustowCity);
displayCommune(bialowiezaCommune);
displayCommune(bielskPodlaskiCity);
displayCommune(bockiCommune);
displayCommune(choroszczCommune);
displayCommune(czarnaBialostockaCommune);
displayCommune(dabrowaBialostockaCommune);
displayCommune(grajewoCity);
displayCommune(grodekCommune);
displayCommune(hajnowkaCity);
displayCommune(hajnowkaCommune);
displayCommune(juchnowiecKoscielnyCommune);
displayCommune(kolnoCity);
displayCommune(kolnoCommune);
displayCommune(krynkiCommune);
displayCommune(lapyCommune);
displayCommune(lomzaCity);
displayCommune(lomzaCommune);
displayCommune(malyPlockCommune);
displayCommune(monkiCommune);
displayCommune(narewkaCommune);
displayCommune(piatnicaCommune);
displayCommune(rajgrodCommune);
displayCommune(sejnyCity);
displayCommune(siemiatyczeCity);
displayCommune(sokolkaCommune);
displayCommune(stawiskiCommune);
displayCommune(surazCommune);
displayCommune(suwalkiCity);
displayCommune(szudzialowoCommune);
displayCommune(turoslCommune);
displayCommune(wasilkowCommune);
displayCommune(wasoszCommune);
displayCommune(wysokieMazowieckieCity);
displayCommune(zambrowCity);
displayCommune(zambrowCommune);

