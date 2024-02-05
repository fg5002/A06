<script>
  import Calendar from "./Calendar.svelte";
  import TimePicker from "./TimePicker.svelte";
  import Modal from "./Modal.svelte";
  import BigModal from "./BigModal.svelte";
  
  export let showEditor = false;

  let currDate = new Date().toISOString().split('T')[0]
  let showCalendar = false;
  
  const toggleCalendar = ()=> showCalendar=!showCalendar;
  
  const focus = (node)=>  node.focus();

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

</script>
  
<BigModal bind:showBigModal={showEditor} bgClass=taxon position=start>
  <Calendar
    bind:showCalendar
    bind:calDate={currDate}
  />
  <div class="flex flex-col gap-2 h-[50vh] bg-transparent rounded-md">
    <div class="flex gap-2 bg-transparent">
      <div class="text-center text-2xl font-bold text-justify-center py-1">
        {currDate}
      </div>
      <button 
        class="border-slate-500 border-2 rounded-md px-2 py-1 text-center bg-yellow-400" 
        on:click={toggleCalendar}
        >
        <img src={'images/edit.svg'} alt="No" class="w-auto h-auto">
      </button>
    </div>
    <div class="flex flex-wrap gap-2 content-start items-start bg-yellow-100 h-full p-4 text-lg text-left border-slate-500 border-2 rounded-md overflow-y-auto">
      <span class="mr-2 select-none bg-red-300" on:pointerup={()=>alert('Taxon')}><b>Cserregő nádiposzáta</b> (Acrocephalus scirpaceus)</span>
      <span class="mr-2 select-none bg-red-300" on:pointerup={()=>alert('Ad')}>2ad</span>
      <span class="mr-2 select-none bg-red-300" on:pointerup={()=>alert('Juv')}>3juv</span>
      <span class="mr-2 select-none bg-red-300" on:pointerup={()=>alert('Note')}>Run on the field.</span>
      <span class="mr-2 select-none bg-red-300 text-black" on:pointerup={()=>alert('observer')}>Wintermann Eleonóra Lujza, Kolozsvári Grandpierre Emil</span>
    </div>
    <input 
      class="bg-yellow-200  focus:bg-yellow-300 border-2 border-zinc-500 rounded-md px-2 py-1 m-0 text-left text-lg w-[75%]" 
      type="text" 
      on:keypress={promptSpace}
      use:focus
    >
  </div>
</BigModal>