<script>
  import Marker from './Marker.svelte';
  import DivIcon from './DivIcon.svelte';
  
  export let showContextMenu = false;
  export let cor;

  let markerElement;

  const markerOptions =  {draggable: true}

  const iconOptions = {
    iconSize: null,
    className: "w-auto h-auto bg-transparent",
    iconAnchor: [-20, 20]
  }

</script>

{#if showContextMenu}
  <Marker
    latLng = {cor}
    options = {markerOptions}
    bind:this={markerElement}
  >
    <DivIcon options={iconOptions}>
      <div class="w-auto h-auto flex flex-col gap-1 shadow-2xl bg-transparent">  
        <slot/>  
      </div>
    </DivIcon>
  </Marker>
{/if}