import { ndaTemplate } from "./nda/schema";
import { distributorTemplate } from "./distributor/schema";
import NdaPage1 from "@/components/document/nda/NdaPage1";
import NdaPage2 from "@/components/document/nda/NdaPage2";
import NdaPage3 from "@/components/document/nda/NdaPage3";
import NdaPage4 from "@/components/document/nda/NdaPage4";
import DistributorPage1 from "@/components/document/distributor/DistributorPage1";
import DistributorPage2 from "@/components/document/distributor/DistributorPage2";
import DistributorPage3 from "@/components/document/distributor/DistributorPage3";
import DistributorPage4 from "@/components/document/distributor/DistributorPage4";
import DistributorPage5 from "@/components/document/distributor/DistributorPage5";

export const templateRegistry = {
  nda: {
    schema: ndaTemplate,
    pages: [NdaPage1, NdaPage2, NdaPage3, NdaPage4],
  },
  distributor: {
    schema: distributorTemplate,
    pages: [
      DistributorPage1,
      DistributorPage2,
      DistributorPage3,
      DistributorPage4,
      DistributorPage5,
    ],
  },
};

export function getCompletionStatus(values, templateId) {
  const entry = templateRegistry[templateId];
  if (!entry) return { total: 0, filled: 0, isComplete: false };
  const requiredFields = entry.schema.fields.filter((f) => f.required);
  const filled = requiredFields.filter((f) => values[f.id]?.trim());
  return {
    total: requiredFields.length,
    filled: filled.length,
    isComplete: filled.length === requiredFields.length,
  };
}