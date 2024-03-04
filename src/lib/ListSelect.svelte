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

  const onKeyDown = (e)=> {
    if(e.key == 'Enter') {
      if(e.target.value != "" && items.length > 0){
        dispatch('selectFirstItem', items[0].id);
        inputField.value = "";
      }else if(e.target.value === ""){
        submit()
      }
    }
  }

  const submit = ()=> {
    dispatch('submit', result);
    showSelectList = false;
  }

  const modalClose = ()=>{
    items = [];
  }

</script>

<Modal
  bind:showModal = {showSelectList} 
  modalClass = "list-select" 
  backdropClasses = "items-start justify-center z-2000"
  mainClasses = "w-full h-1/2 mt-1.5 text-lg text-left sm:h-4/5 md:w-2/3 md:h-4/5 xl:h-4/5 xl:w-1/3 xl:text-base"
  on:modalClose={modalClose}
>

  <div class="flex flex-col bg-lime-100 w-full h-full border border-slate-500 rounded-sm gap-2">
    <div class="flex justify-between bg-yellow-200 border-b border-slate-500 divide-x divide-gray-400">  
      <input 
        class="w-full px-2 py-1 m-0 bg-yellow-200 outline-none" 
        type="text"
        placeholder= {placeHolder}
        bind:value = {searchText}
        on:input = {(e)=>updateList(e)}
        on:keydown|stopPropagation = {(e)=> onKeyDown(e)}
        bind:this={inputField}
        use:focus
      >
      {#if multi}
        <button 
          class="px-2 py-1 bg-yellow-300" on:pointerup|stopPropagation={submit}>
          <!--img src={'images/edit.svg'} alt="No" class="w-auto h-auto"-->Submit
        </button>
      {/if}   
    </div>
    <div class="h-full w-full flex flex-col overflow-y-auto snap-y snap-proximity divide-y divide-gray-400">
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