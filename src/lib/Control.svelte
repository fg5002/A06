<script>
  import { onMount, onDestroy, getContext } from 'svelte'
  import L from 'leaflet';

  export let position;

  let control = undefined;
  let controlContent;

  const map = getContext(L.Map);

  onMount(()=>{
    if (map){
      control = L.control();
      control.onAdd = () => controlContent
      control.addTo(map());
    }
  })

  $: control && control.setPosition(position);

  onDestroy(()=>{
    control?.remove();
    control = undefined
  })


</script>


  <div bind:this={controlContent}>
      <slot/>
  </div>