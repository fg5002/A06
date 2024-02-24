<script>
  import { createEventDispatcher } from 'svelte';
  import Modal from "./Modal.svelte";
  import MenuItem from "./MenuItem.svelte";

  export let showShapeContextMenu = false;

  const dispatch = createEventDispatcher();

  const beginEdit = ()=> {
    dispatch('beginEdit')
    showShapeContextMenu = false;
  }

  const deleteShape = ()=> {
    dispatch('deleteShape')
    showShapeContextMenu = false;
  }

</script>

<Modal 
  bind:showModal={showShapeContextMenu}
  modalClass = "shapecontextmenu"
  backdropClasses = "items-center justify-center z-2000"
>
  <div class="flex flex-col divide-y divide-slate-500 border-2 border-slate-500 rounded-sm  shadow-2xl">
    <MenuItem  title={"Edit"} border={false} background = {'bg-yellow-200'} on:click={beginEdit}/> 
    <MenuItem  title={"Taxoneditor"} border={false} background = {'bg-yellow-200'} on:click={()=> console.log('Empty')}/> 
    <MenuItem  title={"Geoeditor"} border={false} background = {'bg-yellow-200'} on:click={()=> console.log('Empty')}/> 
    <MenuItem  title={"Delete"} border={false} background = {'bg-yellow-200'} on:click={deleteShape}/> 
  </div>
</Modal>