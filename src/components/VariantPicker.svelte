<script lang="ts">
  import type { AccessoryVariant } from "../schema/types";
  import { getNextIndex } from "../utilities/keyboardNavigation";

  interface Props {
    variants: AccessoryVariant[];
    selectedSuffix?: string;
    onVariantSelect: (suffix: string) => void;
    containerElement: HTMLElement | null;
  }

  let {
    variants,
    selectedSuffix,
    onVariantSelect,
    containerElement,
  }: Props = $props();

  let focusedIndex = $state(0);

  function handleKeyDown(event: KeyboardEvent, index: number) {
    const nextIndex = getNextIndex(event.key, {
      currentIndex: index,
      totalItems: variants.length,
      direction: "vertical",
    });

    if (nextIndex !== index || ["Home", "End"].includes(event.key)) {
      event.preventDefault();
      const buttons =
        containerElement?.querySelectorAll<HTMLButtonElement>(".variant-button");
      buttons?.[nextIndex]?.focus();
    }
  }
</script>

<div class="flex flex-col gap-2 mb-4">
  {#each variants as variant, i}
    <button
      onclick={() => onVariantSelect(variant.idSuffix)}
      onkeydown={(e) => handleKeyDown(e, i)}
      onfocus={() => (focusedIndex = i)}
      tabindex={focusedIndex === i ? 0 : -1}
      class="variant-button w-full py-3 px-4 rounded-2xl text-left font-semibold cursor-pointer outline-neutral-900 dark:outline-white focus-visible:outline-2 -outline-offset-2
      {selectedSuffix === variant.idSuffix
        ? 'bg-black text-white dark:bg-white dark:text-black'
        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-600'}"
    >
      {variant.name}
    </button>
  {/each}
</div>
