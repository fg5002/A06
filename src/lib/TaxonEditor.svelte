<script>
  import Calendar from "./Calendar.svelte";
  import TimePicker from "./TimePicker.svelte";
  import Modal from "./Modal.svelte";
  import ListSelect from "./ListSelect.svelte";


  export let showEditor = false;

  let currDate = new Date().toISOString().split('T')[0]
  let showCalendar = false;
  let showSelectList = false;
  
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
    {"name": "Példány", "id": 1, "reg": /(^[\d-+]+$)/, "rep": '$1pd'},
    {"name": "Hím", "id": 2, "reg": /(^[\d-+]+)h$/, "rep": '$1h'},
    {"name": "Nőstény", "id": 3, "reg": /(^[\d-+]+)n|t$/, "rep": '$1n'},
    {"name": "Adult", "id": 4, "reg": /(^[\d-+]+)a$/, "rep": '$1ad'},
    {"name": "Juvenilis", "id": 5, "reg": /(^[\d-+]+)j$/, "rep": '$1juv'},
    {"name": "Immature", "id": 6, "reg": /(^[\d-+]+)i$/, "rep": '$1imm'},
    {"name": "Subadult", "id": 7, "reg": /(^[\d-+]+)s$/, "rep": '$1subad'},
    {"name": "Pullus", "id": 8, "reg": /(^[\d-+]+)p$/, "rep": '$1pull'},
    {"name": "Fotó", "id": 9, "reg": /^f$/, "rep": 'fotó'},
    {"name": "Átrepülő", "id": 10, "reg": /^(a|á)$/, "rep": 'átrepülő'},
    {"name": "Ének", "id": 11, "reg": /^e|é$/, "rep": 'ének'},
    {"name": "Csak hang", "id": 12, "reg": /^h$/, "rep": 'csak hang'},
    {"name": "Riaszt", "id": 13, "reg": /^r$/, "rep": 'riaszt'},
    {"name": "Flos", "id": 13, "reg": /^vi|fl$/, "rep": 'virágzik'},
    {"name": "Note", "id": 13, "reg": /^[\/|\&|\@|,|.]+(.*)$/, "rep": '$1'},
    {"name": "Taxon", "id": 13, "reg": /^([a-z]{4})$/, "rep": '$1'},
    {"name": "X", "id": 13, "reg": /^j$/, "rep": 'járókelő'},
  ]


  const newData = {
    type: "Feature",
    "properties": {
      row: 25,
      data:{
        id: null,
        date: {
          disp: "2023-12-12", 
          dat: "2023-12-12", 
          id: 345
        },
        taxon: {
          disp: "Feketerigó (Turdus merula)",
          id: 2155
        },
        attributes: {
          disp: "20+pd, 3n, átrepülő, fotó",
          value: ["20+", "2-3", null, null],
          id: [1, 3, 10, 9]
        },
        note: "Kék az ég",
        place:{
          disp: "Háros-sziget, Budafok",
          id: 125877
        },
        observer: {
          disp: "Kiss Péter, Nagy Pál",
          id: [66, 45], 
        },
        media: {
          disp: "20220510-012.jpg, 20220510-013.jpg, 20220510-105.wma",
          id: [12, 13, 16]
        },
        reference: {
          disp: "Adatok Budapest flórájához I (2019), Adatok Budapest flórájához II (2021)",
          id: [41, 45]
        }
      },
      type: 1,
    },
    "geometry": {
      "type": "Point",
      "coordinates": [19.035544,47.386432]
    }
  }

  const selectedTags = [
    {"id": 1, "Value": "2-3"},
    {"id": 2, "Value": "1"},
    {"id": 3, "Value": "1-2"},
    {"id": 9, "Value": null},
    {"id": 10, "Value": null}
  ]

  const findTag = (s)=>{
    tags.forEach(d=>{
      let z = s.trim().match(d.reg)
      if(z){
        let val = z[1]
        let res = s.trim().replace(d.reg, d.rep)
        console.log(res)
        let x = d.rep.replace(/\$1/,val);
        console.log('x', x)
      } 
    })
  }

  const promptSpace = (e)=>{
    if (e.keyCode == 32) {
      findTag(e.target.value);
      e.target.value="";
    }
  }

  const submitList = (e)=>{
    alert(e.detail.join(', '));
  }

</script>
  
<Modal
  bind:showModal = {showEditor} 
  modalClass = "taxon_editor" 
  backdropClasses = "items-start z-2000"
  mainClasses = " gap-2"
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

  <div class="flex flex-col p-2 gap-2 w-full max-h-[50vh] border-slate-500 border-2 rounded-sm">
    <div class="flex gap-2">
      <div class="text-center text-2xl font-bold text-justify-center py-1">
        {currDate}
      </div>
      <button 
        class="border-slate-500 border-2 rounded-md px-2 py-1 text-center bg-yellow-400" 
        on:click={toggleCalendar}
        >
        <img src={'images/edit.svg'} alt="No" class="w-auto h-auto">
      </button>
      <button 
        class="border-slate-500 border-2 rounded-md px-2 py-1 text-center bg-yellow-400" 
        on:click={()=>showSelectList = true}
        >
        <img src={'images/edit.svg'} alt="No" class="w-auto h-auto">
      </button>
    </div>
    <input 
      class="bg-yellow-200  focus:bg-yellow-300 border-2 border-zinc-500 rounded-md px-2 py-1 m-0 text-left text-lg w-[75%]" 
      type="text" 
      on:keypress={promptSpace}
      use:focus
    >
    <div class="flex flex-col gap-2 content-start items-start bg-yellow-100 h-full p-2 text-lg text-left border-slate-500 border-2 rounded-md overflow-y-auto">      
      <div class="flex flex-wrap gap-2 select-none">
        <span class=" font-bold" on:pointerup={()=>alert('Taxon')}>Cserregő nádiposzáta</span>
        <span class="italic">Acrocephalus scirpaceus</span>
      </div>
      <div class="flex flex-wrap gap-2 select-none">
        <span on:pointerup={()=>alert('Ad')}>2ad</span>
        <span on:pointerup={()=>alert('Juv')}>3juv</span>
      </div>  
      <span class="mr-2 select-none" on:pointerup={()=>alert('Note')}>Runs on the field href is an attribute used to define the target of the link. The right attribute to use for click-triggered events is onclick.</span>
      <span class="mr-2 select-none" on:pointerup={()=>alert('observer')}>Wintermann Eleonóra Lujza, Kolozsvári Grandpierre Emil</span>
    </div>

  </div>
</Modal>