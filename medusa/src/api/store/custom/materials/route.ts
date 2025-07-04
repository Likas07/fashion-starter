import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { FASHION_MODULE } from "../../../../modules/fashion";
import FashionModuleService from "../../../../modules/fashion/service";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const fashionModuleService: FashionModuleService =
      req.scope.resolve(FASHION_MODULE);

    const materials = await fashionModuleService.listMaterials();

    res.status(200).json({ materials });
  } catch (error) {
    console.error("Error fetching materials:", error);
    res.status(500).json({ error: "Failed to fetch materials" });
  }
};
