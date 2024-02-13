<script>
  import { flip } from 'svelte/animate';
  import Modal from "./Modal.svelte";
  import ContextMenu from "./ContextMenu.svelte";

  export let showDailyList = false;

  let showContextMenu = false;

  const toggleContextMenu = ()=> showContextMenu=!showContextMenu;

  let activeIndex = null;
  let shiftIndex= null;
  let items = "alma, körte, szilva, kajszi, naspolya, málna, dió, mogyoró, berkenye, meggy, ribizke, egres, mandula, cseresznye".split(', ');
  //let items = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20".split(',');

  const selectItem = (i)=> {
    activeIndex = i;
    showContextMenu = true;
  }

  const insertItem = ()=>{
    if(activeIndex === shiftIndex){
      clearIndices();
      return
    }
    let item = items[shiftIndex];
		items.splice(shiftIndex, 1);
    items.splice(activeIndex>shiftIndex ? activeIndex-1 : activeIndex, 0, item);
		items = items;    
    
    clearIndices();
  }

  const selectToMove = ()=>{
    shiftIndex = activeIndex;
    activeIndex = null;
  }

  const clearIndices = ()=>{
    activeIndex = null;
    shiftIndex = null;
  }

</script>

<Modal
  bind:showModal = {showDailyList} 
  modalClass = "daily-list" 
  backdropClasses = "items-start z-2000"
  mainClasses = "w-full"
  on:modalClose = {clearIndices}
>
  <ContextMenu 
    bind:showContextMenu
    bind:shiftIndex
    on:selectToMove = {selectToMove}
    on:insertItem = {insertItem}
    on:modalClose = {clearIndices}
  />

  <div class="flex flex-col bg-lime-100 w-full max-h-[90vh] border-slate-500 border-2 rounded-md p-2 gap-2">

    <div>
      <h1 class="text-center text-2xl font-bold text-justify-center py-1">2024-02-08</h1>
    </div>

    <div class="h-full flex flex-col p-1 gap-1 border-slate-500 border-2 rounded-md overflow-y-auto snap-y snap-proximity">
      {#each items as item, i (item)}
        <div 
          class="border-2 border-slate-500 rounded-m p-2 select-none text-lg font-bold snap-end 
          {activeIndex === i ? 'bg-lime-400' : shiftIndex === i ? 'bg-lime-600' : 'bg-yellow-100'}"
          animate:flip = "{{duration: 300}}"
          on:contextmenu|preventDefault = {()=> selectItem(i)}
          role="button"
          tabindex = 0
        >{item}</div>
      {/each}
    </div>

  </div>

</Modal>