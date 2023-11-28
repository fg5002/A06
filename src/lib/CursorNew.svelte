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
    findIndexOfShape,
    drawControlPoints,
    addNewControlPoint,
    removeControlPoint,
    updateSimpleShape,
    updateComplexShape
  } from '$lib/GeoDrawing.js';
  import {mapState, visibleShapes, gpsGeo, controlGeo, pointIndex, selectedShape, tempGeo, tempIndex} from '$lib/store';

  export let showCursor=false;
  export let cor;
  
  let cursor;
  let bgr;
  let brd;

  const dispatch = createEventDispatcher();

  const map = getContext(L.Map);
  
  $:{ 
    if($pointIndex){
      bgr = 'bg-red-500';
      brd = 'border-red-500'
    }else{
      bgr = 'bg-orange-400';
      brd = 'border-orange-400'
    }
  }

  /**
  * @typedef LatLng
  * @type {Object}
  * @property {number} lat
  * @property {number} lng
  */

  /** @typedef LngLatArr
  * @type {[number, number]}
  */

  export const cursorSnap=(e, ...args)=>{
    let cor = latLngToLngLatArray(e.detail.latlng);
    let np;
    [...args].forEach(fc=> {
      fc.features.forEach(ft=> {      
        switch (ft.geometry.type) {
          case 'LineString':
            np = getNearestPointOnLine(ft.geometry.coordinates, cor);
            snap(e, np);
            break;
          case 'Polygon':
            ft.geometry.coordinates.forEach(f=> {
              np = getNearestPointOnLine(f, cor);
              snap(e, np);  
            })      
            break;
          case 'MultiPolygon':
            ft.geometry.coordinates.forEach(p=> {
              p.forEach(f=> {
                let np = getNearestPointOnLine(f, cor);
                snap(e, np);
              })
            })
            break;
          default:
            break;
        }
        explodeFeatureToArray(ft).forEach(np=> {
          snap(e, np);
        });
      })
    })
  }

  const snap = (e, n)=> {
    let cor = latLngToLngLatArray(e.detail.latlng);
    let dist = distance(point(cor), point(n), {units: 'meters'});
    if(dist < pxToMeter(15)){
      updateShapes(n);
      e.detail.target.setLatLng(lngLatArrayToLatLng(n));
    }
  }

  const cursorClick = (e)=> {
    if($controlGeo.features.length===0){
      drawNewShape(latLngToLngLatArray(e.detail.latlng));
    }else{
      if($pointIndex){
        $pointIndex = null;
      }else{
        selectControlPoint(latLngToLngLatArray(e.detail.latlng));
      }
    }
  }

  const selectControlPoint = (cor)=>{
    let f = $tempGeo.features[$tempIndex];
    if(f.geometry.type === 'Point'){
      //$pointIndex = findIndexOfSimpleShape($controlGeo.features[0], cor)
      $pointIndex = findIndexOfShape($controlGeo.features[0], cor)
    }
    else{
      $tempGeo.features[$tempIndex] = addNewControlPoint(f, cor);
      $controlGeo = drawControlPoints(f);
      $pointIndex = findIndexOfShape(f, cor)
    }
  }

  const drawNewShape=(cor)=>{
    let sh = drawShape($selectedShape, cor);
    $tempGeo.features = [...$tempGeo.features, sh];
    $selectedShape = 'point';
    showCursor = false;
  }

  const deleteControlPoint = (e)=>{
    if(!$pointIndex) return;
    let f = $tempGeo.features[$tempIndex];
    $tempGeo.features[$tempIndex] = removeControlPoint(f, latLngToLngLatArray(e.detail.latlng));
    $pointIndex = null;
    $controlGeo = drawControlPoints(f);
  }

  const updateShapes = (cor)=> {
    if(!$pointIndex) return
    let f = $tempGeo.features[$tempIndex];
    $tempGeo.features[$tempIndex] = f.geometry.type === 'Point' ?
    updateSimpleShape(f, $controlGeo.features[0], $pointIndex, cor) :
    updateComplexShape(f, $pointIndex, cor);
    $controlGeo = drawControlPoints(f);
  }

  const cursorDrag = (e)=> {
    //$controlGeo.features.length>0 ? cursorSnap(e, $controlGeo) : cursorSnap(e, ...$visibleShapes, $gpsGeo);
    updateShapes(latLngToLngLatArray(e.detail.latlng));
    $pointIndex ? cursorSnap(e, ...$visibleShapes, $gpsGeo) : cursorSnap(e, $controlGeo);
  }

  const setMapCenter = ()=> $mapState.center = latLngToLatLngArray(map().getCenter());

</script>

{#if showCursor}
  <Marker
    latLng = {cor}
    options={{draggable: true, autoPan: true, autoPanSpeed: 20}}
    on:cursorClick = {cursorClick}
    on:cursorContextMenu = {deleteControlPoint}
    on:cursorDrag = {cursorDrag}
    on:dragend = {setMapCenter}
    bind:this={cursor}>
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