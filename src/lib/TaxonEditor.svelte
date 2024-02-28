<script>
  import Calendar from "./Calendar.svelte";
  import TimePicker from "./TimePicker.svelte";
  import Modal from "./Modal.svelte";
  import {birds} from "./birds"
  import TaxonList from "./TaxonList.svelte";
	import AttributeList from "./AttributeList.svelte";
  import ObserverList from "./ObserverList.svelte";
  import TaxonNotes from "./TaxonNotes.svelte";

  export let showEditor = false;

  let currDate = new Date().toISOString().split('T')[0]
  let showCalendar = false;
  let showTaxonList = false;
  let showAttributeList = false;
  let showObserverList = false;
  let showEditorNotes = false
  let searchText = "";
  let promptRef = null;

  const toggleCalendar = ()=> showCalendar=!showCalendar;
  
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
    {id: 1, nam: "Jim Cooper"},
    {id: 2, nam: "Dave jenkins"},
    {id: 3, nam: "Chuck Youngblood"},
    {id: 4, nam: "Chuck Norris"},
    {id: 5, nam: "Captain Sparrow"},
    {id: 6, nam: "Lord Nelson"},
    {id: 7, nam: "Atahutalpa"},
    {id: 8, nam: "James Cook"},
    {id: 9, nam: "Johnny Bravo"},
    {id: 10, nam: "Kiss Péter"}, 
    {id: 11, nam: "Nagy Pál"}
  ]

  const tags = [
    {"id": 1, "abr": "x", "nam": "taxon", "rep": "*", "ord": 11, "value": null},
    {"id": 2, "abr": "lp", "nam": "lepke", "rep": null, "ord": 22, "value": null},
    {"id": 3, "abr": "bog", "nam": "bogár", "rep": null, "ord": 22, "value": null},
    {"id": 4, "abr": "lgy", "nam": "légy", "rep": null, "ord": 22, "value": null},
    {"id": 5, "abr": "dar", "nam": "darázs", "rep": null, "ord": 22, "value": null},
    {"id": 6, "abr": "pol", "nam": "poloska", "rep": null, "ord": 22, "value": null},
    {"id": 7, "abr": "pok", "nam": "pók", "rep": null, "ord": 22, "value": null},
    {"id": 8, "abr": "rov", "nam": "rovar", "rep": null, "ord": 22, "value": null},
    {"id": 9, "abr": "pd", "nam": "példány", "rep": "*pd", "ord": 31, "value": null},
    {"id": 10, "abr": "hm", "nam": "hím", "rep": "*h", "ord": 32, "value": null},
    {"id": 11, "abr": "ns", "nam": "nőstény", "rep": "*n", "ord": 33, "value": null},
    {"id": 12, "abr": "ad", "nam": "adult", "rep": "*ad", "ord": 34, "value": null},
    {"id": 13, "abr": "jv", "nam": "juvenilis", "rep": "*juv", "ord": 35, "value": null},
    {"id": 14, "abr": "sub", "nam": "subadult", "rep": "*sub", "ord": 36, "value": null},
    {"id": 15, "abr": "im", "nam": "immature", "rep": "*imm", "ord": 37, "value": null},
    {"id": 16, "abr": "pu", "nam": "pullus", "rep": "*pull", "ord": 38, "value": null},
    {"id": 17, "abr": "tj", "nam": "tojás", "rep": "* tojás", "ord": 39, "value": null},
    {"id": 18, "abr": "nh", "nam": "néhány pd", "rep": null, "ord": 41, "value": null},
    {"id": 19, "abr": "tb", "nam": "több pd", "rep": null, "ord": 42, "value": null},
    {"id": 20, "abr": "rk", "nam": "ritka", "rep": null, "ord": 43, "value": null},
    {"id": 21, "abr": "sz", "nam": "szórványos", "rep": null, "ord": 44, "value": null},
    {"id": 22, "abr": "gy", "nam": "gyakori", "rep": null, "ord": 45, "value": null},
    {"id": 23, "abr": "tm", "nam": "tömeges", "rep": null, "ord": 46, "value": null},
    {"id": 24, "abr": "tbf", "nam": "többfelé", "rep": null, "ord": 47, "value": null},
    {"id": 25, "abr": "mdf", "nam": "mindenfelé", "rep": null, "ord": 48, "value": null},
    {"id": 26, "abr": "elf", "nam": "előfordul", "rep": null, "ord": 49, "value": null},
    {"id": 27, "abr": "fsz", "nam": "fészek", "rep": null, "ord": 51, "value": null},
    {"id": 28, "abr": "nym", "nam": "nyom", "rep": null, "ord": 51, "value": null},
    {"id": 29, "abr": "flt", "nam": "folt", "rep": null, "ord": 51, "value": null},
    {"id": 30, "abr": "dg", "nam": "dög", "rep": null, "ord": 51, "value": null},
    {"id": 31, "abr": "kcs", "nam": "közös csapatban", "rep": null, "ord": 51, "value": null},
    {"id": 32, "abr": "tbc", "nam": "több csapatban", "rep": null, "ord": 51, "value": null},
    {"id": 33, "abr": "fe", "nam": "irány", "rep": "*-felé", "ord": 51, "value": null},
    {"id": 34, "abr": "en", "nam": "ének", "rep": null, "ord": 61, "value": null},
    {"id": 35, "abr": "hg", "nam": "hang", "rep": null, "ord": 61, "value": null},
    {"id": 36, "abr": "chg", "nam": "csak hang", "rep": null, "ord": 61, "value": null},
    {"id": 37, "abr": "ri", "nam": "riaszt", "rep": null, "ord": 61, "value": null},
    {"id": 38, "abr": "at", "nam": "átrepülő", "rep": null, "ord": 61, "value": null},
    {"id": 39, "abr": "vr", "nam": "virágzik", "rep": null, "ord": 61, "value": null},
    {"id": 40, "abr": "ell", "nam": "ellenőrizendő", "rep": null, "ord": 71, "value": null},
    {"id": 41, "abr": "kt", "nam": "kétes", "rep": null, "ord": 71, "value": null},
    {"id": 42, "abr": "ft", "nam": "fotó", "rep": null, "ord": 71, "value": null},
    {"id": 43, "abr": "fh", "nam": "fotóról határozva", "rep": null, "ord": 71, "value": null},
    {"id": 44, "abr": "idp", "nam": "időpont", "rep": "*", "ord": 71, "value": null},
    {"id": 45, "abr": "kez", "nam": "kezdés", "rep": "*", "ord": 71, "value": null},
    {"id": 46, "abr": "bef", "nam": "befejezés", "rep": "*", "ord": 71, "value": null},
    {"id": 47, "abr": "bir", "nam": "birding.hu", "rep": "birding.hu/*", "ord": 81, "value": null},
    {"id": 48, "abr": "ize", "nam": "izeltlabuak.hu", "rep": "izeltlabuak.hu/*", "ord": 81, "value": null},
    {"id": 49, "abr": "hdb", "nam": "herbárium doboz", "rep": "*hdb", "ord": 81, "value": null},
    {"id": 50, "abr": "hno", "nam": "herbárium szám", "rep": "*hno", "ord": 81, "value": null}
  ]
  
  /*
  Fekete gólya (Ciconia nigra)
  3pd átrepülő dk-felé
  https://www.google.com/maps/search/?api=1&query=47.5,19.25
  */


  const curData = {
    id: null,
    date: {dat: {currDate}, id: 345},
    taxon: {id: 839, hun: 'Fekete rigó', ltn: 'Turdus merula', abr: 'feri,fkri,fkrg', mon: '333333333333'},
    attributes: [],
    note: "",
    place: {nam: "Háros-sziget, Budafok", id: 125877},
    observer: [
      {id: 10, nam: "Kiss Péter"}, 
      {id: 11, nam: "Nagy Pál"}
    ],
    files: [
      {nam: "0240208-0012.jpg", id: 2},          
      {nam: "20240208-0014.jpg", id: 5},          
      {nam: "20240208-0025.jpg", id: 96},    
    ],
    reference: [
      {nam: "Adatok Budapest flórájához I (2019)", id: 41},
      {nam: "Adatok Budapest flórájához II (2021)", id: 45}
    ]
  }

  const newData = {
    type: "Feature",
    "properties": {
      ord: 25,
      data: {
        id: null,
        date: {dat: {currDate}, id: 345},
        taxon: {id: 839, hun: 'Fekete rigó', ltn: 'Turdus merula', abr: 'feri,fkri,fkrg', mon: '333333333333'},
        attributes: [],
        note: "",
        place: {nam: "Háros-sziget, Budafok", id: 125877},
        observer: [
          {id: 10, nam: "Kiss Péter"}, 
          {id: 11, nam: "Nagy Pál"}
        ],
        files: [
          {nam: "0240208-0012.jpg", id: 2},          
          {nam: "20240208-0014.jpg", id: 5},          
          {nam: "20240208-0025.jpg", id: 96},    
        ],
        reference: [
          {nam: "Adatok Budapest flórájához I (2019)", id: 41},
          {nam: "Adatok Budapest flórájához II (2021)", id: 45}
        ]
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

    idx = tags.findIndex(d=> (s===d.abr && d.rep === null) || (s.includes(d.abr) && s.length > d.abr.length && d.rep != null));
    if(idx>-1){
      res = tags[idx];
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
    if (e.code == 'Space') {
      addAttribute();
      searchText = '';
    }
    if (e.code == 'Enter') {
      submit();
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
  mainClasses = "gap-2 w-full"
>
  <Calendar
    bind:showCalendar
    bind:calDate={currDate}
  />

  <TaxonList
    bind:showTaxonList
    source = {birds}
    on:submit = {submitTaxonList}
  />

  <AttributeList
    bind:showAttributeList
    source = {tags}
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

  <div class="flex flex-col p-2 gap-2 w-full max-h-[65vh] border-slate-500 border-2 rounded-sm">
    <div class="flex gap-2">
      <input 
        class="bg-yellow-200  focus:bg-yellow-300 border-2 border-zinc-500 rounded-md px-2 py-1 m-0 text-left text-lg w-[75%]" 
        type="text" 
        on:keydown|stopPropagation = {promptSpace}
        use:focus
        bind:value = {searchText}
        bind:this={promptRef}
      >
      <button 
        class="border-slate-500 border-2 rounded-md px-2 py-1 text-center bg-yellow-400" on:pointerup = {submit}>
        <!--img src={'images/edit.svg'} alt="No" class="w-auto h-auto"-->Submit
      </button>
      <button 
        class="border-slate-500 border-2 rounded-md px-2 py-1 text-center bg-yellow-400"on:click={()=> showEditorNotes = true}>List
      </button>
    </div>

    <div class="flex flex-wrap w-full gap-2 divide-y divide-gray-400 content-start items-start bg-yellow-100 h-full p-2 text-lg text-left border-slate-500 border-2 rounded-md overflow-y-auto">      

      {#if currDate != null}
        <div class="font-bold mr-2 text-lime-700 text-xl select-none basis-full text-right mb-2" on:pointerup={toggleCalendar}>{currDate}</div>
      {:else}
        <div class="font-bold text-xl basis-full text-red-600 mr-2 select-none" on:pointerup={toggleCalendar}>Date</div> 
      {/if}

      <div class="flex flex-wrap basis-full" on:pointerup={()=> showTaxonList = true}>
        {#if curData.taxon}
          <span 
            class="font-bold text-xl mr-2 select-none"
            on:pointerup|stopPropagation={()=>curData.taxon = null}
          >{curData.taxon.hun}</span>
          <span
            class="italic mr-2 select-none"
            on:pointerup|stopPropagation={()=>curData.taxon = null}
          >{curData.taxon.ltn}</span>
        {:else}
          <div class="font-bold text-xl text-green-600 mr-2 select-none">Taxon</div> 
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
          <div class="font-bold text-xl text-green-600 mr-2 select-none">Attributes</div> 
        {/if}
      </div>
      
      <div class="flex flex-wrap basis-full" on:pointerup={()=> showEditorNotes = true}>
        {#if curData.note}
          <div class="mr-2 select-none basis-full">{curData.note}</div>
        {:else}
          <div class="font-bold text-xl basis-full text-green-600 mr-2 select-none">Note</div> 
        {/if}
      </div>

      <div class="flex flex-wrap basis-full" on:pointerup={()=> showObserverList = true}>  
        {#if curData.observer.length>0}     
          {#each curData.observer as item, i (item.id)}
            <span class="mr-2 select-none" on:pointerup|stopPropagation={()=> curData.observer = deleteFromFieldArray(curData.observer, item.id)}>{item.nam}</span>
          {/each} 
        {:else}
          <div class="font-bold text-xl text-red-600 mr-2 select-none">Observer</div> 
        {/if}
      </div>

      <div class="flex flex-wrap basis-full">   
        {#if curData.files.length>0}  
          {#each curData.files as item, i (item.id)}
            <span class="mr-2 select-none" on:pointerup={()=> curData.files = deleteFromFieldArray(curData.files, item.id)}>{item.nam}</span>
          {/each}  
        {:else}
          <div class="font-bold text-xl text-green-600 mr-2 select-none">Files</div> 
        {/if}          
      </div>

      {#if newData.geometry.type}
        <div class="mr-2 select-none font-bold basis-full" on:pointerup={()=>showEditor = false}>{newData.geometry.type}</div>
      {:else}
        <div class="font-bold text-xl basis-full text-red-600 mr-2 select-none">Geo</div> 
      {/if}
      

    </div>

  </div>
</Modal>