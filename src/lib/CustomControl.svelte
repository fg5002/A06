<script>
  import { onMount, onDestroy, getContext } from 'svelte'
  import L from 'leaflet';

  export let showCustomControl;
  export let position;

  let control = undefined;
  let controlContent;

  const map = getContext(L.Map);

  onMount(()=>{
    if (map){
      control = L.control();
      control.onAdd = () => controlContent,
      control.setPosition(position);      
      control.addTo(map());
    }
  })

  onDestroy(()=>{
    control?.remove();
    control = undefined
  })

</script>

{#if showCustomControl}
  <div bind:this={controlContent}>
    {#if control}
      <slot/>
    {/if}
  </div>
{/if}