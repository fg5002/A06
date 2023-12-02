<script context="module">
  let open;
  let close;
  
  export const openMenu = (cor)=> {
    open(cor);
  }
  
  export const closeMenu = ()=> {
    close();
  }
  
</script>

<script>
  import Marker from './Marker.svelte';
  import DivIcon from './DivIcon.svelte';
  
  let showContextMenu = false;
  let cor;

  open = (c)=>{
    cor = c
    showContextMenu = true
  }

  close = ()=> {
    showContextMenu = false
  }


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
      <div class="w-auto h-auto flex flex-col shadow-2xl bg-transparent">  
        <slot/>  
      </div>
    </DivIcon>
  </Marker>
{/if}