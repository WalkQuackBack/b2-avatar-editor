<script lang="ts">
  import { untrack } from "svelte";
  import Tile from "./Tile.svelte";
  import CustomizationPicker from "./CustomizationPicker.svelte";
  import type { Category } from "../schema/types";
  import { selections } from "../stores/selections.svelte";
  import { accessoryData } from "../utilities/accessoryData";
  import { resolvePath } from "../utilities/resolvePath";

  interface Props {
    accessoryCategories: Category[];
    selectedAccessoryCategory: string;
    onCategoryActivate: (category: string) => void;
    onAccessoryActivate: (id: string) => void;
    onColorChange: (
      category: string,
      type: "primary" | "secondary" | "tertiary",
      color: string,
    ) => void;
    onVariantChange: (category: string, suffix: string) => void;
  }

  let {
    accessoryCategories,
    selectedAccessoryCategory,
    onCategoryActivate,
    onAccessoryActivate,
    onColorChange,
    onVariantChange,
  }: Props = $props();

  let showCustomizationId = $state<string | null>(null);
  let anchorElement = $state<HTMLElement | null>(null);

  let focusedCategory = $state("");
  let focusedAccessoryId = $state<string>("none");

  let tablistEl = $state<HTMLElement | null>(null);
  let gridContainerEl = $state<HTMLElement | null>(null);
  let showLeftMask = $state(false);
  let showRightMask = $state(false);

  function updateMasks() {
    if (!tablistEl) return;
    showLeftMask = tablistEl.scrollLeft > 4;
    showRightMask =
      tablistEl.scrollLeft < tablistEl.scrollWidth - tablistEl.clientWidth - 4;
  }

  const activeSelection = $derived.by(() => {
    const selectedId = selections.value[selectedAccessoryCategory]?.id;
    if (!selectedId || selectedId === "none") return null;
    return accessoryData[selectedAccessoryCategory].find((a) => a.id === selectedId);
  });

  const activeAccessory = $derived.by(() => {
    if (!showCustomizationId) return null;
    return accessoryData[selectedAccessoryCategory].find(
      (a) => a.id === showCustomizationId,
    );
  });

  function toggleCustomization(id: string, element: HTMLElement) {
    if (showCustomizationId === id) {
      showCustomizationId = null;
      anchorElement = null;
    } else {
      showCustomizationId = id;
      anchorElement = element;
    }
  }

  function handleTabKeyDown(event: KeyboardEvent) {
    const currentIndex = accessoryCategories.findIndex(
      (c) => c.id === focusedCategory,
    );
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % accessoryCategories.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex =
        (currentIndex - 1 + accessoryCategories.length) %
        accessoryCategories.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = accessoryCategories.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextCategory = accessoryCategories[nextIndex].id;
    focusedCategory = nextCategory;
    onCategoryActivate(nextCategory);

    // Focus the new tab
    const nextTab = document.getElementById(nextCategory + "-tab");
    nextTab?.focus();
  }

  function handleGridKeyDown(event: KeyboardEvent, categoryId: string) {
    const accessories = [{ id: "none" }, ...accessoryData[categoryId]];
    const currentIndex = accessories.findIndex((a) => a.id === focusedAccessoryId);
    let nextIndex = currentIndex;

    const gridEl = event.currentTarget as HTMLElement;
    const style = window.getComputedStyle(gridEl);
    const gridCols = style.getPropertyValue("grid-template-columns").split(" ").length;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = Math.min(currentIndex + 1, accessories.length - 1);
        break;
      case "ArrowLeft":
        nextIndex = Math.max(currentIndex - 1, 0);
        break;
      case "ArrowDown":
        nextIndex = Math.min(currentIndex + gridCols, accessories.length - 1);
        break;
      case "ArrowUp":
        nextIndex = Math.max(currentIndex - gridCols, 0);
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = accessories.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextAccessory = accessories[nextIndex];
    focusedAccessoryId = nextAccessory.id;

    // Focus the new tile
    const nextTile = document.getElementById(`${categoryId}-tile-${nextAccessory.id}`);
    nextTile?.focus();
  }

  // Close customization picker when category changes
  $effect(() => {
    // track changes to close picker ONLY when category id changes
    selectedAccessoryCategory; 
    untrack(() => {
      showCustomizationId = null;
      anchorElement = null;
      focusedCategory = selectedAccessoryCategory;
      
      // Reset focused accessory for the new category
      const currentSelection = selections.value[selectedAccessoryCategory]?.id;
      focusedAccessoryId = currentSelection && currentSelection !== "none" ? currentSelection : "none";
    });
  });

  $effect(() => {
    if (tablistEl) {
      updateMasks();
      const resizeObserver = new ResizeObserver(updateMasks);
      resizeObserver.observe(tablistEl);
      return () => resizeObserver.disconnect();
    }
  });
