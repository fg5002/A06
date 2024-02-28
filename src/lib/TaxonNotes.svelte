<script>
  import { createEventDispatcher } from 'svelte';
  import Modal from "./Modal.svelte";
  
  export let showEditorNotes = false;
  export let source;
  export let placeHolder = "none";

  let noteText; 
  
  $: noteText= source;

  const dispatch = createEventDispatcher();

  const focus = async(node)=> {
    await waiter(500);
    node.focus();
  }  

  const waiter = (ms)=> {
    return new Promise(resolve => {
      setTimeout(() => resolve(), ms);
    })
  }

  const clearContent = ()=> {
    noteText = ""
    //dispatch('clearContent', noteText)
  }

  const submit = ()=> {
    dispatch('submit', noteText)
    noteText = ""
    showEditorNotes = false;
  }

</script>

<Modal
  bind:showModal = {showEditorNotes} 
  modalClass = "editor-notes-list" 
  backdropClasses = "items-start z-2000"
  mainClasses = "w-full h-1/3"
>

  <div class="flex flex-col bg-lime-100 w-full h-full border-slate-500 border-2 rounded-sm p-2 gap-2 text-lg">
    <div class="flex flex-col gap-2 h-full">
      <textarea 
        class="bg-yellow-200 border-2 border-zinc-500 rounded-md p-2 m-0 text-left text-lg w-full h-full" 
        type="text"
        placeholder= {placeHolder}
        bind:value={noteText}
        use:focus
      />
      <div class="flex justify-between gap-2">
        <button 
          class="flex items-center gap-2 border-slate-500 border-2 rounded-md px-2 py-1 text-center bg-yellow-400" 
          on:click={submit}
          >Submit
        </button>
        <button 
          class="flex items-center gap-2 border-slate-500 border-2 rounded-md px-2 py-1 text-center bg-yellow-400" 
          on:click={clearContent}
          >Clear
        </button>
      </div>
    </div>    
  </div>
    
</Modal>