export interface Selection {
  id: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
}

class SelectionsStore {
  value = $state<Record<string, Selection>>({});

  update(id: string, selection: Partial<Selection>) {
    if (!this.value[id]) {
      this.value[id] = { id: null };
    }
    this.value[id] = { ...this.value[id], ...selection };
  }

  set(id: string, selection: Selection) {
    this.value[id] = selection;
  }
}

export const selections = new SelectionsStore();
