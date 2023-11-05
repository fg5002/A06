<script>
  import IconButton from '$lib/IconButton.svelte';
  import { createEventDispatcher } from "svelte";

  let showToolbar = false;

  const dispatch = createEventDispatcher();

  const clickHandler=async(e)=>{
    dispatch('draw', e);
    showToolbar = false;
  }

</script>

  <div class='flex gap-2 flex-col'>
    {#if showToolbar}
      <IconButton img='images/circle-medium.svg' on:click={()=>clickHandler('point')}/>
      <IconButton img='images/vector-circle-variant.svg' on:click={()=>clickHandler('circle')}/>
      <IconButton img='images/vector-ellipse.svg' on:click={()=>clickHandler('ellipse')}/>
      <IconButton img='images/vector-polyline.svg' on:click={()=>clickHandler('line')}/>
      <IconButton img='images/vector-triangle.svg' on:click={()=>clickHandler('polygon')}/>
      <IconButton img='images/vector-polygon.svg' on:click={()=>clickHandler('multipolygon')}/>
    {/if}
    <IconButton img='images/lead-pencil.svg' on:click={()=> showToolbar = !showToolbar}/>
  </div>
