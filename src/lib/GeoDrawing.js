  import {get} from 'svelte/store';
  import {metersPerPixel} from '$lib/store';
  import bearing from '@turf/bearing';  // npm.install @turf/bearing
  import destination from '@turf/destination';  // npm.install @turf/destination
  import distance from '@turf/distance';  // npm.install @turf/distance
  import midpoint from '@turf/midpoint';  // npm.install @turf/midpoint
  import pointOnFeature from '@turf/point-on-feature';  // npm.install @turf/point-on-feature
  import nearestPointOnLine from '@turf/nearest-point-on-line'; // npm.install @turf/nearest-point-on-line
  import explode from '@turf/explode';  // npm.install @turf/explode
  import {point, lineString, polygon, multiPoint, multiPolygon} from '@turf/helpers'; // npm.install @turf/helpers
  //import { Geolocation } from '@capacitor/geolocation';
  
  export const pxToMeter=(pixel=1)=> parseFloat((pixel * (get(metersPerPixel))).toFixed(2));

  export const trimCoordArray=(a)=> a.map(c=> parseFloat(c.toFixed(6)));

  export const latLngToLatLngArray=(cor)=> trimCoordArray([cor.lat, cor.lng]);
  
  export const latLngToLngLatArray=(cor)=> trimCoordArray([cor.lng, cor.lat]);
  
  export const lngLatArrayToLatLng=(arr)=> {return {lat: parseFloat(arr[1]).toFixed(6), lng: parseFloat(arr[0]).toFixed(6)}}

  export const explodeFeatureToArray=(ft)=> explode(ft).features.map(f=> trimCoordArray(f.geometry.coordinates));

  export const getNearestPointOnLine=(line, pt)=> trimCoordArray(nearestPointOnLine(lineString(line), point(pt), {units: 'kilometers'}).geometry.coordinates);

  const addPoint=(pt, dis, ang)=> trimCoordArray(destination(point(pt), pxToMeter(dis), ang, {units: 'meters'}).geometry.coordinates);

  export const pointsToEllipse=(f)=>{
    let pts = [
      parseFloat(distance(point(f.geometry.coordinates), point(f.geometry.ellipse[0]), {units:'meters'}).toFixed(1)),
      parseFloat(distance(point(f.geometry.coordinates), point(f.geometry.ellipse[1]), {units:'meters'}).toFixed(1))
    ]
    let bp = bearing(point(f.geometry.coordinates), point(f.geometry.ellipse[0]));
    return [pts, bp-90];
  }

  export const pointToCircle=(f)=>{
    return parseFloat(distance(point(f.geometry.coordinates), point(f.geometry.circle), {units:'meters'}).toFixed(1));
  }

  const findDistCoord = (pt, dis, rot)=>{
    return destination(pt, dis, rot, {units: 'meters'}).geometry.coordinates  // returns a point coord
      .map(c=> parseFloat(c.toFixed(6)));
  }

  export const drawShape=(shape, p)=> {
    let sh = point(p);
    switch (shape) {
      case 'circle':
        sh.geometry.param = [pxToMeter(50)];
        break;
      case 'ellipse':
        sh.geometry.param = [pxToMeter(50), pxToMeter(25), 180];
        break;
      case 'line':
        sh = lineString([
          addPoint(p, 75, 80),
          //addPoint(p, 150, 105),
          addPoint(p, 250, 15)]);
        break;        
      case 'polygon':
        sh = polygon([
          [
            addPoint(p, 175, 0),
            addPoint(p, 175, 120),
            addPoint(p, 175, 240),
            addPoint(p, 175, 0)
          ]
        ]);
        break;
      case 'multipolygon':
        sh = multiPolygon([
          [
            [
              addPoint(p, 175, 0),
              addPoint(p, 175, 120),
              addPoint(p, 175, 240),
              addPoint(p, 175, 0)
            ],
            [
              addPoint(p, 70, 25),
              addPoint(p, 50, 120),
              addPoint(p, 45, 240),
              addPoint(p, 70, 25)
            ]
          ],
          [
            [
              addPoint(p, 275, 180),
              addPoint(p, 190, 120),
              addPoint(p, 190, 240),
              addPoint(p, 275, 180)
            ]
          ]
        ]);
        break;
      default:
        break;
    }
    console.log(JSON.stringify(sh))
    sh.properties.id = Math.random().toString(36).substring(2, 10);
    sh.properties.type = 0;
    sh.properties.data = 'TestData';
    sh.geometry.center = trimCoordArray(pointOnFeature(sh).geometry.coordinates);
    return sh;
  }

  const featureToMultiPoint=(ft)=>{
    let coords = ft.geometry.coordinates
    let pta = [];
    let par = ft.geometry.param;
    switch (ft.geometry.type) {
      case 'Point':
        pta = [coords];
        if(par){
          if(par.length===1){
            pta = [coords, findDistCoord(ft, par[0], 90)]
          }
          else{
            pta = [coords, findDistCoord(ft, par[0], par[2]-90), findDistCoord(ft, par[1], par[2])];          
          }
        }
        break;
      case 'LineString':
        pta = coords;
        break;
      case 'Polygon':
        pta = [...new Set(coords.flat().map(f=> JSON.stringify(f)))].map(s=> JSON.parse(s));
        break;        
        case 'MultiPolygon':
        pta = [...new Set(coords.flat(2).map(f=> JSON.stringify(f)))].map(s=> JSON.parse(s));
        break;    
      default:
        break;
    }
    return multiPoint(pta);
  }

  const arrayToMidPointArray=(a)=>{
    let mpa = a.map((f,i)=> i<a.length-1 && trimCoordArray(midpoint(point(f), point(a[i+1])).geometry.coordinates)).slice(0,-1);
    mpa = new Set([...a[0], ...a[a.length-1]]).size===2 ? [...mpa, mpa[0]] : mpa;
    return mpa;
  }
  
  export const featureToMidPointFeature=(ft)=>{  // Ez tárolja a midpointokat
    let coords = ft.geometry.coordinates
    let mpa = [];
    let tmpFeature;
    switch (ft.geometry.type) {
      case 'LineString':
        mpa = arrayToMidPointArray(coords);
        tmpFeature = mpa.length>1 ? lineString(mpa) : point(mpa[0]);
        break;
      case 'Polygon':
        mpa = coords.map(f=>arrayToMidPointArray(f))
        tmpFeature = polygon(mpa);
        break;
      case 'MultiPolygon':
        mpa = coords.map(f=> f.map(f2=> arrayToMidPointArray(f2)));
        tmpFeature = multiPolygon(mpa);
        break;    
      default:
        break;
    }
    return tmpFeature;
  }
  
  export const drawControlPoints = (f)=>{
    let fc = {"type": "FeatureCollection", "features": []}
    let cp = featureToMultiPoint(f);
    cp.properties.type = 5;
    fc.features = [...fc.features, cp];

    if(f.geometry.type != 'Point'){
      let mp = featureToMidPointFeature(f);
      let cp = featureToMultiPoint(mp);
      cp.properties.type = 6;
      fc.features = [...fc.features, cp];
    }
    return fc;    
  }

  /*export const drawControlPoints=(f)=>{
    let cp = featureToMultiPoint(f);
    cp.properties.type = 5;
    return cp;
  }*/
  
  /*export const drawMidControlPoints=(f)=>{
    let mp = featureToMidPointFeature(f);
    //console.log('mp', JSON.stringify(mp))
    let cp = featureToMultiPoint(mp);
    cp.properties.type = 6;
    return cp;
  }*/

  export const findIndexOfCoordArray = (arr, p)=>{
    return arr.findIndex(f=> new Set([...f, ...p]).size===2);
  }

  export const findIndexOfSimpleShapes = (feature, cor)=> {
    return findIndexOfCoordArray(feature, cor)
  }

  export const findIndexOfComplexShapes=(ft, pt)=>{ // az temp rajzon keresi
    let cor = ft.geometry.coordinates;
    let pti = null;
    let w;
    switch (ft.geometry.type) {
      case 'Point':
        w = findIndexOfCoordArray([cor], pt);
        pti = w>-1 ? [w] : pti;
        break;
      case 'LineString':
        w = findIndexOfCoordArray(cor, pt);
        pti = w>-1 ? [w] : pti;
        break;
      case 'Polygon':
        cor.forEach((v,i)=>{
          w = findIndexOfCoordArray(v, pt);
          pti = w>-1 ? [i,w] : pti;
        })
        break;
      case 'MultiPolygon':
        cor.forEach((v,i)=>{
          v.forEach((z,j)=>{
            w = findIndexOfCoordArray(z, pt);
            pti = w>-1 ? [i,j,w] : pti;
          })
        })
        break;   
      default:
        break;
      }
    return pti;
  }

  export const addNewControlPoint=(f, cor)=>{
    if(f.geometry.type === 'Point') return;
    let i = findIndexOfComplexShapes(featureToMidPointFeature(f), cor);
    let fc = f.geometry.coordinates;
    if(i != null){ 
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
      i[i.length-1] = i[i.length-1]+1;
      return i;
    }
  }

  export const removeControlPoint =(f, cor)=>{
    if(f.geometry.type === 'Point') return;
    let i = findIndexOfComplexShapes(f, cor);
    if(i){
      let fc = f.geometry.coordinates;
      switch (f.geometry.type) {
        case 'LineString':
          if(fc.length>2){
            fc.splice(i[0],1)
          }
          break;
        case 'Polygon':
          if(fc[i[0]].length>4){
            if(i[1]===0 ){
              fc[i[0]].splice(fc[i[0]].length-1,1);
              fc[i[0]][0] = fc[i[0]][fc[i[0]].length-1];
            }
            else{
              fc[i[0]].splice(i[1],1);
            }          
          }
          break;
        case 'MultiPolygon':
          if(fc[i[0]][i[1]].length>4){
            if(i[2]===0 ){
              fc[i[0]][i[1]].splice(fc[i[0]][i[1]].length-1,1);
              fc[i[0]][i[1]][0] = fc[i[0]][i[1]][fc[i[0]][i[1]].length-1];
            }
            else{
              fc[i[0]][i[1]].splice(i[2],1);
            }
          }        
          break;   
        default:
          break;
        }
    }
      return f;
  }

  export const updateSimpleShape = (f, c, i, cor)=>{
    let p = f.geometry.param;
    let mp = c.geometry.coordinates;
    switch (i[0]) {
      case 0:
        f.geometry.coordinates = cor;
        break;
      case 1:
        mp[1] = cor
        p[0] = (distance(mp[0], mp[1], {units:'meters'})).toFixed(1);
        if(p.length>1){
          p[2] = (bearing(mp[0], mp[1]) + 90).toFixed(1);
        }
        break;
      case 2:
        mp[2] = cor;
        p[1] = (distance(mp[0], mp[2], {units:'meters'})).toFixed(1);
        break;
      default:
        return false
    }
    return f;
  }

  export const updateComplexShape = (f, i, cor)=>{
    if(!i) return
    let coords = f.geometry.coordinates;
    switch (f.geometry.type) {
      case 'LineString':
        coords[i[0]] = cor;
        break;
      case 'Polygon':
        coords[i[0]][i[1]] = cor;
        if(i[1] === 0){
          coords[i[0]][coords[i[0]].length-1] = cor;
        }
        break;
      case 'MultiPolygon':
        coords[i[0]][i[1]][i[2]] = cor;
        if(i[2] === 0){
          coords[i[0]][i[1]][coords[i[0]][i[1]].length-1] = cor;
        }        
        break;    
      default:
        break;
    }
    return f
  }

  /*export const updateShape = (f, cp, idx, cor)=>{
    if(idx === -1) return;
    if(f.geometry.type === 'Point'){
      let param = f.geometry.param;
      let points = cp.geometry.coordinates;
      switch (idx) {
        case 0:
          f.geometry.coordinates = cor;
          break;
        case 1:
          points[1] = cor
          param[0] = (distance(points[0], points[1], {units:'meters'})).toFixed(1);
          if(param.length>1){
            param[2] = (bearing(points[0], points[1]) + 90).toFixed(1);
          }
          break;
        case 2:
          points[2] = cor;
          param[1] = (distance(points[0], points[2], {units:'meters'})).toFixed(1);
          break;
        default:
          return false
      }
    }
    else{
      switch (f.geometry.type) {
        case 'LineString':
          f.geometry.coordinates[idx[0]] = cor;
          break;
        case 'Polygon':
          f.geometry.coordinates[idx[0]][idx[1]] = cor;
          if(idx[1] === 0){
            f.geometry.coordinates[idx[0]][f.geometry.coordinates[idx[0]].length-1] = cor;
          }
          break;
        case 'MultiPolygon':
          f.geometry.coordinates[idx[0]][idx[1]][idx[2]] = cor;
          if(idx[2] === 0){
            f.geometry.coordinates[idx[0]][idx[1]][f.geometry.coordinates[idx[0]][idx[1]].length-1] = cor;
          }        
          break;    
        default:
          break;
      }
    }
    return f;
  }*/

  /*export const geoLocation = async()=>{
    const coordinates = await Geolocation.getCurrentPosition({
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 100
		});
    if(coordinates) {
      let cor = [coordinates.coords.longitude, coordinates.coords.latitude];
      let rd = (coordinates.coords.accuracy).toFixed(1);
      let tmpFeature =
      {
        "type": "Feature",
        "properties": {
          type: 3,
          param: [parseFloat(rd<2 ? pxToMeter(5) : rd)]
        },
        "geometry": {
          "type": "Point",
          "coordinates": cor
        }
      }
      return tmpFeature
    }else{
      throw new Error()
    }
  }*/
  
  /*const getMaxId=(gjs)=> {
    return gjs.features.reduce((a,b)=> b.properties.id > a ? b.properties.id : a, 50);
  }*/

