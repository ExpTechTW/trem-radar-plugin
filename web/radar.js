const map = new maplibregl.Map({
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
  });
  
  const resetButton = document.createElement('button');
  resetButton.id = 'reset-position';
  resetButton.innerHTML = `
    <svg
        width="20"
        height="20"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        class="iconify iconify--gis"
        preserveAspectRatio="xMidYMid meet"
    >
        <path
            d="M43 0v13.166C27.944 16.03 16.03 27.944 13.166 43H0v14h13.166C16.03 72.056 27.944 83.97 43 86.834V100h14V86.834C72.056 83.97 83.97 72.056 86.834 57H100V43H86.834C83.97 27.944 72.056 16.03 57 13.166V0H43zm7 22.5A27.425 27.425 0 0 1 77.5 50A27.425 27.425 0 0 1 50 77.5A27.425 27.425 0 0 1 22.5 50A27.425 27.425 0 0 1 50 22.5z"
            fill="currentColor"
        ></path>
        <circle r="15" cy="50" cx="50" fill="currentColor"></circle>
    </svg>
  `;
  document.body.appendChild(resetButton);
  
  resetButton.addEventListener('click', () => {
    map.jumpTo({
        center: [120.2, 23.6],
        zoom: 6.6
    });
  });
  
  const updateButton = document.createElement('button');
  updateButton.id = 'update-position';
  updateButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q82 0 155.5 35T760-706v-94h80v240H600v-80h110q-41-56-101-88t-129-32q-117 0-198.5 81.5T200-480q0 117 81.5 198.5T480-200q105 0 183.5-68T756-440h82q-15 137-117.5 228.5T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z"/></svg>`;
  document.body.appendChild(updateButton);
  
  updateButton.addEventListener('click', async () => {
    const response = await fetch('https://api.exptech.dev/api/v1/tiles/radar/list');
    const timeList = await response.json();
    const latestTime = timeList[timeList.length - 1];
  
    const timeDisplay = document.getElementById('time-display');
    const date = new Date(parseInt(latestTime));
    timeDisplay.textContent = date.getFullYear() + '-' + 
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0');
    
    map.getSource('radarTiles').setTiles([
        `https://api-1.exptech.dev/api/v1/tiles/radar/${latestTime}/{z}/{x}/{y}.png`
    ]);
  });
  
  const toggleButton = document.createElement('button');
  toggleButton.id = 'toggle-layer';
  toggleButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
        <path d="m644-448-56-58 122-94-230-178-94 72-56-58 150-116 360 280-196 152Zm115 114-58-58 73-56 66 50-81 64Zm33 258L632-236 480-118 120-398l66-50 294 228 94-73-57-56-37 29-360-280 83-65L55-811l57-57 736 736-56 56ZM487-606Z"/>
    </svg>
  `;
  document.body.appendChild(toggleButton);
  
  function loadConfig() {
    try {
        const savedConfig = localStorage.getItem('mapConfig');
        return savedConfig ? JSON.parse(savedConfig) : { layers: { town_outline: { visible: false } } };
    } catch (error) {
        console.error('無法載入設定:', error);
        return { layers: { town_outline: { visible: false } } };
    }
  }
  
  function saveConfig(config) {
    try {
        localStorage.setItem('mapConfig', JSON.stringify(config));
    } catch (error) {
        console.error('無法儲存設定:', error);
    }
  }
  
  let layerVisible = false;
  
  toggleButton.addEventListener('click', () => {
    layerVisible = !layerVisible;
    
    if (layerVisible) {
        if (!map.getLayer('town-outline')) {
            map.addLayer({
                'id': 'town-outline',
                'type': 'line',
                'source': 'map',
                'source-layer': 'town',
                'paint': {
                    'line-color': '#a9b4bc',
                },
            });
        }
        map.setLayoutProperty('town-outline', 'visibility', 'visible');
    } else {
        if (map.getLayer('town-outline')) {
            map.setLayoutProperty('town-outline', 'visibility', 'none');
        }
    }
    
    // 儲存新的設定
    saveConfig({
        layers: {
            town_outline: {
                visible: layerVisible
            }
        }
    });
    
    // 更新按鈕圖示
    toggleButton.innerHTML = layerVisible ? `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
            <path d="m644-448-56-58 122-94-230-178-94 72-56-58 150-116 360 280-196 152Zm115 114-58-58 73-56 66 50-81 64Zm33 258L632-236 480-118 120-398l66-50 294 228 94-73-57-56-37 29-360-280 83-65L55-811l57-57 736 736-56 56ZM487-606Z"/>
        </svg>
    ` : `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
            <path d="M480-118 120-398l66-50 294 228 294-228 66 50-360 280Zm0-202L120-600l360-280 360 280-360 280Zm0-280Zm0 178 230-178-230-178-230 178 230 178Z"/>
        </svg>
    `;
  });
  
  let opacity = 1;
  let isOn = true;
  
  map.on('load', async function () {
    const config = loadConfig();
    layerVisible = config.layers.town_outline.visible;
    
    if (layerVisible) {
        map.addLayer({
            'id': 'town-outline',
            'type': 'line',
            'source': 'map',
            'source-layer': 'town',
            'paint': {
                'line-color': '#a9b4bc',
            },
        });
    } else {
        map.addLayer({
            'id': 'town-outline',
            'type': 'line',
            'source': 'map',
            'source-layer': 'town',
            'paint': {
                'line-color': '#a9b4bc',
            },
            'layout': {
                'visibility': 'none'
            }
        });
    }
    
    toggleButton.innerHTML = layerVisible ? `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
            <path d="m644-448-56-58 122-94-230-178-94 72-56-58 150-116 360 280-196 152Zm115 114-58-58 73-56 66 50-81 64Zm33 258L632-236 480-118 120-398l66-50 294 228 94-73-57-56-37 29-360-280 83-65L55-811l57-57 736 736-56 56ZM487-606Z"/>
        </svg>
    ` : `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
            <path d="M480-118 120-398l66-50 294 228 294-228 66 50-360 280Zm0-202L120-600l360-280 360 280-360 280Zm0-280Zm0 178 230-178-230-178-230 178 230 178Z"/>
        </svg>
    `;
  
    const response = await fetch('https://api.exptech.dev/api/v1/tiles/radar/list');
    const timeList = await response.json();
    const latestTime = timeList[timeList.length - 1];
  
    const timeDisplay = document.createElement('div');
    timeDisplay.id = 'time-display';
    
    const date = new Date(parseInt(latestTime));
    timeDisplay.textContent = date.getFullYear() + '-' + 
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0');
    document.body.appendChild(timeDisplay);
  
    map.addSource('radarTiles', {
        'type': 'raster',
        'tiles': [
            `https://api-1.exptech.dev/api/v1/tiles/radar/${latestTime}/{z}/{x}/{y}.png`
        ],
        'tileSize': 256
    }).on('error', function(e) {
        console.error('雷達圖層載入錯誤:', e.error);
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
            setTimeout(() => {
                opacity = 1;
                isOn = true;
            }, 500);
        }
    }, 3500);
  });