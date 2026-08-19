import { ndaTemplate } from "./nda/schema";
import { distributorTemplate } from "./distributor/schema";
import { partnerTemplate } from "./partner/schema";

import NdaPage1 from "@/components/document/nda/NdaPage1";
import NdaPage2 from "@/components/document/nda/NdaPage2";
import NdaPage3 from "@/components/document/nda/NdaPage3";
import NdaPage4 from "@/components/document/nda/NdaPage4";

import DistributorPage1 from "@/components/document/distributor/DistributorPage1";
import DistributorPage2 from "@/components/document/distributor/DistributorPage2";
import DistributorPage3 from "@/components/document/distributor/DistributorPage3";
import DistributorPage4 from "@/components/document/distributor/DistributorPage4";
import DistributorPage5 from "@/components/document/distributor/DistributorPage5";

import PartnerPage1 from "@/components/document/partner/PartnerPage1";
import PartnerPage2 from "@/components/document/partner/PartnerPage2";
import PartnerPage3 from "@/components/document/partner/PartnerPage3";
import PartnerPage4 from "@/components/document/partner/PartnerPage4";
import PartnerPage5 from "@/components/document/partner/PartnerPage5";
import PartnerPage6 from "@/components/document/partner/PartnerPage6";

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
  partner: {
    schema: partnerTemplate,
    pages: [
      PartnerPage1,
      PartnerPage2,
      PartnerPage3,
      PartnerPage4,
      PartnerPage5,
      PartnerPage6,
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