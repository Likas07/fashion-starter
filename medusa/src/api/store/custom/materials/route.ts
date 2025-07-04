import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { FASHION_MODULE } from "../../../../modules/fashion";
import FashionModuleService from "../../../../modules/fashion/service";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const fashionModuleService: FashionModuleService =
    req.scope.resolve(FASHION_MODULE);

  const materials = await fashionModuleService.listMaterials();

  res.status(200).json({ materials });
};
