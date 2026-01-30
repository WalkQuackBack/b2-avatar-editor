<script lang="ts">
  import { Palette } from "../schema/colors";
  import {
    computePosition,
    flip,
    offset,
    shift,
    autoUpdate,
  } from "@floating-ui/dom";

  interface Props {
    supportsPrimary: boolean;
    supportsSecondary: boolean;
    supportsTertiary: boolean;
    selectedPrimary?: string;
    selectedSecondary?: string;
    selectedTertiary?: string;
    onColorSelect: (
      type: "primary" | "secondary" | "tertiary",
      color: string,
    ) => void;
    onClose: () => void;
    anchorElement: HTMLElement;
  }

  let {
    supportsPrimary,
    supportsSecondary,
    supportsTertiary,
    selectedPrimary,
    selectedSecondary,
    selectedTertiary,
    onColorSelect,
    onClose,
    anchorElement,
  }: Props = $props();

  let activeTab = $state<"primary" | "secondary" | "tertiary">("primary");

  const tabs = $derived([
    { id: "primary", label: "Primary", supported: supportsPrimary },
    { id: "secondary", label: "Secondary", supported: supportsSecondary },
    { id: "tertiary", label: "Tertiary", supported: supportsTertiary },
  ] as const);

  $effect(() => {
    if (activeTab === "primary" && !supportsPrimary) {
      if (supportsSecondary) activeTab = "secondary";
      else if (supportsTertiary) activeTab = "tertiary";
    } else if (activeTab === "secondary" && !supportsSecondary) {
      if (supportsPrimary) activeTab = "primary";
      else if (supportsTertiary) activeTab = "tertiary";
    } else if (activeTab === "tertiary" && !supportsTertiary) {
      if (supportsPrimary) activeTab = "primary";
      else if (supportsSecondary) activeTab = "secondary";
    }
  });

  function getSelectedColor(tabId: string) {
    if (tabId === "primary") return selectedPrimary;
    if (tabId === "secondary") return selectedSecondary;
    if (tabId === "tertiary") return selectedTertiary;
    return undefined;
  }

  let floatingElement = $state<HTMLDialogElement | null>(null);
  let focusedIndex = $state(0);

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

  function handlePaletteKeyDown(event: KeyboardEvent, index: number) {
    const cols = 5;
    let nextIndex = -1;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = index + 1;
        break;
      case "ArrowLeft":
        nextIndex = index - 1;
        break;
      case "ArrowDown":
        nextIndex = index + cols;
        break;
      case "ArrowUp":
        nextIndex = index - cols;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = Palette.length - 1;
        break;
    }

    if (nextIndex >= 0 && nextIndex < Palette.length) {
      event.preventDefault();
      const buttons =
        floatingElement?.querySelectorAll<HTMLButtonElement>(".palette-button");
      buttons?.[nextIndex]?.focus();
    }
  }

  function handleTabKeyDown(event: KeyboardEvent) {
    const supportedTabs = tabs.filter((t) => t.supported);
    const currentIndex = supportedTabs.findIndex((t) => t.id === activeTab);
    let nextIndex = -1;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % supportedTabs.length;
        break;
      case "ArrowLeft":
        nextIndex =
          (currentIndex - 1 + supportedTabs.length) % supportedTabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = supportedTabs.length - 1;
        break;
    }

    if (nextIndex !== -1) {
      event.preventDefault();
      const nextTabId = supportedTabs[nextIndex].id;
      activeTab = nextTabId;

      const button = floatingElement?.querySelector<HTMLButtonElement>(
        `.tab-button[data-id="${nextTabId}"]`,
      );
      button?.focus();
    }
  }
</script>

<!-- svelte-ignore a11y_interactive_supports_focus -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<dialog
  bind:this={floatingElement}
  oncancel={(e) => {
    e.preventDefault();
    onClose();
  }}
  onclick={(e) => {
    if (e.target === floatingElement) {
      onClose();
    }
  }}
  class="fixed z-50 w-60 pointer-coarse:w-72 bg-white dark:bg-neutral-800 rounded-4xl shadow-2xl p-4 border-none m-0 overflow-visible backdrop:bg-transparent"
  onkeydown={(e) => e.stopPropagation()}
  aria-label="Color Picker"
