<script lang="ts">
  import AccessoryPicker from "./AccessoryPicker.svelte";
  import { Categories } from "../schema/categories";
  import { selections } from "../stores/selections.svelte";
  import OutputBox from "./OutputBox.svelte";
  import type { Category } from "../schema/types";

  type CategoryId = Category["id"];

  let selectedAccessoryCategory = $state<CategoryId>("body");

  function onCategoryActivate(category: CategoryId) {
    selectedAccessoryCategory = category;
  }

  function onAccessoryActivate(id: string) {
    selections.update(selectedAccessoryCategory, { id });
  }

  function onColorChange(
    category: CategoryId,
    type: "primary" | "secondary" | "tertiary",
    color: string,
  ) {
    selections.update(category, { [`${type}Color`]: color });
  }
</script>

<aside class="h-1/2 lg:max-w-1/2 lg:h-full flex flex-col shrink-0">
  <AccessoryPicker
    accessoryCategories={Categories}
    {selectedAccessoryCategory}
    {onCategoryActivate}
    {onAccessoryActivate}
    {onColorChange}
  />
</aside>

<main class="p-2 lg:p-4">
  <span>TODO: add proper preview</span>
  <OutputBox />
</main>
