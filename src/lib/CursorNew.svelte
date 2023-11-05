<script>
  import { getContext, createEventDispatcher } from 'svelte';
  import Marker from "$lib/Marker.svelte";
  import DivIcon from "$lib/DivIcon.svelte";

  import {metersPerPixel} from '$lib/store';
  import bearing from '@turf/bearing';  // npm.install @turf/bearing
  import destination from '@turf/destination';  // npm.install @turf/destination
  import distance from '@turf/distance';  // npm.install @turf/distance
  import midpoint from '@turf/midpoint';  // npm.install @turf/midpoint
  import pointOnFeature from '@turf/point-on-feature';  // npm.install @turf/point-on-feature
  import nearestPointOnLine from '@turf/nearest-point-on-line'; // npm.install @turf/nearest-point-on-line
  import explode from '@turf/explode';  // npm.install @turf/explode
  import {point, lineString, polygon, multiPoint, multiPolygon} from '@turf/helpers'; // npm.install @turf/helpers  

  import {
    latLngToLatLngArray,
    latLngToLngLatArray,
    lngLatArrayToLatLng,
    getNearestPointOnLine,
    pxToMeter,
    explodeFeatureToArray,
    drawShape,
    addNewControlPoint,
    findIndexOfComplexShapes,
    findIndexOfSimpleShapes,
    drawControlPoints,
    removeControlPoint,
    updateShape
  } from '$lib/GeoDrawing.js';
  import {mapState, visibleShapes, gpsGeo, controlGeo, pointIndex, selectedShape, tempGeo, tempIndex} from '$lib/store';

  export let showCursor=false;
  export let cor;
  
  let bgr;
  let brd;  

  const dispatch = createEventDispatcher();

  const map = getContext(L.Map);
  
  $:{ 
    if($pointIndex>-1 && $pointIndex != null){
      bgr = 'bg-red-500';
      brd = 'border-red-500'
    }else{
      bgr = 'bg-orange-400';
      brd = 'border-orange-400'
    }
  }  

  export const cursorSnap=(e, ...args)=>{
    let pt = latLngToLngLatArray(e.detail.latlng);
    let np;
    [...args].forEach(fc=> {
      fc.features.forEach(ft=> {      
        switch (ft.geometry.type) {
          case 'LineString':
            np = getNearestPointOnLine(ft.geometry.coordinates, pt);
            snap(e, np);
            break;
          case 'Polygon':
            ft.geometry.coordinates.forEach(f=> {
              np = getNearestPointOnLine(f, pt);
              snap(e, np);  
            })      
            break;
          case 'MultiPolygon':
            ft.geometry.coordinates.forEach(p=> {
              p.forEach(f=> {
                let np = getNearestPointOnLine(f, pt);
                snap(e, np);
              })
            })
            break;
          default:
            break;
        }
        explodeFeatureToArray(ft).forEach(np=> snap(e, np));
      })
    })
  }

  const snap =(e, n, dist=15)=> {
    let dis = distance(point(latLngToLngLatArray(e.detail.latlng)), point(n), {units: 'meters'});
    if(dis < pxToMeter(dist)){
      e.detail.target.setLatLng(lngLatArrayToLatLng(n));
      if(Array.isArray($pointIndex)){
        console.log('snapped')
        updateShapes(e);
      }
    }
  }

  const cursorClick = (e)=> {
    console.log(latLngToLngLatArray(e.detail.latlng));
    if($controlGeo.features.length===0){
      drawNewShape(latLngToLngLatArray(e.detail.latlng));
    }else{
      if($pointIndex != null){
        $pointIndex = null;
      }
      else{
        selectControlPoint(latLngToLngLatArray(e.detail.latlng));
      }
    }
  }

  const drawNewShape=(e)=>{
    let sh = drawShape($selectedShape, e);
    $tempGeo.features = [...$tempGeo.features, sh];
    $selectedShape = 'point';
    showCursor = false;
  }

  const selectControlPoint = (e)=>{
    let f = $tempGeo.features[$tempIndex];
    $pointIndex = addNewControlPoint(f, e);
    $pointIndex = f.geometry.type === 'Point' ? 
      findIndexOfSimpleShapes($controlGeo.features[0].geometry.coordinates, e) :
      findIndexOfComplexShapes(f, e);
    console.log('pIdx', $pointIndex);
    $controlGeo = drawControlPoints(f);
  }
  
  const deleteControlPoint = (e)=>{
    if($pointIndex === null) return;
    let f = $tempGeo.features[$tempIndex];
    $tempGeo.features[$tempIndex] = removeControlPoint(f, latLngToLngLatArray(e.detail.latlng));
    $pointIndex = null;
    $controlGeo = drawControlPoints(f);
  }

  const updateShapes = (e)=> {
    if($pointIndex === null) return;
    let f = $tempGeo.features[$tempIndex];
    $tempGeo.features[$tempIndex] = updateShape(f, $controlGeo.features[0], $pointIndex, latLngToLngLatArray(e.detail.latlng));
    $controlGeo = drawControlPoints(f);
  }

</script>

{#if showCursor}
  <Marker
    latLng = {cor}
    options={{draggable: true, autoPan: true, autoPanSpeed: 20}}

    on:cursorClick = {(e)=>cursorClick(e)}
    on:cursorContextMenu = {(e)=>deleteControlPoint(e)}
    on:cursorDrag = {(e)=> {
      updateShapes(e)
      $controlGeo.features.length>0 ? cursorSnap(e, $controlGeo) : cursorSnap(e, ...$visibleShapes, $gpsGeo);
      $pointIndex ? cursorSnap(e, ...$visibleShapes, $gpsGeo) : cursorSnap(e, $controlGeo);

    }}
    on:dragend = {()=> $mapState.center = latLngToLatLngArray(map().getCenter())}
  >
    <DivIcon options={{
      iconSize: null,
      className: `w-2 h-2 border rounded-full border-black border-solid z-40 ${bgr}`,
      iconAnchor: [4, 4]
    }}>
      <div class="h-20 w-20 bg-transparent border-4 border-solid rounded-xl mt-4 -ml-10 {brd}"/>
    </DivIcon>
  </Marker>
{/if}