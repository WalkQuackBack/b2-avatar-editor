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
    const parts: string[] = [];

    for (const category of Categories) {
      const selection = this.value[category.id];
      const id = selection?.id || "none";
      
      let part = `${category.id}`;

      if (category.id === "body" && id === "default") {
        if (selection?.primaryColor || selection?.secondaryColor || selection?.tertiaryColor || selection?.variantIdSuffix) {
          part += ":";
        }
      } else if (id !== "none") {
        part += `:${id}`;
      } else {
        part += `:${id}`;
      }

      if (selection?.variantIdSuffix) part += selection.variantIdSuffix;
      if (selection?.primaryColor) part += selection.primaryColor;
      if (selection?.secondaryColor) part += selection.secondaryColor;
      if (selection?.tertiaryColor) part += selection.tertiaryColor;

      parts.push(part);
    }

    return parts.length > 0 ? `/fish ${parts.join(",")}` : "";
  });

  categoryImages = $derived.by(() => {
    const images: Record<string, string | undefined> = {};
    for (const category of Categories) {
      const selected = this.value[category.id];
      const selectedId = selected?.id;
      if (selectedId && selectedId !== "none") {
        const accessory = accessoryData[category.id]?.find(
          (a) => a.id === selectedId,
        );
        images[category.id] = accessory?.image;
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