</script>

<div class="h-full flex flex-col shrink-0">
  <div
    bind:this={tablistEl}
    onscroll={updateMasks}
    role="tablist"
    aria-label="Accessory categories"
    onkeydown={handleTabKeyDown}
    tabindex="-1"
    class="category-grid p-2 lg:p-4 rounded-t-3xl lg:rounded-none flex flex-nowrap shrink-0 overflow-x-auto bg-neutral-200 dark:bg-neutral-800 scrollbar-hide"
    style:mask-image="linear-gradient(to right, {showLeftMask
      ? 'rgb(0 0 0 / 0.2)'
      : 'black'}, black 40px, black calc(100% - 40px), {showRightMask
      ? 'rgb(0 0 0 / 0.2)'
      : 'black'})"
  >
    {#each accessoryCategories as category}
      <Tile
        title={category.name}
        image={selections.categoryImages[category.id]
          ? resolvePath(`${selections.categoryImages[category.id]}`)
          : resolvePath(`${category.image}`)}
        selected={selectedAccessoryCategory === category.id}
        onActivate={() => onCategoryActivate(category.id)}
        role="tab"
        aria-controls={category.id + "-panel"}
        id={category.id + "-tab"}
        size="small"
        tabindex={focusedCategory === category.id ? 0 : -1}
      ></Tile>
    {/each}
  </div>

  <div
    bind:this={gridContainerEl}
    class="grow overflow-y-auto [scrollbar-gutter:stable] bg-neutral-100 dark:bg-neutral-900"
  >
    {#each accessoryCategories as category}
      <div
        id={category.id + "-panel"}
        role="tabpanel"
        aria-labelledby={category.id + "-tab"}
        hidden={selectedAccessoryCategory !== category.id}
        onkeydown={(e) => handleGridKeyDown(e, category.id)}
        class="accessory-grid p-1 lg:p-4 grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(6.25rem,1fr))]"
        tabindex="-1"
      >
        <Tile
          id="{category.id}-tile-none"
          title="None"
          subtext="none"
          image={resolvePath("assets/NoSelected.svg")}
          overlayCheck
          selected={!selections.value[category.id]?.id ||
            selections.value[category.id]?.id === "none"}
          onActivate={() => onAccessoryActivate("none")}
          onfocus={() => focusedAccessoryId = "none"}
          tabindex={focusedAccessoryId === "none" ? 0 : -1}
        ></Tile>
        {#each accessoryData[category.id] as accessory}
          <Tile
            id="{category.id}-tile-{accessory.id}"
            title={accessory.name}
            subtext={accessory.id}
            image={resolvePath(`${accessory.image}`)}
            overlayCheck
            selected={selections.value[category.id]?.id === accessory.id}
            onActivate={() => onAccessoryActivate(accessory.id)}
            onfocus={() => focusedAccessoryId = accessory.id}
            tabindex={focusedAccessoryId === accessory.id ? 0 : -1}
          >
            {#if selections.value[category.id]?.id === accessory.id && (accessory.supportsPrimaryColor || accessory.supportsSecondaryColor || accessory.supportsTertiaryColor || (accessory.variants && accessory.variants.length > 0))}
              <button
                class="tile__color-picker-trigger absolute left-1 top-1 p-2 shadow-md rounded-md cursor-pointer
                  bg-white dark:bg-neutral-700 hover:bg-neutral-100 hover:dark:bg-neutral-600"
                onclick={(e) => {
                  e.stopPropagation();
                  toggleCustomization(accessory.id, e.currentTarget);
                }}
                title="Change Customization"
                aria-label="Change Customization"
              >
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
                  class="lucide lucide-settings-icon lucide-settings"
                  ><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg
                >
                <!-- Touch target -->
                <div class="not-pointer-coarse:hidden absolute -inset-1"></div>
              </button>
            {/if}
          </Tile>
        {/each}
      </div>
    {/each}
  </div>

  {#if activeAccessory && anchorElement}
    <CustomizationPicker
      accessory={activeAccessory}
      selectedPrimary={selections.value[selectedAccessoryCategory]?.primaryColor}
      selectedSecondary={selections.value[selectedAccessoryCategory]?.secondaryColor}
      selectedTertiary={selections.value[selectedAccessoryCategory]?.tertiaryColor}
      selectedVariantSuffix={selections.value[selectedAccessoryCategory]?.variantIdSuffix}
      onColorSelect={(type, color) =>
        onColorChange(selectedAccessoryCategory, type, color)}
      onVariantSelect={(suffix) =>
        onVariantChange(selectedAccessoryCategory, suffix)}
      onClose={() => (showCustomizationId = null)}
      {anchorElement}
    />
  {/if}
</div>
<style>
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>