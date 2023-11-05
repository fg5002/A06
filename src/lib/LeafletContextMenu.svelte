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
  
  let cor;
  let showMenu = false;

  open = (c)=>{
    cor = c
    showMenu = true
  }

  close = ()=> {
    showMenu = false
  }


  let markerElement;

  const markerOptions =  {draggable: true}

  const iconOptions = {
    iconSize: null,
    className: "w-auto h-auto bg-transparent",
    iconAnchor: [-20, 20]
  }

</script>

{#if showMenu}
  <Marker
    latLng = {cor}
    options = {markerOptions}
    bind:this={markerElement}
  >
    <DivIcon options={iconOptions}>
      <div class="w-auto h-auto flex flex-col gap-1 shadow-xl bg-transparent">  
        <slot/>  
      </div>
    </DivIcon>
  </Marker>
{/if}