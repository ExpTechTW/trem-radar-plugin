const resetButton = document.getElementById('reset-position');
const updateButton = document.getElementById('update-position');
const toggleButton = document.getElementById('toggle-layer');
  
resetButton.addEventListener('click', () => {
    map.jumpTo({
        center: [120.2, 23.6],
        zoom: 6.6
    });
});
  
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
    
    saveConfig({
        layers: {
            town_outline: {
                visible: layerVisible
            }
        }
    });
    
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
  
    const timeDisplay = document.getElementById('time-display');
    const date = new Date(parseInt(latestTime));
    timeDisplay.textContent = date.getFullYear() + '-' + 
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0');
  
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