<script>
  import IconButton from '$lib/IconButton.svelte';
  import { createEventDispatcher } from "svelte";
  import MenuItem from './MenuItem.svelte';

  export let showToolbar = false;

  const dispatch = createEventDispatcher();

  const clickHandler=async(e)=>{
    dispatch('draw', e);
    showToolbar = false;
  }

</script>

{#if showToolbar}
  <div class='flex flex-col'>
    <MenuItem title={"Point"} img={'images/circle-medium.svg'} on:click={()=> clickHandler('point')}/> 
    <MenuItem title={"Circle"} img={'images/vector-circle-variant.svg'} on:click={()=> clickHandler('circle')}/> 
    <MenuItem title={"Ellipse"} img={'images/vector-ellipse.svg'} on:click={()=> clickHandler('ellipse')}/> 
    <MenuItem title={"Line"} img={'images/vector-polyline.svg'} on:click={()=> clickHandler('line')}/> 
    <MenuItem title={"Polygon"} img={'images/vector-triangle.svg'} on:click={()=> clickHandler('polygon')}/> 
    <MenuItem title={"Multipolygon"} img={'images/vector-polygon.svg'} on:click={()=> clickHandler('multipolygon')}/> 
  </div>
{/if}
        