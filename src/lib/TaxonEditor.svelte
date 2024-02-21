<script>
  import Calendar from "./Calendar.svelte";
  import TimePicker from "./TimePicker.svelte";
  import Modal from "./Modal.svelte";
  import ListSelect from "./ListSelect.svelte";
  import TaxonList from "./TaxonList.svelte";
  import {birds} from "./birds"


  export let showEditor = false;

  let currDate = new Date().toISOString().split('T')[0]
  let showCalendar = false;
  let showSelectList = false;
  let showTaxonList = false;
  let searchText = "";
  
  const toggleCalendar = ()=> showCalendar=!showCalendar;
  
  const focus = async(node)=>{
    await waiter(500);
    node.focus();
  }  

  const waiter = (ms)=> {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms);
    })
  }

  const fruits = "alma, körte, szilva, ürge, kajszi, naspolya, édesburgonya, málna, dió, mogyoró, árpa, berkenye, meggy, ribizke, egres, mandula, cseresznye".split(', ');

  const tags = [
    {"id": 1, "abr": "x", "nam": "taxon", "rep": "*", "ord": 11},
    {"id": 2, "abr": "lp", "nam": "lepke", "rep": null, "ord": 22},
    {"id": 3, "abr": "bog", "nam": "bogár", "rep": null, "ord": 22},
    {"id": 4, "abr": "lgy", "nam": "légy", "rep": null, "ord": 22},
    {"id": 5, "abr": "dar", "nam": "darázs", "rep": null, "ord": 22},
    {"id": 6, "abr": "pol", "nam": "poloska", "rep": null, "ord": 22},
    {"id": 7, "abr": "pok", "nam": "pók", "rep": null, "ord": 22},
    {"id": 8, "abr": "rov", "nam": "rovar", "rep": null, "ord": 22},
    {"id": 9, "abr": "p", "nam": "példány", "rep": "*pd", "ord": 31},
    {"id": 10, "abr": "h", "nam": "hím", "rep": "*h", "ord": 32},
    {"id": 11, "abr": "n", "nam": "nőstény", "rep": "*n", "ord": 33},
    {"id": 12, "abr": "ad", "nam": "adult", "rep": "*ad", "ord": 34},
    {"id": 13, "abr": "jv", "nam": "juvenilis", "rep": "*juv", "ord": 35},
    {"id": 14, "abr": "sub", "nam": "subadult", "rep": "*sub", "ord": 36},
    {"id": 15, "abr": "im", "nam": "immature", "rep": "*imm", "ord": 37},
    {"id": 16, "abr": "pu", "nam": "pullus", "rep": "*pull", "ord": 38},
    {"id": 17, "abr": "tj", "nam": "tojás", "rep": "* tojás", "ord": 39},
    {"id": 18, "abr": "nh", "nam": "néhány pd", "rep": null, "ord": 41},
    {"id": 19, "abr": "tb", "nam": "több pd", "rep": null, "ord": 42},
    {"id": 20, "abr": "rk", "nam": "ritka", "rep": null, "ord": 43},
    {"id": 21, "abr": "sz", "nam": "szórványos", "rep": null, "ord": 44},
    {"id": 22, "abr": "gy", "nam": "gyakori", "rep": null, "ord": 45},
    {"id": 23, "abr": "tm", "nam": "tömeges", "rep": null, "ord": 46},
    {"id": 24, "abr": "tbf", "nam": "többfelé", "rep": null, "ord": 47},
    {"id": 25, "abr": "mdf", "nam": "mindenfelé", "rep": null, "ord": 48},
    {"id": 26, "abr": "elf", "nam": "előfordul", "rep": null, "ord": 49},
    {"id": 27, "abr": "fsz", "nam": "fészek", "rep": null, "ord": 51},
    {"id": 28, "abr": "nym", "nam": "nyom", "rep": null, "ord": 51},
    {"id": 29, "abr": "flt", "nam": "folt", "rep": null, "ord": 51},
    {"id": 30, "abr": "dg", "nam": "dög", "rep": null, "ord": 51},
    {"id": 31, "abr": "kcs", "nam": "közös csapatban", "rep": null, "ord": 51},
    {"id": 32, "abr": "tbc", "nam": "több csapatban", "rep": null, "ord": 51},
    {"id": 33, "abr": "fe", "nam": "irány", "rep": "*-felé", "ord": 51},
    {"id": 34, "abr": "en", "nam": "ének", "rep": null, "ord": 61},
    {"id": 35, "abr": "hg", "nam": "hang", "rep": null, "ord": 61},
    {"id": 36, "abr": "chg", "nam": "csak hang", "rep": null, "ord": 61},
    {"id": 37, "abr": "ri", "nam": "riaszt", "rep": null, "ord": 61},
    {"id": 38, "abr": "at", "nam": "átrepülő", "rep": null, "ord": 61},
    {"id": 39, "abr": "vr", "nam": "virágzik", "rep": null, "ord": 61},
    {"id": 40, "abr": "ell", "nam": "ellenőrizendő", "rep": null, "ord": 71},
    {"id": 41, "abr": "kt", "nam": "kétes", "rep": null, "ord": 71},
    {"id": 42, "abr": "f", "nam": "fotó", "rep": null, "ord": 71},
    {"id": 43, "abr": "fh", "nam": "fotóról határozva", "rep": null, "ord": 71},
    {"id": 44, "abr": "idp", "nam": "időpont", "rep": "*", "ord": 71},
    {"id": 45, "abr": "kez", "nam": "kezdés", "rep": "*", "ord": 71},
    {"id": 46, "abr": "bef", "nam": "befejezés", "rep": "*", "ord": 71},
    {"id": 47, "abr": "bir", "nam": "birding.hu", "rep": "birding.hu/*", "ord": 81},
    {"id": 48, "abr": "ize", "nam": "izeltlabuak.hu", "rep": "izeltlabuak.hu/*", "ord": 81},
    {"id": 49, "abr": "hdb", "nam": "herbárium doboz", "rep": "*hdb", "ord": 81},
    {"id": 50, "abr": "hno", "nam": "herbárium szám", "rep": "*hno", "ord": 81},
  ]

  const newData = {
    type: "Feature",
    "properties": {
      ord: 25,
      data: {
        id: null,
        date: {dat: {currDate}, id: 345},
        taxon: {hun: "Feketerigó", ltn: "Turdus merula", id: 215},
        attributes: [],
        note: "Géza kék az ég",
        place: {nam: "Háros-sziget, Budafok", id: 125877},
        observer: [
          {nam: "Kiss Péter", id: 66}, 
          {nam: "Nagy Pál", id:45}
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

    idx = tags.findIndex(d=> s === d.abr && d.rep === null);
    if(idx === -1){
      idx = tags.findIndex(d=> s.includes(d.abr) && s.length > d.abr.length && d.rep != null);
      if(idx > -1){
        res = {
          id: tags[idx].id, 
          value: s.replace(tags[idx].abr,""), 
          ord:tags[idx].ord, 
          dis: tags[idx].rep.replace("*", s.replace(tags[idx].abr,""))
        }
      }
    }else{
      res = {
        id: tags[idx].id,
        value: null,
        ord:tags[idx].ord,
        dis: tags[idx].nam
      };
    }
    if(res){
      newData.properties.data.attributes = newData.properties.data.attributes.filter(f=> f.id !=res.id);
      newData.properties.data.attributes.push(res);
      newData.properties.data.attributes = newData.properties.data.attributes.sort((a, b) => a.ord-b.ord);
    }
  }

  const deleteFromFieldArray = (z,i)=> {
    return z.filter(f=> f.id != i);
  }
  
  const addTaxon = ()=>{
    let s = searchText.trim();
    let idx = birds.findIndex(f=> f.abr.indexOf(s)>-1);
    if(idx>-1){
      newData.properties.data.taxon = birds[idx];
    }
  }

  const promptSpace = (e)=>{
    if (e.keyCode == 32) {
      searchText.trim().length<4 ? addAttribute() : addTaxon();
      searchText = "";
    }
    if (e.keyCode == 13) {
      submit();
      searchText = "";
    }
  }

  const submitList = (e)=>{
    alert(e.detail.join(', '));
  }

  const submitTaxonList = (e)=>{
    console.log(JSON.stringify(e.detail));
    newData.properties.data.taxon = e.detail;
    console.log(newData.properties.data.taxon)
  }

  const submit = ()=> {
    //console.log(JSON.stringify(newData.properties.data));
    showEditor = false;
    newData.properties.data.taxon = null;
    newData.properties.data.attributes = [];
    newData.properties.data.note = null;
    newData.properties.data.files = [];
  }

</script>
  
<Modal
  bind:showModal = {showEditor} 
  modalClass = "taxon_editor" 
  backdropClasses = "items-start z-2000"
  mainClasses = " gap-2 w-full"
>
  <Calendar
    bind:showCalendar
    bind:calDate={currDate}
  />

  <ListSelect
    source = {fruits}
    bind:showSelectList
    sorted = true
    multi = true
    on:submitList = {submitList}
  />

  <TaxonList
    source = {birds}
    bind:showTaxonList
    sorted = true
    multi = false
    on:submitList = {submitTaxonList}
  />

  <div class="flex flex-col p-2 gap-2 w-full max-h-[65vh] border-slate-500 border-2 rounded-sm">
    <div class="flex gap-2">
      <input 
        class="bg-yellow-200  focus:bg-yellow-300 border-2 border-zinc-500 rounded-md px-2 py-1 m-0 text-left text-lg w-[75%]" 
        type="text" 
        on:keypress={promptSpace}
        use:focus
        bind:value = {searchText}
      >
      <button 
        class="border-slate-500 border-2 rounded-md px-2 py-1 text-center bg-yellow-400" 
        on:pointerup = {submit}
      >
        <!--img src={'images/edit.svg'} alt="No" class="w-auto h-auto"-->
        Submit
      </button>
    </div>

    <div class="flex flex-wrap w-full gap-2 divide-y divide-gray-400 content-start items-start bg-yellow-100 h-full p-2 text-lg text-left border-slate-500 border-2 rounded-md overflow-y-auto">      

      {#if currDate != null}
        <div class="font-bold mr-2 text-lime-700 text-xl select-none basis-full text-right mb-2" on:pointerup={toggleCalendar}>{currDate}</div>
      {:else}
        <div class="font-bold text-xl basis-full text-red-600 mr-2 select-none" on:pointerup={toggleCalendar}>Date</div> 
      {/if}

      <div class="flex flex-wrap basis-full" on:pointerup={()=> showTaxonList= true}>
        {#if newData.properties.data.taxon}
          <span class="font-bold text-xl mr-2 select-none" on:pointerup|stopPropagation={()=>newData.properties.data.taxon = null}>{newData.properties.data.taxon.hun}</span>
          <span class="italic mr-2 select-none" on:pointerup|stopPropagation={()=>newData.properties.data.taxon = null}>{newData.properties.data.taxon.ltn}</span>
        {:else}
          <div class="font-bold text-xl text-green-600 mr-2 select-none">Taxon</div> 
        {/if}
      </div>

      <div class="flex flex-wrap basis-full">
        {#if newData.properties.data.attributes.length>0}      
          {#each newData.properties.data.attributes as item, i (item.id)}
            <span class="mr-2 select-none" on:pointerup={()=> newData.properties.data.attributes = deleteFromFieldArray(newData.properties.data.attributes, item.id)}>{item.dis}</span>
          {/each}
        {:else}
          <div class="font-bold text-xl text-green-600 mr-2 select-none">Attributes</div> 
        {/if}
      </div>
      
      {#if newData.properties.data.note}
        <div class="mr-2 select-none basis-full" on:pointerup={()=>newData.properties.data.note = null}>Többször is lehetett pár másodpercre látni.</div>
      {:else}
        <div class="font-bold text-xl basis-full text-green-600 mr-2 select-none">Note</div> 
      {/if}

      <div class="flex flex-wrap basis-full">  
        {#if newData.properties.data.observer.length>0}     
          {#each newData.properties.data.observer as item, i (item.id)}
            <span class="mr-2 select-none" on:pointerup={()=> newData.properties.data.observer = deleteFromFieldArray(newData.properties.data.observer, item.id)}>{item.nam}</span>
          {/each} 
        {:else}
          <div class="font-bold text-xl text-red-600 mr-2 select-none">Observer</div> 
        {/if}
      </div>

      <div class="flex flex-wrap basis-full">   
        {#if newData.properties.data.files.length>0}  
          {#each newData.properties.data.files as item, i (item.id)}
            <span class="mr-2 select-none" on:pointerup={()=> newData.properties.data.files = deleteFromFieldArray(newData.properties.data.files, item.id)}>{item.nam}</span>
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