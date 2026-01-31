<script lang="ts">
  import { selections } from "../stores/selections.svelte";

  let copied = $state(false);

  function copyToClipboard() {
    if (!selections.commandString) return;
    navigator.clipboard.writeText(selections.commandString).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 2000);
    });
  }
</script>

<div
  class="mt-auto p-2 bg-neutral-100 dark:bg-neutral-900 rounded-xl flex gap-2 min-w-0"
>
  <output
    class="flex items-center w-full p-2 pointer-coarse:px-3 bg-white dark:bg-black rounded-lg font-mono text-sm text-nowrap overflow-auto border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200"
  >
    {selections.commandString ||
      "Select some accessories to generate a command..."}
  </output>
  {#if selections.commandString}
    <button
      onclick={copyToClipboard}
      aria-label={copied
        ? "Command copied to clipboard"
        : "Copy command to clipboard"}
      class="p-2 rounded-full cursor-pointer pointer-coarse:p-3 {copied
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700'}"
    >
      <span aria-live="polite">
        {#if copied}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-check-icon lucide-check"
            ><path d="M20 6 9 17l-5-5" /></svg
          >
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-copy-icon lucide-copy"
            ><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path
              d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
            /></svg
          >
        {/if}
      </span>
    </button>
  {/if}
</div>
