<script>
  import { base } from '$app/paths';
  import Calendar from "$lib//Calendar.svelte";
  import {currDate} from "$lib/store"

  let showCalendar = false;


</script>

<div class="flex justify-between items-center bg-lime-300 p-2 border-b border-slate-500 font-semibold">
  <nav class="flex items-center gap-4 text-lg">
    <a href="{base}/">Home</a>
    <a href="{base}/map">Map</a>
  </nav>
  <div class="text-lg" on:pointerup={()=>showCalendar = true}>{$currDate}</div>
</div>
<Calendar
  bind:showCalendar
  bind:calDate={$currDate}
/>