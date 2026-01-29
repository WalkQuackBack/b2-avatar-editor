<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { resolvePath } from "../utilities/resolvePath";

  const fallbackImage = resolvePath("/assets/AssetError.svg");

  interface Props extends HTMLAttributes<HTMLDivElement> {
    title: string;
    subtext?: string;
    image?: string;
    selected?: boolean;
    overlayCheck?: boolean;
    onActivate: () => void;
  }

  let {
    title,
    subtext,
    image = fallbackImage,
    selected = false,
    overlayCheck = false,
    onActivate,
    children,
    ...rest
  }: Props = $props();

  function onClick(event: MouseEvent) {
    if ((event.target as HTMLElement).closest(".tile__color-picker-trigger")) {
      return;
    }
    onActivate();
  }
  function keyDown(event: KeyboardEvent) {
    if (event.key === " ") {
      event.preventDefault();
    } else if (event.key === "Enter") {
      if (
        (event.target as HTMLElement).closest(".tile__color-picker-trigger")
      ) {
        return;
      }
      event.preventDefault();
      onActivate();
    }
  }
  function keyUp(event: KeyboardEvent) {
    if (event.key === " ") {
      if (
        (event.target as HTMLElement).closest(".tile__color-picker-trigger")
      ) {
        return;
      }
      event.preventDefault();
      onActivate();
    }
  }
</script>

<div
  onclick={onClick}
  onkeydown={keyDown}
  onkeyup={keyUp}
  class="tile group flex flex-col shrink-0 items-center p-2 max-w-25 cursor-pointer rounded-2xl relative"
  aria-pressed={selected}
  role="button"
  tabindex="0"
  {...rest}
>
  <div
    class="tile__image-container w-full rounded-xl relative overflow-hidden aspect-square mb-2 bg-white dark:bg-white/3 border-2 border-neutral-300 dark:border-neutral-700 group-hover:border-neutral-400 dark:group-hover:border-neutral-600 {selected
      ? 'tile_selected__image border-neutral-800 dark:border-white group-hover:border-neutral-500 group-hover:dark:border-neutral-300'
      : ''}"
  >
    <img
      src={image}
      onerror={() => {
        image = fallbackImage;
      }}
      alt=""
      role="presentation"
      width="100"
      height="100"
    />
    {#if overlayCheck}
      <div
        class="tile__overlay-check absolute right-1.5 top-1.5 pointer-events-none rounded-md bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-800 w-7 h-7 flex items-center justify-center"
        role="presentation"
        aria-hidden="true"
        hidden={!selected}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-check-icon lucide-check"
          ><path d="M20 6 9 17l-5-5" /></svg
        >
      </div>
    {/if}
  </div>
  <span
    class="tile__title text-md text-center text-neutral-900 dark:text-neutral-100"
    >{title}</span
  >
  {#if subtext}
    <span class="tile__subtext text-sm text-neutral-600 dark:text-neutral-400"
      >{subtext}</span
    >
  {/if}
  {@render children?.()}
</div>