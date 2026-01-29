<script lang="ts">
  import Tile from "./Tile.svelte";
  import ColorPicker from "./ColorPicker.svelte";
  import type { Category, Accessory } from "../schema/types";
  import type { Selection } from "../stores/selections.svelte";
  import { resolvePath } from "../utilities/resolvePath";

  interface Props {
    accessoryCategories: Category[];
    categoryImages: Record<string, string | undefined>;
    selectedAccessoryCategory: string;
    onCategoryActivate: (category: string) => void;
    selections: Record<string, Selection>;
    accessoryData: Record<string, Accessory[]>;
    onAccessoryActivate: (id: string) => void;
    onColorChange: (
      category: string,
      type: "primary" | "secondary" | "tertiary",
      color: string,
    ) => void;
  }

  let {
    accessoryCategories,
    categoryImages,
    selectedAccessoryCategory,
    onCategoryActivate,
    selections,
    accessoryData,
    onAccessoryActivate,
    onColorChange,
  }: Props = $props();

  let showColorPickerId = $state<string | null>(null);
  let anchorElement = $state<HTMLElement | null>(null);

  const activeAccessory = $derived.by(() => {
    if (!showColorPickerId) return null;
    return accessoryData[selectedAccessoryCategory].find(
      (a) => a.id === showColorPickerId,
    );
  });

  function toggleColorPicker(id: string, element: HTMLElement) {
    if (showColorPickerId === id) {
      showColorPickerId = null;
      anchorElement = null;
    } else {
      showColorPickerId = id;
      anchorElement = element;
    }
  }

  // Close color picker when category changes
  $effect(() => {
    // track changes to close picker
    selectedAccessoryCategory;
    showColorPickerId = null;
    anchorElement = null;
  });
</script>

<div class="h-full flex flex-col shrink-0">
  <div
    role="tablist"
    class="category-grid p-2 lg:p-4 rounded-t-3xl lg:rounded-none flex flex-nowrap shrink-0 overflow-x-auto [scrollbar-gutter:stable] bg-neutral-200 dark:bg-neutral-800"
  >
    {#each accessoryCategories as category}
      <Tile
        title={category.name}
        image={categoryImages[category.id]
          ? resolvePath(`/${categoryImages[category.id]}`)
          : resolvePath(`/${category.image}`)}
        selected={selectedAccessoryCategory === category.id}
        onActivate={() => onCategoryActivate(category.id)}
        role="tab"
        aria-controls={category.id + "-panel"}
        id={category.id + "-tab"}
      ></Tile>
    {/each}
  </div>

  <div
    class="grow overflow-y-auto [scrollbar-gutter:stable] bg-neutral-100 dark:bg-neutral-900"
  >
    {#each accessoryCategories as category}
      <div
        id={category.id + "-panel"}
        role="tabpanel"
        aria-labelledby={category.id + "-tab"}
        hidden={selectedAccessoryCategory !== category.id}
        class="accessory-grid p-2 lg:p-4 grid grid-cols-[repeat(auto-fill,6.25em)] justify-between"
      >
        <Tile
          title="None"
          subtext="none"
          image={resolvePath("/assets/NoSelected.svg")}
          overlayCheck
          selected={!selections[category.id]?.id ||
            selections[category.id]?.id === "none"}
          onActivate={() => onAccessoryActivate("none")}
        ></Tile>
        {#each accessoryData[category.id] as accessory}
          <Tile
            title={accessory.name}
            subtext={accessory.id}
            image={resolvePath(`/${accessory.image}`)}
            overlayCheck
            selected={selections[category.id]?.id === accessory.id}
            onActivate={() => onAccessoryActivate(accessory.id)}
          >
            {#if selections[category.id]?.id === accessory.id && (accessory.supportsPrimaryColor || accessory.supportsSecondaryColor || accessory.supportsTertiaryColor)}
              <button
                class="tile__color-picker-trigger absolute left-1 top-1 p-2 shadow-md rounded-md cursor-pointer
                  bg-white dark:bg-neutral-700 hover:bg-neutral-100 hover:dark:bg-neutral-600"
                onclick={(e) => {
                  e.stopPropagation();
                  toggleColorPicker(accessory.id, e.currentTarget);
                }}
                title="Change Colors"
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
                  class="lucide lucide-paint-bucket-icon lucide-paint-bucket"
                  ><path d="M11 7 6 2" /><path d="M18.992 12H2.041" /><path
                    d="M21.145 18.38A3.34 3.34 0 0 1 20 16.5a3.3 3.3 0 0 1-1.145 1.88c-.575.46-.855 1.02-.855 1.595A2 2 0 0 0 20 22a2 2 0 0 0 2-2.025c0-.58-.285-1.13-.855-1.595"
                  /><path
                    d="m8.5 4.5 2.148-2.148a1.205 1.205 0 0 1 1.704 0l7.296 7.296a1.205 1.205 0 0 1 0 1.704l-7.592 7.592a3.615 3.615 0 0 1-5.112 0l-3.888-3.888a3.615 3.615 0 0 1 0-5.112L5.67 7.33"
                  /></svg
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
    <ColorPicker
      supportsPrimary={activeAccessory.supportsPrimaryColor}
      supportsSecondary={activeAccessory.supportsSecondaryColor}
      supportsTertiary={activeAccessory.supportsTertiaryColor}
      selectedPrimary={selections[selectedAccessoryCategory]?.primaryColor}
      selectedSecondary={selections[selectedAccessoryCategory]?.secondaryColor}
      selectedTertiary={selections[selectedAccessoryCategory]?.tertiaryColor}
      onColorSelect={(type, color) =>
        onColorChange(selectedAccessoryCategory, type, color)}
      onClose={() => (showColorPickerId = null)}
      {anchorElement}
    />
  {/if}
</div>