<script>
  import { base } from '$app/paths';
  import Calendar from "$lib//Calendar.svelte";
  import {currDate} from "$lib/store"

  let showCalendar = false;


</script>

<div class="flex justify-between items-center bg-lime-400 p-2">
  <nav class="flex items-center gap-2 bg-lime-400 border-green-700">
    <a class="border border-slate-500 rounded-md py-1 px-2 bg-yellow-400 font-semibold text-lg" href="{base}/">Home</a>
    <a class="border border-slate-500 rounded-md py-1 px-2 bg-yellow-400 font-semibold text-lg" href="{base}/map">Map</a>
  </nav>
  <div class="text-xl font-bold border border-slate-500 rounded-md py-1 px-2 bg-yellow-400" on:pointerup={()=>showCalendar = true}>{$currDate}</div>
</div>
<Calendar
  bind:showCalendar
  bind:calDate={$currDate}
/>