import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { FASHION_MODULE } from "../../../../modules/fashion";
import FashionModuleService from "../../../../modules/fashion/service";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const fashionModuleService: FashionModuleService =
      req.scope.resolve(FASHION_MODULE);

    const colors = await fashionModuleService.listColors();

    res.status(200).json({ colors });
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Failed to fetch colors" });
  }
};
