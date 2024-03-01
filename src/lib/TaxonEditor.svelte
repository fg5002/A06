<script>
  import {currData} from "./store";
  import TimePicker from "./TimePicker.svelte";
  import Modal from "./Modal.svelte";
  import {birds} from "./birds"
  import {attributes} from "./attributes"
  import TaxonList from "./TaxonList.svelte";
	import AttributeList from "./AttributeList.svelte";
  import ObserverList from "./ObserverList.svelte";
  import TaxonNotes from "./TaxonNotes.svelte";

  export let showEditor = false;

  let showTaxonList = false;
  let showAttributeList = false;
  let showObserverList = false;
  let showEditorNotes = false
  let searchText = "";
  let promptRef = null;
  
  $: searchText = promptRef && promptRef.value;

  const focus = async(node)=>{
    await waiter(500);
    node.focus();
  }  

  const waiter = (ms)=> {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms);
    })
  }

  const observers = [
    {id: 1, nam: "Ócsag Attila"},
    {id: 2, nam: "Zsoldos Csaba"},
    {id: 3, nam: "Szalai Kornél"},
    {id: 4, nam: "Lendvai Csaba"},
    {id: 5, nam: "Bajor Zoltán"},
    {id: 6, nam: "Bodor István"},
    {id: 7, nam: "Szőke Gábor"},
    {id: 8, nam: "Novák Gábor"},
    {id: 9, nam: "Egyéb megfigyelő"}
  ]

  /*
  Fekete gólya (Ciconia nigra)
  3pd átrepülő dk-felé
  https://www.google.com/maps/search/?api=1&query=47.5,19.25
  */

  const addAttribute = ()=> {
    let res = null;
    let idx;
    let s = searchText.trim();

    idx = attributes.findIndex(d=> (s===d.abr && d.rep === null) || (s.includes(d.abr) && s.length > d.abr.length && d.rep != null));
    if(idx>-1){
      res = attributes[idx];
      res.value =  res.rep === null ? null : s.replace(res.abr,"");
      res.dis = res.rep === null ? res.nam : res.rep.replace("*", s.replace(res.abr,""));
      $currData.attributes = $currData.attributes.filter(f=> f.id !=res.id);
      $currData.attributes.push(res);
      $currData.attributes = $currData.attributes.sort((a, b) => a.ord-b.ord);
    }else{
      if(s.match(/^[a-z]{4}$/)){
        addTaxon();
      }
    }
    promptRef.value = "";
  }

  const deleteFromFieldArray = (z,i)=> {
    return z.filter(f=> f.id != i);
  }
  
  const addTaxon = ()=>{
    let s = searchText.trim();
    let idx = birds.findIndex(f=> f.abr.indexOf(s)>-1);
    if(idx>-1){
      $currData.taxon = birds[idx];
    }
    promptRef.value = "";
  }

  const promptSpace = (e)=>{
    //console.log(e);
    if (e.keyCode === 13){
      addAttribute();
      promptRef.value = "";
    }
  }

  const submitTaxonList = (e)=>{
    $currData.taxon = e.detail;
    showTaxonList = false;
  }

  const submitAttributeList = (e)=>{
    console.log(JSON.stringify(e.detail));
    /*let res = e.detail.filter(f=> f.rep === null || (f.rep != null && f.value != null))
    console.log(JSON.stringify(res));

    res.map(f=> f.dis = f.rep === null ? f.nam : f.rep.replace("*", f.value.replace(f.abr,"")));
    console.log(JSON.stringify(res));*/
    //$currData.attributes = res;
    $currData.attributes = e.detail;
  }
  
  const submitObserverList = (e)=>{
    $currData.observer = e.detail.sort((a, b) => a.nam.localeCompare(b.nam, 'hu'));
  }

  const submit = ()=> {
    //console.log(JSON.stringify($currData));
    showEditor = false;
    $currData.taxon = null;
    $currData.attributes = [];
    $currData.note = null;
    $currData.files = [];
  }

</script>
  
