import { GeneralAccessories } from "../schema/accessory";
import { BodyAccessories } from "../schema/body";
import { EffectAccessories } from "../schema/effect";
import { EyewearAccessories } from "../schema/eyewear";
import { FinAccessories } from "../schema/fin";
import { HatAccessories } from "../schema/hat";
import { MouthAccessories } from "../schema/mouth";
import type { Accessory } from "../schema/types";

export const accessoryData: Record<string, Accessory[]> = {
  body: BodyAccessories,
  hat: HatAccessories,
  accessory: GeneralAccessories,
  eyewear: EyewearAccessories,
  mouth: MouthAccessories,
  fin: FinAccessories,
  effect: EffectAccessories,
};
