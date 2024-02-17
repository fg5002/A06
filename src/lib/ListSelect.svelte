<script>
  import { createEventDispatcher } from 'svelte';
  import Modal from "./Modal.svelte";

  export let showSelectList = false;
  export let source = [];
  export let multi = false;
  export let sorted = false;
  export let results = [];

  let searchText = "";
  let items = [];
  let activeIndex = 0;
  let inputRef;

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
    if(results.findIndex(f=> f === items[i])>-1) return;
    activeIndex = i;
    results.push(items[activeIndex]);
    if(multi){
      if(sorted) results.sort((a, b)=> a.localeCompare(b, 'hu'));
      searchText = "";
      activeIndex = 0;
      inputRef.focus();
    }else{
      submit();
    }
  }

  const removeItem = (i)=> {
    activeIndex = i;
    results = results.filter(f=> f != results[activeIndex]);
    inputRef.focus();
  }
  
  const changeList = ()=> {
    let s = searchText;
    items = s && s.length>0 ? source.filter(f=>f.includes(s) === true).sort((a, b) => a.localeCompare(b, 'hu')) : [];
  }

  const enterPress = (e)=> {
    if (e.keyCode == 13) {
      selectItem(activeIndex);
    }
  }

  const submit = ()=> {
    searchText = "";
    showSelectList = false;
    dispatch('submitList', results);
    results = [];
  }

</script>

<Modal
  bind:showModal = {showSelectList} 
  modalClass = "select-list" 
  backdropClasses = "items-start z-2000"
  mainClasses = "w-full"
>

  <div class="flex flex-col bg-lime-100 w-full h-[65vh] border-slate-500 border-2 rounded-sm p-2 gap-2">
    <div class="flex gap-2">
      <input 
        class="bg-yellow-200  focus:bg-yellow-300 border-2 border-zinc-500 rounded-md px-2 py-1 m-0 text-left text-lg w-[75%]" 
        type="text"
        bind:this = {inputRef}
        bind:value = {searchText}
        on:input = {changeList}
        on:keypress = {enterPress}
        use:focus
      >
      <button 
        class="border-slate-500 border-2 rounded-md px-2 py-1 text-center bg-yellow-400" 
          on:click={submit}
        >
        <img src={'images/edit.svg'} alt="No" class="w-auto h-auto">
      </button>
    </div>
    <div class="h-full flex flex-col p-1 gap-1 border-slate-500 border-2 rounded-md 
      overflow-y-auto snap-y snap-proximity divide-y divide-slate-700">
      {#if searchText}      
        {#each items as item, i (item)}
          <div 
            class="p-2 select-none text-lg font-bold snap-end 
            {activeIndex === i ? 'bg-lime-400' :'bg-yellow-100'}"
            on:contextmenu|preventDefault = {()=> selectItem(i)}
            role = "link"
            tabindex = 0
          >{item}</div>
        {/each}
      {:else}
        {#each results as item, i (item)}
          <div 
            class="p-2 select-none text-lg font-bold snap-end bg-orange-300"
            on:pointerdown = {()=> removeItem(i)}
            role = "link"
            tabindex = 0
          >{item}</div>
        {/each}
      {/if}
    </div>

  </div>

</Modal>