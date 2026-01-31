<script lang="ts">
  import AccessoryPicker from "./AccessoryPicker.svelte";
  import { Categories } from "../schema/categories";
  import { selections } from "../stores/selections.svelte";
  import { accessoryData } from "../utilities/accessoryData";
  import { Palette } from "../schema/colors";
  import OutputBox from "./OutputBox.svelte";
  import type { Category } from "../schema/types";

  type CategoryId = Category["id"];

  let selectedAccessoryCategory = $state<CategoryId>("body");

  function onCategoryActivate(category: CategoryId) {
    selectedAccessoryCategory = category;
  }

  function onAccessoryActivate(id: string) {
    const current = selections.value[selectedAccessoryCategory];
    const update: any = { id };

    if (id !== "none" && current?.id !== id) {
      const data = accessoryData[selectedAccessoryCategory].find(
        (a) => a.id === id,
      );
      if (data) {
        if (data.supportsPrimaryColor && !current?.primaryColor) {
          update.primaryColor = Palette[0].hex; // 1st
        }
        if (data.supportsSecondaryColor && !current?.secondaryColor) {
          update.secondaryColor = Palette[6].hex; // 7th
        }
        if (data.supportsTertiaryColor && !current?.tertiaryColor) {
          update.tertiaryColor = Palette[10].hex; // 11th
        }
      }
    }

    selections.update(selectedAccessoryCategory, update);
  }

  function onColorChange(
    category: CategoryId,
    type: "primary" | "secondary" | "tertiary",
    color: string,
  ) {
    selections.update(category, { [`${type}Color`]: color });
  }

  function onVariantChange(category: CategoryId, suffix: string) {
    selections.update(category, { variantIdSuffix: suffix });
  }
</script>

<aside class="h-1/2 md:max-w-1/2 md:h-full flex flex-col shrink-0">
  <AccessoryPicker
    accessoryCategories={Categories}
    {selectedAccessoryCategory}
    {onCategoryActivate}
    {onAccessoryActivate}
    {onColorChange}
    {onVariantChange}
  />
</aside>

<main class="p-2 md:p-4">
  <span>TODO: add proper preview</span>
  <OutputBox />
</main>
