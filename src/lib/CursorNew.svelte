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
    findIndexOfCoordArray,
    findIndexOfComplexShapes,
    findIndexOfSimpleShapes,
    drawControlPoints,
    removeControlPoint,
    featureToMidPointFeature,
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
        explodeFeatureToArray(ft).forEach(np=> snap(e, np));
      })
    })
  }

  const snap =(e, n, dist=15)=> {
    let cor = latLngToLngLatArray(e.detail.latlng);
    let dis = distance(point(cor), point(n), {units: 'meters'});
    if(dis < pxToMeter(dist)){
      e.detail.target.setLatLng(lngLatArrayToLatLng(n));
      //console.log(e.detail.target)
      //updateShapes(e.detail.target);
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
    addNewControlPoint(f, cor);
    $pointIndex = findIndexOfShape(f, cor);
  }

  const drawNewShape=(e)=>{
    let sh = drawShape($selectedShape, e);
    $tempGeo.features = [...$tempGeo.features, sh];
    $selectedShape = 'point';
    showCursor = false;
  }

  const findIndexOfShape = (f, e)=>{ // az temp rajzon keresi
    let cor = f.geometry.coordinates;
    let pti = null;
    let w;
    switch (f.geometry.type) {
      case 'Point':
        w = [findIndexOfCoordArray($controlGeo.features[0].geometry.coordinates, e)];
        pti = w>-1 ? w : pti;
        break;
        case 'LineString':
          w = findIndexOfCoordArray(cor, e);
          console.log('W', JSON.stringify(w))
          pti =  w>-1 ? [w] : pti;
        break;
      case 'Polygon':
        cor.forEach((v,i)=>{
          w = findIndexOfCoordArray(v, e);
          pti = w>-1 ? [i,w] : pti;
        })
        break;
      case 'MultiPolygon':
        cor.forEach((v,i)=>{
          v.forEach((z,j)=>{
            w = findIndexOfCoordArray(z, e);
            pti = w>-1 ? [i,j,w] : pti;
          })
        })
        break;   
      default:
        break;
      }
      console.log('pti', JSON.stringify(pti))
    return pti;
  }
  
  const addNewControlPoint=(f, cor)=>{
    if(f.geometry.type === 'Point') return;
    let i = findIndexOfShape(featureToMidPointFeature(f), cor);
    let fc = f.geometry.coordinates;
    if(i){ 
      switch (f.geometry.type) {
        case 'LineString':
          fc.splice(i[0] + 1, 0, cor)
          break;
        case 'Polygon':
          fc[i[0]].splice(i[1] + 1, 0, cor)
          break;
        case 'MultiPolygon':
          fc[i[0]][i[1]].splice(i[2] + 1, 0, cor)
          break;   
        default:
          break;
        }
    }
    $controlGeo = drawControlPoints(f);
  }

  const deleteControlPoint = (e)=>{
    if(!$pointIndex) return;
    let f = $tempGeo.features[$tempIndex];
    $tempGeo.features[$tempIndex] = removeControlPoint(f, latLngToLngLatArray(e.detail.latlng));
    $pointIndex = null;
    $controlGeo = drawControlPoints(f);
  }

  const updateShapes = (e)=> {
    if(!$pointIndex) return
    let f = $tempGeo.features[$tempIndex];
    $tempGeo.features[$tempIndex] = f.geometry.type === 'Point' ?
    updateSimpleShape(f, $controlGeo.features[0], $pointIndex, latLngToLngLatArray(e.detail.latlng)) :
    updateComplexShape(f, $pointIndex, latLngToLngLatArray(e.detail.latlng));
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
      //$controlGeo.features.length>0 ? cursorSnap(e, $controlGeo) : cursorSnap(e, ...$visibleShapes, $gpsGeo);
      $pointIndex ? cursorSnap(e, ...$visibleShapes, $gpsGeo) : cursorSnap(e, $controlGeo);
      updateShapes(e)
    }}
    on:dragend = {()=> $mapState.center = latLngToLatLngArray(map().getCenter())}
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