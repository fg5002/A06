<script>
  import { createEventDispatcher } from 'svelte';
  import Modal from "./Modal.svelte";

  import ListSelectItem from './ListSelectItem.svelte';

  export let showTaxonList = false;
  export let source = [];
  export let sortField = "";
  export let resultSortField = "";
  export let multi = false;
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
      result.sort((a, b)=> a[resultSortField].localeCompare(b[resultSortField], 'hu'));
      searchText = "";
      activeIndex = 0;
      ref.focus();
    }else{
      result = [items[activeIndex]];
      submit();
    }
  }

  const removeItem = (i)=> {
    activeIndex = i;
    result = result.filter(f=> f != result[activeIndex]);
  }

  const filterParams = (f, s)=> f.hun.toLowerCase().includes(s) === true || 
    f.ltn.toLowerCase().includes(s) === true || 
    f.abr.indexOf(s)>-1;

  const updateList = ()=> {
    if(searchText.length < 3 ) return;
    items = searchText ? 
    source
      .filter(f=> filterParams(f, searchText))
      .sort((a, b)=> a[sortField].localeCompare(b[sortField], 'hu')) : 
    [];
  }

  const enterPress = (e)=> {
    if (e.keyCode == 13) {
      selectItem(activeIndex);
    }
  }

  const submit = ()=> {
    searchText = "";
    showTaxonList = false;
    dispatch('submitList', result);
    result = [];
  }

</script>

<Modal
  bind:showModal = {showTaxonList} 
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
          <ListSelectItem
            classes = {activeIndex === i ? 'bg-lime-400' :'bg-yellow-100'}
            on:selectItem = {()=>selectItem(i)} 
          >
            <span class="font-bold">{item.hun}</span>
            <span class="italic">{item.ltn}</span>
            <span class=" text-sm self-center">{item.abr && `[${item.abr}]`}</span>
          </ListSelectItem>
        {/each}
      {:else if multi === true}
        {#each result as item, i}
          <ListSelectItem
            classes = {'bg-orange-300'}
            on:selectItem = {()=> removeItem(i)}
          >        
            <span class="font-bold">{item.hun}</span>
            <span class="italic">{item.ltn}</span>
          </ListSelectItem>
        {/each}
      {/if}
    </div>

  </div>

</Modal>