<script>
  import Leaflet from "$lib/Leaflet.svelte";
  import Scale from '$lib/Scale.svelte';
  import Layers from "$lib/Layers.svelte";
  import TileLayer from "$lib/TileLayer.svelte";
  import MarkerCluster from "$lib/MarkerCluster.svelte";
  import GeoJson from "$lib/GeoJson.svelte";
  import Cursor from '$lib/Cursor.svelte';

  import Control from "$lib/Control.svelte";
  import LeafletContextMenu from "$lib/LeafletContextMenu.svelte";
  import {tempGeo, mapState, dailyData, geoData, queryData, gpsGeo, controlGeo, selectedShape, tempIndex, pointIndex} from '$lib/store';
  import { drawControlPoints } from '$lib/GeoDrawing.js';
  import MenuItem from "$lib/MenuItem.svelte";
  import SubGroup from "$lib/SubGroup.svelte";
  import Modal from "$lib/Modal.svelte";
  import Drawer from "$lib/Drawer.svelte";
  import SveltyPicker from 'svelty-picker';


  let showCursor = false;
  let cursorPos = $mapState.center;
  let showModal = false;
  let showContextMenu = false;
  let drawingToolbar = false;
  let showDrawer = false;
  let calDate = new Date().toISOString().split('T')[0];

  const toggleModal = ()=> showModal=!showModal;
  const toggleDrawer = ()=> showDrawer=!showDrawer;
  
  const openEditing = (e)=>{
    cursorPos = e.detail.pos;
    showContextMenu = false;
    showContextMenu = true;;
    $tempIndex = $tempGeo.features.findIndex(f=> f.properties.id === e.detail.id);
  }

  const beginEdit = ()=>{
    $controlGeo = drawControlPoints($tempGeo.features[$tempIndex]);
    showCursor = true;
    showContextMenu = false;
  }

  const closeEditing = ()=>{
    $controlGeo.features = [];
    $pointIndex = null;
    showContextMenu = false;
    showCursor= false;
  }

  const deleteShape= ()=>{
    $tempGeo.features = [...$tempGeo.features.filter(f=> f != $tempGeo.features[$tempIndex])];
    $tempIndex = null;
    showContextMenu = false;
  }

  const showDrawingToolbar = ()=>{
    if(showCursor) return;
    if(showContextMenu) showContextMenu = false;
    drawingToolbar = true;
  }
  
  const drawShape=(e)=>{
    $selectedShape = e;
    showCursor = true;
    if(drawingToolbar){
      drawingToolbar = false
    }
  }
  
  const drawQuickPoint = ()=>{
    if(showCursor) return;
    drawShape('point');
  }

  const mapClick = ()=>{
    closeEditing();
    if(drawingToolbar){
      drawingToolbar = false
    }
  } 

</script>

<Drawer bind:showDrawer>
  <SveltyPicker
    inputClasses="p-2 w-auto border-2 border-gray-700 rounded-md"
    format = "yyyy-mm-dd"
    clearBtn = false
    pickerOnly = true
    on:input = {console.log(calDate)}
    bind:value = {calDate}
  />
</Drawer>

<Modal bind:showModal>
  <audio controls loop>
    <source src="sounds/Coturnix coturnix.mp3" type="audio/mpeg">
    Your browser does not support the audio element
  </audio>
</Modal>

<Leaflet on:mapClick={mapClick}>

  <Cursor bind:showCursor cor={cursorPos}/>

  <Control position={'topleft'}>
    <MenuItem  title={"Drawer"} img={'images/svgviewer-output.svg'} on:click={toggleDrawer}/>       
  </Control>

  <Control position={'topleft'}>      
    <MenuItem img={'images/flower-tulip-outline.svg'} on:click={()=> console.log('Empty')}/>  
  </Control>
  
  <Control position={'topright'}>
    <MenuItem img={'images/edit.svg'} on:click={toggleModal}/>
  </Control>
  
  <Control position={'bottomleft'}>
    <MenuItem img={'images/map-marker.svg'} on:click={drawQuickPoint}/>
  </Control>
  
  <LeafletContextMenu bind:showContextMenu cor={cursorPos}>
    <MenuItem  title={"Edit"} on:click={beginEdit}/> 
    <MenuItem  title={"Taxoneditor"} on:click={()=> console.log('Empty')}/> 
    <MenuItem  title={"Geoeditor"} on:click={()=> console.log('Empty')}/> 
    <MenuItem  title={"Delete"} on:click={deleteShape}/> 
  </LeafletContextMenu>
      
  <Control position='bottomright'>
    {#if drawingToolbar}
      <MenuItem title={"Point"} img={'images/circle-medium.svg'} on:click={()=> drawShape('point')}/> 
      <MenuItem title={"Circle"} img={'images/vector-circle-variant.svg'} on:click={()=> drawShape('circle')}/> 
      <MenuItem title={"Ellipse"} img={'images/vector-ellipse.svg'} on:click={()=> drawShape('ellipse')}/> 
      <MenuItem title={"Line"} img={'images/vector-polyline.svg'} on:click={()=> drawShape('line')}/> 
      <MenuItem title={"Polygon"} img={'images/vector-triangle.svg'} on:click={()=> drawShape('polygon')}/> 
      <MenuItem title={"Multipolygon"} img={'images/vector-polygon.svg'} on:click={()=> drawShape('multipolygon')}/>
    {:else}
      <MenuItem title={"Draw"} img={'images/lead-pencil.svg'} on:click={showDrawingToolbar}/>
    {/if}
  </Control>
                  
  <Layers>      
    <TileLayer
      name={'OSM'}
      url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
      options={{ minZoom: 7, maxZoom: 19, attribution: '&copy; OpenstreetMap'}}
      selected
    />        
    <TileLayer
      name={'Google'}
      url={'https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga'}
      options={{ minZoom: 7, maxZoom: 21, attribution: '&copy; Google Maps'}}
    />  
    <TileLayer
      name={'Esri'}
      url={'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'}
      options={{ minZoom: 7, maxZoom: 19, attribution: '&copy; ESRI'}}
    />
    <TileLayer
      name={'Túristautak'}
      url={'http://{s}.map.turistautak.hu/tiles/turistautak/{z}/{x}/{y}.png'}
      options={{ minZoom:7, maxZoom:18, attribution: '&copy; Túristautak.hu'}}
    />   
      
    <MarkerCluster>
      <SubGroup  name={'Taxon'}>
        <GeoJson name={'Taxon'} data={$dailyData}/>
      </SubGroup>
      <SubGroup name={"Geo"}>
        <GeoJson name={"Geo"} data={$geoData}/>
      </SubGroup>
      <SubGroup name={"Query"}>
        <GeoJson name={"Query"} data={$queryData}/>
      </SubGroup>
    </MarkerCluster>
    
    <GeoJson name={"Temp"} data={$tempGeo} on:openContextMenu={openEditing}/>
    <GeoJson name={"GPS"} data={$gpsGeo}/>
    <GeoJson name={"ControlPoints"} data={$controlGeo}/>
    
  </Layers>
    
  <Scale/>
    
</Leaflet>
  