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

<div class="mt-auto p-4 bg-neutral-100 dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800">
  <div class="flex items-center justify-between mb-2">
    <span class="text-md text-neutral-700 dark:text-neutral-300">Command Output</span>
    {#if selections.commandString}
      <button
        onclick={copyToClipboard}
        aria-label={copied ? 'Command copied to clipboard' : 'Copy command to clipboard'}
        class="text-xs font-medium px-3 py-1 rounded-full {copied ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700'}"
      >
        <span aria-live="polite">
          {copied ? 'Copied!' : 'Copy'}
        </span>
      </button>
    {/if}
  </div>

  <div class="relative group">
    <output class="block w-full p-3 bg-white dark:bg-black rounded-2xl font-mono text-sm break-all min-h-12 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200">
      {selections.commandString || 'Select some accessories to generate a command...'}
    </output>
  </div>
</div>