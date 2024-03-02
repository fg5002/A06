<script>
  import Modal from "./Modal.svelte";
  import {currData} from "./store";
  
  export let showEditorNotes = false;
  export let placeHolder = "none";
  
  const focus = async(node)=>{
    await waiter(100);
    node.value = "";
    node.focus();
  }  

  const waiter = (ms)=> {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms);
    })
  }

</script>

<Modal
  bind:showModal = {showEditorNotes} 
  modalClass = "editor-notes-list" 
  backdropClasses = "items-start justify-center z-2000"
  mainClasses = "w-4/5 h-1/3 mt-1.5 md:w-4/5 xl:w-1/3"
>
  <textarea 
    class="h-full w-full bg-yellow-200 border-2 border-zinc-500 rounded-sm p-2 text-xl" 
    type="text"
    placeholder= {placeHolder}
    bind:value={$currData.note}
    on:contextmenu={()=> $currData.note =""}
    use:focus
  />
  
</Modal>