/*   export const cursorSnap=(e, ...args)=>{
    let cor = e.target.getLatLng();
    let pt = latLngToLngLatArray(cor).map(c=> parseFloat(c.toFixed(6)));
    let np;
    [...args].forEach(fc=> {
      fc.features.forEach(ft=> {      
        switch (ft.geometry.type) {
          case 'LineString':
            np = getNearestPointOnLine(ft.geometry.coordinates, pt);
            snapped(cor, np) && e.target.setLatLng(lngLatArrayToLatLng(np));        
            break;
          case 'Polygon':
            ft.geometry.coordinates.forEach(f=> {
              np = getNearestPointOnLine(f, pt);
              snapped(cor, np) && e.target.setLatLng(lngLatArrayToLatLng(np));  
            })      
            break;
          case 'MultiPolygon':
            ft.geometry.coordinates.forEach(p=> {
              p.forEach(f=> {
                let np = getNearestPointOnLine(f, pt);
                snapped(cor, np) && e.target.setLatLng(lngLatArrayToLatLng(np));  
              })
            })
            break;
          default:
            break;
        }
        explodeFeatureToArray(ft).forEach(p=> snapped(cor, p) && e.target.setLatLng(lngLatArrayToLatLng(p)));
      })
    })
  }

  const snapped =(e, n, dist=15)=> {
    let res = distance(point(latLngToLngLatArray(e)), point(n), {units: 'meters'});
    return res < pxToMeter(dist) ? true : false
  }*/



  export const cursorSnap=(e, ...args)=>{
    let pt = latLngToLngLatArray(e.target.getLatLng());
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
    let dis = distance(point(latLngToLngLatArray(e.target.getLatLng())), point(n), {units: 'meters'});
    if(dis < pxToMeter(dist)){
      e.target.setLatLng(lngLatArrayToLatLng(n));
      /*if(pointIndex>-1){
        updateShape(d.geometry.coordinates);
      }*/
    }
  }