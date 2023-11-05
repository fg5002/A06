<script>
  import {shapeGeo, controlPointGeo, midPointGeo, pixel15, clusteredData, drawingGeo, gpsGeo} from '@store/store';
  import {Marker} from 'svelte-map-leaflet';
  import DivIcon from '@components/DivIcon.svelte'
  import { createEventDispatcher } from 'svelte';
  import bearing from '@turf/bearing';
  import BBox from '@turf/bbox';
  import centerOfMass from '@turf/center-of-mass';
  import destination from '@turf/destination';
  import distance from '@turf/distance';
  import explode from '@turf/explode';
  import midpoint from '@turf/midpoint';
  import nearestPointOnLine from '@turf/nearest-point-on-line';
  import polygonToLine from '@turf/polygon-to-line';
  import * as turf from '@turf/helpers';

  
  export let cor;
  export let showCursor=false;
  
  let cursor;
  let mark;
  let snap=true;
  let edit = true;
  let pointIndex = -1;
  let midPointIndex = -1;
  let bgr;
  let brd;

  const dispatch = createEventDispatcher();
  export const getCursor = ()=> cursor;

  $: mark && mark.getInstance().setLatLng(cor)

  $:{ 
    if(pointIndex>-1){
      bgr = 'bg-red-500';
      brd = 'border-red-500'
    }else{
      bgr = 'bg-orange-400';
      brd = 'border-orange-400'
    }
  }

  const snapTo=(d, p)=>{
    let dist = distance(d, p, {units: 'kilometers'});
    if(dist < $pixel15){
      mark.getInstance().setLatLng([d.geometry.coordinates[1],d.geometry.coordinates[0]]);
      if(pointIndex>-1){
        updateShape(d.geometry.coordinates);
      }
    }
  }

  const snapping=(e)=>{
    if(snap){
      let p=turf.point(e);
      let gg;
      if(edit){
        gg = pointIndex>-1 ? [$clusteredData, $gpsGeo] : [$drawingGeo];
      }else{
        gg = [$clusteredData, $gpsGeo]
      }
      gg.forEach(f=>{
        f.features.forEach(d=>{
          if(d.geometry.type==="Point"){
            snapTo(d,p);
          }
          else if(d.geometry.type==="MultiPoint"){
            explode(d).features.forEach(f=>{snapTo(f,p)});
          }
          else{
            d=d.geometry.type==="Polygon" ? polygonToLine(d): d;
            let np = nearestPointOnLine(d, p, {units: 'kilometers'});
            snapTo(np, p);
            explode(d).features.forEach(f=>{snapTo(f, p)});
          }
        })
      })
    }
  }

  const latLngToLatLngArray=(e)=>{
    const z=e.detail.latlng
    return [parseFloat(z.lat.toFixed(6)),parseFloat(z.lng.toFixed(6))];
  }

  const latLngToLngLatArray=(e)=>{
    const z=e.detail.latlng
    return [parseFloat(z.lng.toFixed(6)),parseFloat(z.lat.toFixed(6))];
  }

  function click(e) {
    if($shapeGeo.features.length>0){
      toggleGrab(e)
    }else{
      dispatch('cursorClick', {
        text: latLngToLngLatArray(e)
      });
    }
  }

  const taphold=(e)=>{
    if(pointIndex>-1){
      removeControlPoint();
    }
  }

  const toggleGrab=(e)=>{
    if(pointIndex>-1){
      pointIndex=-1;
    }else{
      let cor = latLngToLngLatArray(e)
      pointIndex = $controlPointGeo.features.findIndex((f)=> new Set([...f.geometry.coordinates,...cor]).size===2);
      midPointIndex = $midPointGeo.features.findIndex((f)=> new Set([...f.geometry.coordinates,...cor]).size===2);
      if(midPointIndex>-1){
        addNewControlPoint();
      }
    }
  }
  
	function drag(e) {
    if(pointIndex>-1){
      updateShape(latLngToLngLatArray(e))
    }
    snapping(latLngToLngLatArray(e));
	}

  export const initDraw=(d,p)=>{
    switch (d) {
      case 'point':
      case 'circle':
      case 'ellipse':
        drawSingleShape(d,p);
        break;
      case 'line':
      case 'polygon':
        drawMultiShape(d,p)
        break;
      default:
        break;
    }
  }

  const drawSingleShape=(shape,p)=> {
    let param;
    if(shape==='circle')
      param = [(4000*$pixel15).toFixed(1)];
    if(shape==='ellipse')
      param =  [(4000*$pixel15).toFixed(1),(2500*$pixel15).toFixed(1),180];
    let pt = turf.point(p);
    if(param){
      pt.properties.param = param;
    }
    pt.properties.type = 0;
    $shapeGeo.features = [pt];
    drawControlPoints()
  }

  const drawMultiShape=(shape,p)=>{
    let dist = (4000 * $pixel15).toFixed(1);
    let c0 = shape==='line' ? [90, -90] : [0, 120, -120, 0];
    let cc = c0
      .map(f=> destination(turf.point(p), dist/1000, f, {units: 'kilometers'}))
      .map(f=> f.geometry.coordinates.map(c=> parseFloat(c.toFixed(6))));
    $shapeGeo.features =  shape==='line' ? [turf.lineString(cc)] : [turf.polygon([cc])];

    /*if(shape==='polygon'){
      let inn =[0, 120, -120, 0]  // Hole in the polygon
        .map(f=> destination(turf.point(p), dist/1000/2, f, {units: 'kilometers'}))
        .map(f=> f.geometry.coordinates.map(c=> parseFloat(c.toFixed(6))));
      $shapeGeo.features[0].geometry.coordinates.push(inn)
    }*/

    let center = centerOfMass($shapeGeo.features[0]);
    $shapeGeo.features[0].properties.center = center;
    let bbox = BBox($shapeGeo.features[0])
    $shapeGeo.features[0].properties.bbox = bbox;
    $shapeGeo.features[0].properties.type = 0;
    drawControlPoints();
    drawMidPoints();
  }

  const drawControlPoints=()=>{
    if($shapeGeo.features[0].geometry.type==='Point'){
      let d1, d2, d3;
      d1 = turf.point($shapeGeo.features[0].geometry.coordinates);
      let p=$shapeGeo.features[0].properties.param;
      let res = [d1]
      if(p){
        d2 = destination(d1, p[0]/1000, 90, {units: 'kilometers'});
        res = [d1, d2]  
        if(p.length>1){
          d2 = destination(d1, p[0]/1000, p[2]-90, {units: 'kilometers'});
          d3 = destination(d1, p[1]/1000, p[2], {units: 'kilometers'});
          res = [d1, d2, d3];
        }
      }
      $controlPointGeo.features = res.map(f=>turf.point(f.geometry.coordinates.map(c=> parseFloat(c.toFixed(6)))));
      $controlPointGeo.features.map(f=>f.properties.type = 1);
    }else{
      let points;
      if($shapeGeo.features[0].geometry.type==='Polygon'){ 
        points = $shapeGeo.features[0].geometry.coordinates[0].map(f=> turf.point(f));
        points.pop();
      }else{
        points = $shapeGeo.features[0].geometry.coordinates.map(f=> turf.point(f));
      }
      //points = points.map(f=>f.properties.type = 1);
      $controlPointGeo.features = points;
      $controlPointGeo.features.map(f=>f.properties.type = 1);
    }
  }

  const drawMidPoints=()=>{
    let pp = $shapeGeo.features[0].geometry.type==='Polygon' ? 
    $shapeGeo.features[0].geometry.coordinates[0] :
    $shapeGeo.features[0].geometry.coordinates;
    
    let pp2 = pp.map((f,i)=>i>0 && midpoint(turf.point(f),turf.point(pp[i-1])));
    pp2.shift();
    let midpoints = pp2.map((f)=>turf.point(f.geometry.coordinates.map(c=> parseFloat(c.toFixed(6)))));
    $midPointGeo.features = midpoints;
    $midPointGeo.features.map(f=>f.properties.type = 2);
  }
  
  const addNewControlPoint=()=>{
    let cor = $midPointGeo.features[midPointIndex].geometry.coordinates;
    if($shapeGeo.features[0].geometry.type==='Polygon'){ 
      $shapeGeo.features[0].geometry.coordinates[0].splice(midPointIndex + 1, 0, cor)
    }else{
      $shapeGeo.features[0].geometry.coordinates.splice(midPointIndex + 1, 0, cor)
    }
    pointIndex = midPointIndex + 1;
    drawControlPoints();
    drawMidPoints();
  }
  
  const removeControlPoint=()=>{
    if($shapeGeo.features[0].geometry.type==='Polygon'){
      let pd = $shapeGeo.features[0].geometry.coordinates[0];
      if(pd.length>4){
        if(pointIndex===0){
          pd.splice(pd.length-1,1);
          pd[0]=pd[pd.length-1];
        }else{
          pd.splice(pointIndex,1);
        }
        $shapeGeo.features[0].geometry.coordinates[0] = pd;
        drawControlPoints();
        drawMidPoints();
      }
    }else{
      let pd = $shapeGeo.features[0].geometry.coordinates;
      if(pd.length>2){
        pd.splice(pointIndex,1);
        $shapeGeo.features[0].geometry.coordinates = pd;
        drawControlPoints();
        drawMidPoints();
      }
    }
    pointIndex = -1; 
  }
  
  const updateShape=(p)=>{
    if($shapeGeo.features[0].geometry.type==='Point'){
      let param = $shapeGeo.features[0].properties.param;
      let points = $controlPointGeo.features.map(f=>f.geometry.coordinates);
      switch (pointIndex) {
        case 0:
          points[0] = p;
          break;
        case 1:
          points[1] = p
          param[0] = (distance(points[0], points[1], {units:'kilometers'}) * 1000).toFixed(1);
          if(param.length>1){;
            param[2] = (bearing(points[0], points[1]) + 90).toFixed(1);
          }
          break;
        case 2:
          points[2] = p;
          param[1] = (distance(points[0], points[2], {units:'kilometers'}) * 1000).toFixed(1);
          break;
        default:
          return false
      }
      $shapeGeo.features[0] = turf.point(points[0]);
      $shapeGeo.features[0].properties.param = param;
      $shapeGeo.features[0].properties.type = 0;
      drawControlPoints()
    }else{
      if($shapeGeo.features[0].geometry.type==='Polygon'){ 
        $shapeGeo.features[0].geometry.coordinates[0][pointIndex] = p;
        if(pointIndex===0){
          $shapeGeo.features[0].geometry.coordinates[0][$shapeGeo.features[0].geometry.coordinates[0].length-1] = p;
        }
      }else{
        $shapeGeo.features[0].geometry.coordinates[pointIndex] = p;
      }
  
      let center = centerOfMass($shapeGeo.features[0]);
      $shapeGeo.features[0].properties.center = center;
  
      let bbox = BBox($shapeGeo.features[0])
      $shapeGeo.features[0].properties.bbox = bbox;
      $shapeGeo.features[0].properties.type = 0;
  
      $controlPointGeo.features[pointIndex].geometry.coordinates = p;
      drawMidPoints();
    }
  }

</script>

{#if showCursor}
  <Marker
    name = {'cursor'}
    latLng = {cor}
    options={{draggable: true, autoPan: true, autoPanSpeed: 20}}
    events={['click','drag','taphold','contextmenu']}
    on:click={click}
    on:taphold={taphold}
    on:contextmenu={taphold}
    on:drag={drag}
    bind:this={mark}
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