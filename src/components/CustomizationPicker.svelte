<script lang="ts">
  import ColorPicker from "./ColorPicker.svelte";
  import VariantPicker from "./VariantPicker.svelte";
  import type { Accessory } from "../schema/types";
  import {
    computePosition,
    flip,
    offset,
    shift,
    autoUpdate,
  } from "@floating-ui/dom";

  interface Props {
    accessory: Accessory;
    selectedPrimary?: string;
    selectedSecondary?: string;
    selectedTertiary?: string;
    selectedVariantSuffix?: string;
    onColorSelect: (
      type: "primary" | "secondary" | "tertiary",
      color: string,
    ) => void;
    onVariantSelect: (suffix: string) => void;
    onClose: () => void;
    anchorElement: HTMLElement;
  }

  let {
    accessory,
    selectedPrimary,
    selectedSecondary,
    selectedTertiary,
    selectedVariantSuffix,
    onColorSelect,
    onVariantSelect,
    onClose,
    anchorElement,
  }: Props = $props();

  let floatingElement = $state<HTMLDialogElement | null>(null);

  const isColorable = $derived(
    accessory.supportsPrimaryColor ||
    accessory.supportsSecondaryColor ||
    accessory.supportsTertiaryColor
  );

  const hasVariants = $derived(
    accessory.variants && accessory.variants.length > 0
  );

  $effect(() => {
    if (floatingElement) {
      floatingElement.showModal();
    }
    return () => {
      floatingElement?.close();
    };
  });

  $effect(() => {
    if (anchorElement && floatingElement) {
      const cleanup = autoUpdate(anchorElement!, floatingElement!, () => {
        computePosition(anchorElement, floatingElement!, {
          placement: "top",
          middleware: [
            offset(4),
            flip({
              fallbackPlacements: ["bottom", "right", "left"],
            }),
            shift({ padding: 4 }),
          ],
        }).then(({ x, y }) => {
          if (floatingElement) {
            Object.assign(floatingElement.style, {
              left: `${x}px`,
              top: `${y}px`,
            });
          }
        });
      });
      return cleanup;
    }
  });
</script>

<!-- svelte-ignore a11y_interactive_supports_focus -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<dialog
  bind:this={floatingElement}
  oncancel={(e) => {
    e.preventDefault();
    onClose();
  }}
  closedby="any"
  class="fixed z-50 w-60 pointer-coarse:w-72 bg-white dark:bg-neutral-800 rounded-4xl shadow-2xl p-4 border-none m-0 overflow-visible backdrop:bg-transparent"
  onkeydown={(e) => e.stopPropagation()}
  aria-label="Customization Picker"
>
  {#if hasVariants}
    <VariantPicker
      variants={accessory.variants!}
      selectedSuffix={selectedVariantSuffix}
      {onVariantSelect}
      containerElement={floatingElement}
    />
  {:else if isColorable}
    <ColorPicker
      supportsPrimary={accessory.supportsPrimaryColor}
      supportsSecondary={accessory.supportsSecondaryColor}
      supportsTertiary={accessory.supportsTertiaryColor}
      {selectedPrimary}
      {selectedSecondary}
      {selectedTertiary}
      {onColorSelect}
      containerElement={floatingElement}
    />
  {/if}

  <button
    onclick={onClose}
    class="w-full h-10 pointer-coarse:h-12 cursor-pointer rounded-full font-semibold text-sm outline-offset-2
    bg-black dark:bg-white text-white dark:text-black
    hover:bg-neutral-800 hover:dark:bg-neutral-200"
  >
    OK
  </button>
</dialog>
