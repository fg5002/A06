<script>
  import { createEventDispatcher } from 'svelte';
  import ListSelect, {inputField} from "./ListSelect.svelte";

  export let showAttributeList = false;
  export let source = [];
  export let result = [];

  let inputAttribute = null;
  let edit = false;

  const dispatch = createEventDispatcher();

  const attributeFocus = async(node)=>{
    await waiter(100);
    node.value = "";
    node.focus();
  }  

  const waiter = (ms)=> {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms);
    })
  }

  const editField = (e, idx)=> {
    console.log(idx)
    if (e.key == 'Enter' && e.target.id === idx) {
      result[idx].value = e.target.value;
      edit = false
      console.log('enter')
      inputField.value = "";
      inputField.focus();
    }
  }
  
  const select = (id)=> {
    console.log(source[id-1].nam);
    result.push(source[id-1]);
    result.sort((a, b)=> parseInt(a["ord"]) - parseInt(b["ord"]));
    inputField.value = "";
    if(source[id-1].rep !== null){
      console.log(source[id-1].nam)
      edit = true
      inputAttribute && inputAttribute.focus();
    }else{
      inputField.focus();
    }
  }
  
  const remove = (id)=>{
    result = result.filter(f=> f.id !== id)
    inputField.value = "";
    inputField.focus();
    console.log(result)
  }

  const submit = ()=> {
    console.log('ez az')
    let res = result.filter(f=> f.rep === null || (f.rep != null && f.value))
    console.log(JSON.stringify(res));

    res.map(f=> f.dis = f.rep === null ? f.nam : f.rep.replace("*", f.value.replace(f.abr,"")));
    console.log(JSON.stringify(res));
    dispatch('submitList', res);
    //newData.properties.data.attributes = res;
    result = [];

  }

</script>

<ListSelect
  bind:showSelectList ={showAttributeList}
  source = {source}
  minChars = {1}
  placeHolder = "Attributes"
  filterList = {(f,s)=> f.nam.includes(s) === true || f.abr === s}
  multi = {true}
  result = {result}
  searchText = {inputField && inputField.value}
  on:selectFirstItem = {(e)=> select(e.detail)}
>
  <div slot="item" let:item class="p-1" on:pointerup|preventDefault={select(item.id)}>
    <span class="font-bol p-2">{item.nam}</span>
  </div>

  <div slot="result" let:item let:i class="p-1 flex justify-between items-center">
    <span class="font-bold p-2 bg-lime-300 grow" on:pointerdown={remove(item.id)}>{item.nam}</span>
    {#if item.rep !== null}
      {#if edit}
        <input 
          class="id={i} bg-yellow-200 focus:bg-yellow-300 border-2 border-zinc-500 rounded-sm px-2 py-1 m-0 text-left w-1/2" 
          type="text"
          id = {item.id}
          value = {item.value}
          on:input|stopPropagation|preventDefault={(e)=>item.value = e.target.value}
          on:keydown|stopPropagation = {(e)=> editField(e, i)}
          bind:this={inputAttribute}
          use:attributeFocus
        >
      {:else}
        <span class="font-bold w-1/2 p-2 bg-blue-200">{item.value}</span>
      {/if}
    {/if}
  </div>
</ListSelect>