<script>
  import { getContext, createEventDispatcher } from 'svelte';
  import L from 'leaflet';
  import {latLngToLatLngArray, latLngToLngLatArray, cursorSnap} from '$lib/GeoDrawing.js';
  import {mapState, visibleShapes, gpsGeo, controlGeo, pointIndex} from '$lib/store';

  export let showCursor = false;
  export let cor;

  let cursor;

  const dispatch = createEventDispatcher();
  
  const map = getContext(L.Map);
  
  const initCursor=()=>{
    
    let divicon = L.divIcon({
      iconSize: null,
      className: `w-2 h-2 border rounded-full border-black border-solid z-40 bg-orange-400`,
      iconAnchor: [4, 4],
      html: `<div class="h-20 w-20 bg-transparent border-4 border-solid rounded-xl mt-4 -ml-10 border-orange-400"/>`
    });

    cursor = L.marker(cor, {
      icon: divicon, 
      draggable: true, 
      autoPan: true
    })
    .on('click',(e)=> dispatch('cursorClick', latLngToLngLatArray(e.latlng)))
    .on('contextmenu',(e)=> dispatch('cursorContextMenu', latLngToLngLatArray(e.latlng)))
    .on('drag',(e)=> {
      dispatch('cursorDrag', latLngToLngLatArray(e.latlng));
      $controlGeo.features.length>0 ? cursorSnap(e, $controlGeo) : cursorSnap(e, ...$visibleShapes, $gpsGeo);
      $pointIndex ? cursorSnap(e, ...$visibleShapes, $gpsGeo) : cursorSnap(e, $controlGeo);

    })
    .on('dragend',()=> $mapState.center = latLngToLatLngArray(map().getCenter()))   
    .addTo(map());

    return {
      destroy() {
        cursor?.off('click drag dragend');
        cursor?.remove();
        cursor = undefined
      }
    }
  }

</script>

{#if showCursor}
  <div use:initCursor/>
{/if}