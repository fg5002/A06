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
  mainClasses = "w-full"
>

  <div class="flex flex-col bg-lime-100 w-full h-[65vh] border-slate-500 border-2 rounded-sm p-2 gap-2">
    <div class="flex flex-col gap-4">
      <textarea 
        class="bg-yellow-200  focus:bg-yellow-300 border-2 border-zinc-500 rounded-md px-2 py-1 m-0 text-left text-lg w-full" 
        type="text"
        rows="12"
        placeholder= {placeHolder}
        bind:value={noteText}
        use:focus
      />
      <div class="flex justify-between">
        <button 
          class="flex items-center gap-2 border-slate-500 border-2 rounded-md px-2 py-1 text-center bg-yellow-400" 
          on:click={submit}
          >Submit
          <img src={'images/edit.svg'} alt="No" class="w-auto h-auto">
        </button>
        <button 
          class="flex items-center gap-2 border-slate-500 border-2 rounded-md px-2 py-1 text-center bg-yellow-400" 
          on:click={clearContent}
          >Clear
          <img src={'images/edit.svg'} alt="No" class="w-auto h-auto">
        </button>
      </div>
    </div>    
  </div>
    
</Modal>