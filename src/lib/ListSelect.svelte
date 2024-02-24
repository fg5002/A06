<script>
  import { createEventDispatcher } from 'svelte';
  import Modal from "./Modal.svelte";
  
  export let showSelectList = false;
  export let source = [];
  export let minChars = 1;
  export let filterList = (f,s)=> f["nam"].toLowerCase().includes(s) === true;
  export let sortListField = "nam";
  export let multi = false;
  export let sortResult = (a, b)=> a["nam"].localeCompare(b["nam"], 'hu');
  export let result = [];

  let searchText = "";
  let items = [];
  let activeIndex = 0;

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

  const selectItem = (i)=> {
    if(result.findIndex(f=> f === items[i])>-1) return;
    activeIndex = i;
    result.push(items[activeIndex]);
    if(multi === true){
      result.sort((a,b)=> sortResult(a,b));
      searchText = "";
      activeIndex = 0;
    }else{
      result = [items[activeIndex]];
      submit();
    }
  }

  const removeItem = (i)=> {
    activeIndex = i;
    result = result.filter(f=> f != result[activeIndex]);
  }

  const updateList = ()=> {
    if(searchText.length < minChars ) return;
    items = searchText ? 
    source
      .filter(f=> filterList(f, searchText))
      .sort((a, b)=> a[sortListField].localeCompare(b[sortListField], 'hu')) : 
    [];
  }

  const enterPress = (e)=> {
    if (e.keyCode == 13) {
      selectItem(activeIndex);
    }
  }

  const submit = ()=> {
    searchText = "";
    showSelectList = false;
    dispatch('submitList', result);
    result = [];
  }

</script>

<Modal
  bind:showModal = {showSelectList} 
  modalClass = "taxon-list" 
  backdropClasses = "items-start z-2000"
  mainClasses = "w-full"
>

  <div class="flex flex-col bg-lime-100 w-full h-[65vh] border-slate-500 border-2 rounded-sm p-2 gap-2">
    <div class="flex gap-2">
      <input 
        class="bg-yellow-200  focus:bg-yellow-300 border-2 border-zinc-500 rounded-md px-2 py-1 m-0 text-left text-lg w-[75%]" 
        type="text"
        bind:value = {searchText}
        on:input = {updateList}
        on:keypress = {enterPress}
        use:focus
      >
      {#if multi === true}
        <button 
          class="border-slate-500 border-2 rounded-md px-2 py-1 text-center bg-yellow-400" 
            on:click={submit}
          >
          <img src={'images/edit.svg'} alt="No" class="w-auto h-auto">
        </button>
      {/if}
    </div>
    <div class="h-full flex flex-col p-1 border-slate-500 border-2 rounded-md 
      overflow-y-auto snap-y snap-proximity divide-y divide-gray-400">
      {#if searchText}      
        {#each items as item, i}
          <div 
            class=" flex flex-wrap h-auto gap-2 p-2 select-none text-lg snap-end {activeIndex === i ? 'bg-lime-400' :'bg-yellow-100'}"
            on:pointerup = {()=> selectItem(i)}
            role = "link"
            tabindex = 0
          >
            <slot name="item" {item}/>
          </div>
        {/each}
      {:else if multi === true}
        {#each result as item, i}
          <div 
            class=" flex flex-wrap h-auto gap-2 p-2 select-none text-lg snap-end bg-orange-300"
            on:pointerup = {()=> removeItem(i)}
            role = "link"
            tabindex = 0
          >    
            <slot name="result" {item}/>        
          </div>
        {/each}
      {/if}
    </div>
    
  </div>
    
</Modal>