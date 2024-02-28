<script>
  import {currDate} from "./store"
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


  const curData = {
    id: null,
    date: {dat: {$currDate}},
    taxon: null,
    attributes: [],
    note: "",
    place: null,
    observer: [],
    files: [],
    reference: [],
    geometry: {
      type: null,
      coordinates: []
    }
  }

  const newData = {
    type: "Feature",
    "properties": {
      data: {
        id: null,
        date: {dat: {$currDate}},
        taxon: null,
        attributes: [],
        note: "",
        place: null,
        observer: [],
        files: [],
        reference: []
      },
      type: 1,
    },
    "geometry": {
      "type": "Point",
      "coordinates": [19.035544,47.386432]
    }
  }

  const addAttribute = ()=> {
    let res = null;
    let idx;
    let s = searchText.trim();

    idx = attributes.findIndex(d=> (s===d.abr && d.rep === null) || (s.includes(d.abr) && s.length > d.abr.length && d.rep != null));
    if(idx>-1){
      res = attributes[idx];
      res.value =  res.rep === null ? null : s.replace(res.abr,"");
      res.dis = res.rep === null ? res.nam : res.rep.replace("*", s.replace(res.abr,""));
      curData.attributes = curData.attributes.filter(f=> f.id !=res.id);
      curData.attributes.push(res);
      curData.attributes = curData.attributes.sort((a, b) => a.ord-b.ord);
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
      curData.taxon = birds[idx];
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
    curData.taxon = e.detail;
    showTaxonList = false;
  }

  const submitAttributeList = (e)=>{
    console.log(JSON.stringify(e.detail));
    /*let res = e.detail.filter(f=> f.rep === null || (f.rep != null && f.value != null))
    console.log(JSON.stringify(res));

    res.map(f=> f.dis = f.rep === null ? f.nam : f.rep.replace("*", f.value.replace(f.abr,"")));
    console.log(JSON.stringify(res));*/
    //curData.attributes = res;
    curData.attributes = e.detail;
  }
  
  const submitObserverList = (e)=>{
    curData.observer = e.detail.sort((a, b) => a.nam.localeCompare(b.nam, 'hu'));
    //curData.observer = curData.observer.sort((a, b) => a.nam.localeCompare(b.nam, 'hu'));
    console.log(JSON.stringify(curData.observer));
  }

  const submit = ()=> {
    //console.log(JSON.stringify(curData));
    showEditor = false;
    curData.taxon = null;
    curData.attributes = [];
    curData.note = null;
    curData.files = [];
  }

</script>
  
<Modal
  bind:showModal = {showEditor} 
  modalClass = "taxon_editor" 
  backdropClasses = "items-start z-2000"
  mainClasses = "gap-2 w-full mt-1.5"
>
  <TaxonList
    bind:showTaxonList
    source = {birds}
    on:submit = {submitTaxonList}
  />

  <AttributeList
    bind:showAttributeList
    source = {attributes}
    on:submit = {submitAttributeList}
  />

  <TaxonNotes
    bind:showEditorNotes
    source = {curData.note}
    placeHolder = "Notes"
    on:submit={(e)=>curData.note = e.detail}
  />

  <ObserverList
    bind:showObserverList
    source = {observers}
    result = {curData.observer}
    on:submit = {submitObserverList}
  />

  <div class="flex flex-col p-2 gap-2 w-full max-h-[70vh] border-slate-500 border-2 rounded-sm text-xl text-left font-normal">
    <div class="flex gap-2 items-center">
      <input
        class="bg-yellow-200 focus:bg-yellow-300 border-2 border-slate-500 rounded-md px-2 py-1 m-0 w-[75%] h-auto" 
        type="text" 
        on:keydown|stopPropagation = {(e)=> promptSpace(e)}
        use:focus
        bind:value = {searchText}
        bind:this={promptRef}
      >
      <button 
        class="border-slate-500 border-2 rounded-md px-2 py-1 text-center bg-yellow-400 grow" on:pointerup = {submit}>
        <!--img src={'images/edit.svg'} alt="No" class="w-auto h-auto"-->Submit
      </button>
    </div>

    <div class="flex flex-wrap w-full gap-2 divide-y divide-gray-400 content-start items-start bg-yellow-100 h-full p-2 border-slate-500 border-2 rounded-md overflow-y-auto">      

      <div class="flex flex-wrap basis-full" on:pointerup={()=> showTaxonList = true}>
        {#if curData.taxon}
          <span 
            class="font-bold mr-2 select-none"
            on:pointerup|stopPropagation={()=>curData.taxon = null}
          >{curData.taxon.hun}</span>
          <span
            class="italic mr-2 select-none"
            on:pointerup|stopPropagation={()=>curData.taxon = null}
          >{curData.taxon.ltn}</span>
        {:else}
          <div class="font-bold text-green-600 mr-2 select-none">Taxon</div> 
        {/if}
      </div>

      <div class="flex flex-wrap basis-full" on:pointerup={()=> showAttributeList = true}>
        {#if curData.attributes.length>0}      
          {#each curData.attributes as item, i (item.id)}
            <span
              class="mr-2 select-none" 
              on:pointerup|stopPropagation={()=> curData.attributes = deleteFromFieldArray(curData.attributes, item.id)}
            >{item.dis}</span>
          {/each}
        {:else}
          <div class="font-bold text-green-600 mr-2 select-none">Attributes</div> 
        {/if}
      </div>
      
      <div class="flex flex-wrap basis-full" on:pointerup={()=> showEditorNotes = true}>
        {#if curData.note}
          <div class="mr-2 select-none basis-full">{curData.note}</div>
        {:else}
          <div class="font-bold basis-full text-green-600 mr-2 select-none">Note</div> 
        {/if}
      </div>

      <div class="flex flex-wrap basis-full" on:pointerup={()=> showObserverList = true}>  
        {#if curData.observer.length>0}     
          {#each curData.observer as item, i (item.id)}
            <span class="mr-2 select-none" on:pointerup|stopPropagation={()=> curData.observer = deleteFromFieldArray(curData.observer, item.id)}>{item.nam}</span>
          {/each} 
        {:else}
          <div class="font-bold text-red-600 mr-2 select-none">Observer</div> 
        {/if}
      </div>

      <div class="flex flex-wrap basis-full">   
        {#if curData.files.length>0}  
          {#each curData.files as item, i (item.id)}
            <span class="mr-2 select-none" on:pointerup={()=> curData.files = deleteFromFieldArray(curData.files, item.id)}>{item.nam}</span>
          {/each}  
        {:else}
          <div class="font-bold text-green-600 mr-2 select-none">Files</div> 
        {/if}          
      </div>

      {#if newData.geometry.type}
        <div class="mr-2 select-none font-bold basis-full" on:pointerup={()=>showEditor = false}>{newData.geometry.type}</div>
      {:else}
        <div class="font-bold basis-full text-red-600 mr-2 select-none">Geo</div> 
      {/if}
      

    </div>

  </div>
</Modal>