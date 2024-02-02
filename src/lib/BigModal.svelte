<script>
  import Modal from "./Modal.svelte";
  
  export let showBigModal = false;
  export let bgClass = "xx";
  export let position = "center" 

  const waiter = (ms)=> {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms);
    })
  }

  /*const focus = async(node)=> {
    await waiter(500);
    node.focus(); 
  }*/

  const focus = (node)=>  node.focus();
  
</script>

<Modal bind:showModal={showBigModal} zindex=2000 bg_class={bgClass} position={position}>
  <div class="flex flex-col h-full gap-2 p-2 bg-lime-200 w-full border-zinc-500 border-2 rounded-md justify-items-center">
    <div class="flex flex-col h-full w-full">
      <slot/>
    </div>
    <div class="w-full">
      <input 
      class="bg-yellow-200  focus:bg-yellow-300 border-2 border-zinc-500 rounded-md px-2 py-1 m-0 text-left text-lg w-[75%]" 
      type="text" 
      use:focus
      >
    </div>
  </div>
</Modal>