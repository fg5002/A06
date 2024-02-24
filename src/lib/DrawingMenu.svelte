<script>
  import { createEventDispatcher } from 'svelte';
  import Modal from "./Modal.svelte";
  import MenuItem from "./MenuItem.svelte";

  export let showDrawingMenu = false;

  const dispatch = createEventDispatcher();

  const drawShape = (p)=> {
    dispatch('drawShape', p)
    showDrawingMenu = false;
  }

</script>

<Modal 
  bind:showModal={showDrawingMenu}
  modalClass = "drawingmenu"
  backdropClasses = "items-end justify-center z-2000"
  mainClasses = "mb-8"
>
  <div class="flex flex-col divide-y divide-slate-500 border-2 border-slate-500 rounded-sm  shadow-2xl">

    <MenuItem title={"Point"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} img={'images/circle-medium.svg'} on:click={()=> drawShape('point')}/> 
    <MenuItem title={"Circle"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} img={'images/vector-circle-variant.svg'} on:click={()=> drawShape('circle')}/> 
    <MenuItem title={"Ellipse"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} img={'images/vector-ellipse.svg'} on:click={()=> drawShape('ellipse')}/> 
    <MenuItem title={"Line"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} img={'images/vector-polyline.svg'} on:click={()=> drawShape('line')}/> 
    <MenuItem title={"Polygon"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} img={'images/vector-triangle.svg'} on:click={()=> drawShape('polygon')}/> 
    <MenuItem title={"Multipolygon"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} img={'images/vector-polygon.svg'} on:click={()=> drawShape('multipolygon')}/>

  </div>
</Modal>