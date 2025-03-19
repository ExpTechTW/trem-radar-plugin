const mapConfig = {
    container: 'map',
    dragRotate: false,
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
            }
        ]
    },
    center: [120.2, 23.6],
    zoom: 6.6
};

const map = new maplibregl.Map(mapConfig); 