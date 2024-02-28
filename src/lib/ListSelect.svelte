 <script context="module">
  export let inputField = null;
</script>

<script>
  import { createEventDispatcher } from 'svelte';
  import Modal from "./Modal.svelte";
  
  export let showSelectList = false;
  export let source = [];
  export let minChars = 1;
  export let filterList = (f,s)=> f["nam"].toLowerCase().includes(s) === true;
  export let sortListField = "nam";
  export let placeHolder = "none";
  export let multi = false;
  //export let sortResult = (a, b)=> a["nam"].localeCompare(b["nam"], 'hu');
  export let result = [];

  export let searchText = "";
  let items = [];

  const dispatch = createEventDispatcher();

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

  const updateList = ()=> {
    if(searchText.length < minChars ) return;
    items = searchText ? 
    source
      .filter(f=> filterList(f, searchText))
      .sort((a, b)=> a[sortListField].localeCompare(b[sortListField], 'hu')) : 
    [];
  }

  const onInput = (e)=> {
    if(e.key == 'Enter') {
      if(items.length > 0){
        dispatch('selectFirstItem', items[0].id);
        inputField.value = "";
      }
    }
  }

  const submit = ()=> {
    dispatch('submit', result);
    showSelectList = false;
  }

</script>

<Modal
  bind:showModal = {showSelectList} 
  modalClass = "list-select" 
  backdropClasses = "items-start z-2000"
  mainClasses = "w-full"
>

  <div class="flex flex-col bg-lime-100 w-full h-[65vh] border-slate-500 border-2 rounded-sm p-2 gap-2">
    <div class="flex gap-2">  
      <input 
        class="bg-yellow-200 w-[75%] focus:bg-yellow-300 border-2 border-zinc-500 rounded-md px-2 py-1 m-0 text-left text-lg" 
        type="text"
        placeholder= {placeHolder}
        bind:value = {searchText}
        on:input = {(e)=>updateList(e)}
        on:keydown|stopPropagation = {(e)=> onInput(e)}
        bind:this={inputField}
        use:focus
      >
      {#if multi}
        <button 
          class="border-slate-500 border-2 rounded-md px-2 py-1 text-center bg-yellow-400" on:pointerup|stopPropagation={submit}>
          <!--img src={'images/edit.svg'} alt="No" class="w-auto h-auto"-->Submit
        </button>
      {/if}   
    </div>
    <div class="h-full flex flex-col text-lg p-1 border-slate-500 border-2 rounded-md 
      overflow-y-auto snap-y snap-proximity divide-y divide-gray-400">
      {#if searchText}      
        {#each items as item, i}
          <slot name="item" {item}/>
        {/each}
      {:else if multi === true}
        {#each result as item, i}
          <slot name="result" {item} {i}/>        
        {/each}
      {/if}
    </div>
    
  </div>
    
</Modal>