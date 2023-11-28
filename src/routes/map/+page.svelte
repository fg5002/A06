<script>
  import Leaflet from "$lib/Leaflet.svelte";
  import Scale from '$lib/Scale.svelte';
  import Layers from "$lib/Layers.svelte";
  import TileLayer from "$lib/TileLayer.svelte";
  import MarkerCluster from "$lib/MarkerCluster.svelte";
  import GeoJson from "$lib/GeoJson.svelte";
  //import Cursor from '$lib/Cursor.svelte';
  import Cursor from '$lib/CursorNew.svelte';

  import Control from "$lib/Control.svelte";
  import Proba from "$lib/Proba.svelte";
  import Modal from "$lib/Modal.svelte";
  import Button from "$lib/Button.svelte";
  import IconButton from "$lib/IconButton.svelte";
  import DrawingToolbar from "$lib/DrawingToolbar.svelte";
  import LeafletContextMenu, {openMenu, closeMenu} from "$lib/LeafletContextMenu.svelte";
  import CustomControl from "$lib/CustomControl.svelte";
  import {tempGeo, mapState, dailyData, geoData, queryData, gpsGeo, controlGeo, selectedShape, tempIndex} from '$lib/store';
  import {
    drawControlPoints
  } from '$lib/GeoDrawing.js';
  import MenuItem from "$lib/MenuItem.svelte";
  import SubGroup from "$lib/SubGroup.svelte";
  
  let showCursor = false;
  let cursorPos = $mapState.center;
  let showModal = false;
  let showCustomControl = true;

  const toggleCursor = ()=> showCursor = !showCursor;

  const toggleModal = ()=> showModal=!showModal;
  
  const openTempContextMenu=(e)=>{
    closeMenu();
    openMenu(e.detail.pos);
    $tempIndex = $tempGeo.features.findIndex(f=> f.properties.id === e.detail.id);
  }

  const selectShapeToDraw = (e)=> {
    $selectedShape = e.detail;
    toggleCursor();
    showCursor = true;
  }

  const deleteShape= ()=>{
    $tempGeo.features = [...$tempGeo.features.filter(f=> f != $tempGeo.features[$tempIndex])];
    $tempIndex = null;
    closeMenu();
  }

  const beginEdit = ()=>{
    $controlGeo = drawControlPoints($tempGeo.features[$tempIndex]);
    toggleCursor();
    showCursor = true;
    closeMenu();
  }

  const hideControlPoints = ()=>{
    $controlGeo.features = [];
    showCursor= false;
  }

  const mapClick = ()=> closeMenu();

</script>


<Modal bind:showModal>
  <Proba on:click={toggleModal}/>
</Modal>

<Leaflet 
  on:mapClick={mapClick}
>
  <Cursor
    {showCursor}
    cor={cursorPos}
  />

  <Control position={'bottomleft'}>
    <IconButton img='images/map-marker.svg' on:click={toggleCursor}/>
  </Control>

  <Control position={'bottomleft'}>
    <IconButton img='images/map-pin.svg' on:click={()=> console.log('Empty')}/>
  </Control>
  
  <Control position={'bottomleft'}>
    <IconButton img='images/flower-tulip-outline.svg' on:click={()=> console.log('Empty')}/>
  </Control>

  <Control position={'topright'}>
    <Button on:click={toggleModal}>A</Button>
  </Control>

  <Control position={'bottomright'}>
    <DrawingToolbar on:draw={selectShapeToDraw}/>
  </Control>

  <LeafletContextMenu>
    {#if $controlGeo.features.length>0}    
      <MenuItem  title={"Submit"} on:click={hideControlPoints}/>
    {:else}
      <MenuItem  title={"Edit"} on:click={beginEdit}/> 
      <MenuItem  title={"Delete"} on:click={deleteShape}/> 
    {/if}
    <MenuItem title={"Close"} img='images/flower-tulip-outline.svg' on:click={closeMenu}/>
  </LeafletContextMenu>

  <CustomControl {showCustomControl} position='topleft'>
    <IconButton img='images/map-pin.svg' on:click={()=> console.log('Empty')}/>       
  </CustomControl>

  <Layers>      
    
    <TileLayer
      name={'OSM'}
      url={'http://tile.openstreetmap.org/{z}/{x}/{y}.png'}
      options={{ minZoom: 7, maxZoom: 19, attribution: '&copy; OpenstreetMap'}}
    />        
    <TileLayer
      name={'Google'}
      url={'https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga'}
      options={{ minZoom: 7, maxZoom: 21, attribution: '&copy; Google Maps'}}
      selected
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
    <SubGroup name={"Temp"}>
      <GeoJson name={"Temp"} data={$tempGeo} on:openContextMenu={openTempContextMenu}/>
    </SubGroup>
    <!--SubGroup name={"GPS"}>
      <GeoJson name={"GPS"} data={$gpsGeo}/>
    </SubGroup-->        
  </MarkerCluster>
  
  <GeoJson name={"GPS"} data={$gpsGeo}/>
  <GeoJson  name={"ControlPoints"} data={$controlGeo}/>
  
</Layers>


  <Scale/>

</Leaflet>
