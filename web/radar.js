const map = new maplibregl.Map({
    container: 'map',
    style: {
        'version': 8,
        'name': 'ExpTech Studio',
        'center': [120.2, 23.6],
        'zoom': 7,
        'sources': {
            'map': {
                'type': 'vector',
                'url': 'https://lb.exptech.dev/api/v1/map/tiles/tiles.json',
            },
        },
        'sprite': '',
        'glyphs': 'https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf',
        'layers': [
            {
                id: 'background',
                type: 'background',
                paint: {
                    'background-color': '#1f2025',
                },
            },
            {
                'id': 'county',
                'type': 'fill',
                'source': 'map',
                'source-layer': 'city',
                'paint': {
                    'fill-color': '#3F4045',
                    'fill-opacity': 1,
                },
            },
            {
                'id': 'town',
                'type': 'fill',
                'source': 'map',
                'source-layer': 'town',
                'paint': {
                    'fill-color': '#3F4045',
                    'fill-opacity': 1,
                },
            },
            {
                'id': 'county-outline',
                'source': 'map',
                'source-layer': 'city',
                'type': 'line',
                'paint': {
                    'line-color': '#a9b4bc',
                },
            },
            {
                'id': 'global',
                'type': 'fill',
                'source': 'map',
                'source-layer': 'global',
                'paint': {
                    'fill-color': '#3F4045',
                    'fill-opacity': 1,
                },
            },
        ]
    },
    center: [120.2, 23.6],
    zoom: 7
});

let opacity = 1;
let isOn = true;

function updateOpacity() {
    map.setPaintProperty('tsunami', 'line-opacity', opacity);
}

map.on('load', async function () {
    const response = await fetch('https://api.exptech.dev/api/v1/tiles/radar/list');
    const timeList = await response.json();
    const latestTime = timeList[timeList.length - 1];

    const timeDisplay = document.createElement('div');
    timeDisplay.id = 'time-display';
    
    const date = new Date(parseInt(latestTime));
    timeDisplay.textContent = date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    

    document.body.appendChild(timeDisplay);

    map.addSource('radarTiles', {
        'type': 'raster',
        'tiles': [
            `https://api-1.exptech.dev/api/v1/tiles/radar/${latestTime}/{z}/{x}/{y}.png`
        ],
        'tileSize': 256
    });

    map.addLayer({
        'id': 'radarLayer',
        'type': 'raster',
        'source': 'radarTiles',
        'paint': {
            'raster-opacity': 1
        }
    });

    setInterval(() => {
        if (isOn) {
            opacity = 0;
            isOn = false;
            updateOpacity();
            setTimeout(() => {
                opacity = 1;
                isOn = true;
                updateOpacity();
            }, 500);
        }
    }, 3500);

    map.on('click', 'tsunami', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['tsunami'] });
        if (features.length > 0) {
            console.log("屬性列表：");
            console.log(JSON.stringify(features[0].properties, null, 2));

            console.log("屬性名稱：");
            Object.keys(features[0].properties).forEach(function (key) {
                console.log(key);
            });
        } else {
            console.log('未找到特徵');
        }
    });
}); 