>
  <div class="flex mb-4" role="tablist">
    {#each tabs as tab}
      <button
        role="tab"
        aria-selected={activeTab === tab.id}
        data-id={tab.id}
        tabindex={activeTab === tab.id ? 0 : -1}
        onclick={() => tab.supported && (activeTab = tab.id)}
        onkeydown={handleTabKeyDown}
        disabled={!tab.supported}
        class="tab-button h-8 pointer-coarse:h-11 pointer-coarse:text-sm flex-1 text-xs border-b-2 outline-neutral-900 dark:outline-white focus-visible:outline-2 -outline-offset-2
        {activeTab === tab.id
          ? 'font-semibold border-b-black dark:border-b-white'
          : 'border-b-transparent text-neutral-600 dark:text-neutral-300 hover:text-neutral-700 dark:hover:text-neutral-100 cursor-pointer'}
        {!tab.supported ? 'opacity-30 cursor-not-allowed!' : ''}"
      >
        {tab.label}
      </button>
    {/each}
  </div>

  <div class="grid grid-cols-5 gap-2 mb-4">
    {#each Palette as color, i}
      <button
        onclick={() => onColorSelect(activeTab, color.hex)}
        onkeydown={(e) => handlePaletteKeyDown(e, i)}
        onfocus={() => (focusedIndex = i)}
        tabindex={focusedIndex === i ? 0 : -1}
        class="palette-button relative aspect-square rounded-full outline-2 outline-offset-2 focus:outline-neutral-900/50 dark:focus:outline-white/50 {getSelectedColor(
          activeTab,
        ) === color.hex
          ? 'outline-neutral-900 dark:outline-white focus:outline-neutral-800 focus:dark:outline-neutral-100'
          : 'outline-transparent hover:outline-black/50 dark:hover:outline-white/50'}"
        style="background-color: {color.hex}"
        title={color.name}
      >
        <!-- Touch target -->
        <div class="not-pointer-coarse:hidden absolute -inset-1"></div>
      </button>
    {/each}
  </div>

  <div class="flex gap-2 mb-4">
    <div
      class="relative w-10 h-10 shrink-0 rounded-full focus-within:outline-2 outline-offset-2"
    >
      <input
        type="color"
        aria-label="Custom color picker"
        value={getSelectedColor(activeTab) || "#000000"}
        oninput={(e) => onColorSelect(activeTab, e.currentTarget.value)}
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div
        class="w-full h-full rounded-full border-2 border-neutral-200 dark:border-neutral-700"
        style="background-color: {getSelectedColor(activeTab) || '#000000'}"
      ></div>
    </div>
    <div class="relative flex-1">
      <span
        aria-hidden="true"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-sm"
        >#</span
  >
      <input
        type="text"
        aria-label="Hex color code"
        value={(getSelectedColor(activeTab) || "#000000").replace("#", "")}
        oninput={(e) => {
          const val = e.currentTarget.value.replace(/[^0-9A-Fa-f]/g, "");
          if (val.length <= 6) {
            onColorSelect(activeTab, `#${val}`);
          }
        }}
        class="w-full pl-6 pr-3 h-full bg-neutral-100 dark:bg-neutral-900 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        placeholder="000000"
      />
    </div>
  </div>

  <div class="flex gap-2">
    <button
      onclick={() => onColorSelect(activeTab, "")}
      class="w-full h-10 pointer-coarse:h-12 rounded-full text-sm outline-offset-2
      flex gap-1 pointer-coarse:gap-2 items-center justify-center
      border border-neutral-500 hover:bg-neutral-200 hover:dark:bg-neutral-700
      {getSelectedColor(activeTab) === ''
        ? 'ring-2 ring-border-neutral-900 dark:ring-border-white'
        : ''}"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-droplet-off-icon lucide-droplet-off"
        ><path
          d="M18.715 13.186C18.29 11.858 17.384 10.607 16 9.5c-2-1.6-3.5-4-4-6.5a10.7 10.7 0 0 1-.884 2.586"
        /><path d="m2 2 20 20" /><path
          d="M8.795 8.797A11 11 0 0 1 8 9.5C6 11.1 5 13 5 15a7 7 0 0 0 13.222 3.208"
        /></svg
      >
      No Color
    </button>

    <button
      onclick={onClose}
      class="w-full h-10 pointer-coarse:h-12 rounded-full font-semibold text-sm outline-offset-2
      bg-black dark:bg-white text-white dark:text-black
      hover:bg-neutral-800 hover:dark:bg-neutral-200"
    >
      OK
    </button>
  </div>
</dialog>
