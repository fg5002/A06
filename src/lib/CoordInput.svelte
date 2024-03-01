<script>
  import Modal from "./Modal.svelte";
  import {createEventDispatcher} from 'svelte';

  export let showCoordInput = false;

  let coord = null;
  let convertedCoord = null;

  const dispatch = createEventDispatcher();

  const focus = (node)=>  node.focus();

  const convertCoordsToLatLngArray = (c)=> {
    try{
      let cor = null;
      let w = c && c.match(/^([\d]{2})°([\d]{1,2})'([\d\.]+)"([NS]) ([\d]{2,3})°([\d]{1,2})'([\d\.]+)"([EW])$/);
      if(w){
        w=w.map(d=>parseFloat(d));
        let ns = w[4]==='S' ? -1 : 1;
        let ew = w[8]==='W' ? -1 : 1;
        cor = [parseFloat((w[1] + ((w[2] + (w[3] / 60)) / 60)) * ns), parseFloat((w[5] + ((w[6] + (w[7] / 60)) / 60)) * ew)];
      }
      let fnd = c && c.match(/^([\d]{2})[\.,]([\d]{1,15}), ?([\d]{2})[\.,]([\d]{1,15})$/);
      if(fnd){
        cor = [parseFloat(`${fnd[1]}.${fnd[2]}`), parseFloat(`${fnd[3]}.${fnd[4]}`)];
      }
      if(cor){
        cor = cor.map(f=>parseFloat(f.toFixed(6)));
        if(cor[1]>cor[0]){
          [cor[0],cor[1]] = [cor[1],cor[0]]      
        }
      }
      return cor;
    } catch (err) {
      alert(err.message);
    }    
  }

  const pasteCoordFromClipboard=async(e)=>{ 
    try{
      e.stopPropagation()
      coord = await navigator.clipboard.readText();
    } catch (err) {
      alert(err.message);
    }
  }

  const setCoordinate = ()=>{
    let cor = convertCoordsToLatLngArray(coord)
    if(cor){
      convertedCoord = cor
      dispatch('setCoord', cor);
      console.log('cor', cor)
      coord = null;
      convertedCoord = null;
    }
  }

</script>

<Modal
  bind:showModal = {showCoordInput} 
  modalClass = "coord_input" 
  backdropClasses = "items-start z-2000 justify-center"
  mainClasses = "w-4/5"
>
  <div class="flex flex-col w-full gap-1 p-2 border-slate-500 border rounded-sm bg-lime-200">
    <div class="flex justify-center items-center w-full gap-2  bg-lime-200">
      <input 
        class="w-full px-2 py-1 m-0 bg-lime-200 outline-none text-lg border-b border-slate-500" 
        type="text"
        placeholder="original"
        use:focus
        bind:value = {coord}
      >
      <button 
        class="border-slate-500 border rounded-md p-2 text-center bg-yellow-200 w-auto" 
        on:click={pasteCoordFromClipboard}
        >
        <img src={'images/edit.svg'} alt="No" class="w-auto h-auto">
      </button>
    </div>  
    <div class="flex justify-center items-center w-full gap-2 bg-lime-200">
      <input 
      class="w-full px-2 py-1 m-0 bg-lime-200 outline-none text-lg border-b border-slate-500"
        type="text" 
        placeholder="converted"
        bind:value = {convertedCoord}
      >
      <button 
        class="border-slate-500 border rounded-md p-2 text-center bg-yellow-200 w-auto" 
        on:click={setCoordinate}
        >
        <img src={'images/edit.svg'} alt="No" class="w-auto h-auto">
      </button>      
    </div>
  </div>  
</Modal>