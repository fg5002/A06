<script>
  import { createEventDispatcher } from 'svelte';
  import Modal from "./Modal.svelte";

  export let showContextMenu = false;
  export let shiftIndex = -1;

  const dispatch = createEventDispatcher();

  const insertItem = ()=> {
    dispatch('insertItem');
    showContextMenu = false;
  }

  const selectToMove = ()=> {
    dispatch('selectToMove');
    showContextMenu = false;
  }

  const editItem = ()=>{
    dispatch('editItem')
  }

  const deleteItem = ()=>{
    dispatch('deleteItem')
  }

</script>

<Modal
  bind:showModal = {showContextMenu}
  on:modalClose
  modalClass = "context_menu" 
  backdropClasses = "z-2000 h-full w-full items-center justify-end"
  mainClasses = "mr-[5%]"
>
  <div class="flex flex-col bg-lime-200 w-full h-full border-slate-500 border-2 rounded-md p-2 gap-2">
    {#if shiftIndex != null}
      <button 
        class="border-slate-500 border-2 rounded-md px-2 py-2 text-center bg-yellow-400"
        on:pointerdown={insertItem}      
        >Insert before
      </button>

    {:else} 

      <button 
        class="border-slate-500 border-2 rounded-md px-2 py-2 text-center bg-yellow-400"
        on:pointerdown={editItem}      
        >Edit
      </button>
      
      <button 
        class="border-slate-500 border-2 rounded-md px-2 py-2 text-center bg-yellow-400"
        on:pointerdown={selectToMove}
        >Shift
      </button>

      <button 
      class="border-slate-500 border-2 rounded-md px-2 py-2 text-center bg-yellow-400"
      on:pointerdown={deleteItem}
      >Delete
      </button>
    {/if}
  </div>
</Modal>