<script lang="ts">
  import AccessoryPicker from "./AccessoryPicker.svelte";
  import { Categories } from "../schema/categories";
  import { GeneralAccessories } from "../schema/accessory";
  import { BodyAccessories } from "../schema/body";
  import { EffectAccessories } from "../schema/effect";
  import { EyewearAccessories } from "../schema/eyewear";
  import { FinAccessories } from "../schema/fin";
  import { HatAccessories } from "../schema/hat";
  import { MouthAccessories } from "../schema/mouth";
  import { selections } from "../stores/selections.svelte";
  import OutputBox from "./OutputBox.svelte";
  import type { Accessory, Category } from "../schema/types";

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

  const accessoryData: Record<CategoryId, Accessory[]> = {
    body: BodyAccessories,
    hat: HatAccessories,
    accessory: GeneralAccessories,
    eyewear: EyewearAccessories,
    mouth: MouthAccessories,
    fin: FinAccessories,
    effect: EffectAccessories,
  };

  const categoryImages = $derived.by(() => {
    const images: Record<string, string | undefined> = {};
    for (const category of Categories) {
      const selected = selections.value[category.id];
      const selectedId = selected?.id;
      if (selectedId && selectedId !== "none") {
        const accessory = accessoryData[category.id].find(
          (a) => a.id === selectedId,
        );
        images[category.id] = accessory?.image;
      }
    }
    return images;
  });
</script>

<aside class="h-1/2 lg:max-w-1/2 lg:h-full flex flex-col shrink-0">
  <AccessoryPicker
    accessoryCategories={Categories}
    {categoryImages}
    {selectedAccessoryCategory}
    {onCategoryActivate}
    selections={selections.value}
    {accessoryData}
    {onAccessoryActivate}
    {onColorChange}
  />
</aside>

<main class="p-2 lg:p-4">
  <span>TODO: add proper preview</span>
  <OutputBox selections={selections.value} />
</main>
