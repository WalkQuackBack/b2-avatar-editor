import { Categories } from "../schema/categories";
import { accessoryData } from "../utilities/accessoryData";

export interface Selection {
  id: string | null;
  variantIdSuffix?: string;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
}

class SelectionsStore {
  value = $state<Record<string, Selection>>({});

  commandString = $derived.by(() => {
    const parts = Categories.map((category) => {
      const selection = this.value[category.id];
      const id = selection?.id || "none";
      const hasModifiers = selection?.primaryColor || selection?.secondaryColor || selection?.tertiaryColor || selection?.variantIdSuffix;

      let part = category.id;

      if (category.id === "body" && id === "default") {
        if (hasModifiers) part += ":";
      } else {
        part += `:${id}`;
      }

      if (selection?.variantIdSuffix) part += selection.variantIdSuffix;
      if (selection?.primaryColor) part += selection.primaryColor;
      if (selection?.secondaryColor) part += selection.secondaryColor;
      if (selection?.tertiaryColor) part += selection.tertiaryColor;

      return part;
    });

    return parts.length > 0 ? `/fish ${parts.join(",")}` : "";
  });

  categoryImages = $derived.by(() => {
    const images: Record<string, string | undefined> = {};
    for (const category of Categories) {
      const selectedId = this.value[category.id]?.id;
      if (selectedId && selectedId !== "none") {
        images[category.id] = accessoryData[category.id]?.find(
          (a) => a.id === selectedId,
        )?.image;
      }
    }
    return images;
  });

  update(categoryId: string, selection: Partial<Selection>) {
    if (!this.value[categoryId]) {
      this.value[categoryId] = { id: null };
    }
    this.value[categoryId] = { ...this.value[categoryId], ...selection };
  }

  set(categoryId: string, selection: Selection) {
    this.value[categoryId] = selection;
  }
}

export const selections = new SelectionsStore();