<Modal
  bind:showModal = {showEditor} 
  modalClass = "taxon_editor" 
  backdropClasses = "items-start justify-center z-2000"
  mainClasses = "gap-2 w-full mt-1.5 h-1/2 md:w-2/3 xl:w-1/3 xl:text-base"
>
  <TaxonList bind:showTaxonList source={birds}/>

  <AttributeList
    bind:showAttributeList
    source = {attributes}
    on:submit = {submitAttributeList}
  />

  <TaxonNotes bind:showEditorNotes placeHolder="Notes"/>

  <ObserverList
    bind:showObserverList
    source = {observers}
    result = {$currData.observer}
    on:submit = {submitObserverList}
  />

  <div class="flex flex-col w-full h-full border-slate-500 border rounded-sm text-lg text-left font-normal">
    <div class="flex justify-between items-center border-b border-slate-500 bg-yellow-200 divide-x divide-gray-400 text-lg font-semibold">
      <input
        class="px-2 py-1 w-full h-auto outline-none bg-yellow-200" 
        type="text" 
        on:keydown|stopPropagation = {(e)=> promptSpace(e)}
        use:focus
        bind:value = {searchText}
        bind:this={promptRef}
      >
      <button 
        class="px-2 py-1 text-centergrow bg-yellow-300" on:pointerup = {submit}>
        <!--img src={'images/edit.svg'} alt="No" class="w-auto h-auto"-->Submit
      </button>      
    </div>

    <div class="flex flex-wrap w-full gap-2 divide-y divide-gray-400 content-start bg-yellow-100 h-full p-2 overflow-y-auto">      

      <div class="flex flex-wrap gap-2 items-center basis-full" on:pointerup={()=> showTaxonList = true}>
        {#if $currData.taxon}
        <span class="select-none" on:pointerup|stopPropagation={()=>$currData.taxon = null}>
          <span class="font-bold select-none mr-2">{$currData.taxon.hun}</span>
          <span class="italic select-none mr-2">{$currData.taxon.ltn}</span>
        </span>
        {:else}
          <div class="font-bold text-green-600 select-none">Taxon</div> 
        {/if}
      </div>

      <div class="flex flex-wrap gap-2 items-center basis-full" on:pointerup={()=> showAttributeList = true}>
        {#if $currData.attributes.length>0}      
          {#each $currData.attributes as item, i (item.id)}
            <span class="select-none" on:pointerup|stopPropagation={()=> $currData.attributes = deleteFromFieldArray($currData.attributes, item.id)}>{item.dis}</span>
          {/each}
        {:else}
          <div class="font-bold text-green-600 select-none">Attributes</div> 
        {/if}
      </div>
      
      <div class="basis-full items-center" on:pointerup={()=> showEditorNotes = true}>
        {#if $currData.note}
          <div class="select-none basis-full">{$currData.note}</div>
        {:else}
          <div class="font-bold basis-full text-green-600 select-none">Note</div> 
        {/if}
      </div>

      <div class="flex flex-wrap gap-2 basis-full items-center" on:pointerup={()=> showObserverList = true}>  
        {#if $currData.observer.length>0}     
          <span class="select-none">{$currData.observer.map(f=>f.nam).join(', ')}</span>
        {:else}
          <div class="font-bold text-red-600 mr-2 select-none">Observer</div> 
        {/if}
      </div>

      <div class="flex flex-wrap basis-full items-center">   
        {#if $currData.files.length>0}  
          {#each $currData.files as item, i (item.id)}
            <span class="select-none" on:pointerup={()=> $currData.files = deleteFromFieldArray($currData.files, item.id)}>{item.nam}</span>
          {/each}  
        {:else}
          <div class="font-bold text-green-600 select-none">Files</div> 
        {/if}          
      </div>

      <div class="flex flex-wrap basis-full items-center">
        {#if $currData.geometry.id}
          <div class="select-none font-bold basis-full" on:pointerup={()=>showEditor = false}>{$currData.geometry.type} ({$currData.geometry.id})</div>
        {:else}
          <div class="font-bold basis-full text-red-600 select-none">Geo</div> 
        {/if}
      </div>
      

    </div>

  </div>
</Modal>