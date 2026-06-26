import { getCalApi } from "@calcom/embed-react";
import { portfolio } from "@/data";

export const CAL_MODAL_CONFIG = {
  layout: "month_view",
  useSlotsViewOnSmallScreen: "true",
} as const;

export const CAL_MODAL_CONFIG_JSON = JSON.stringify(CAL_MODAL_CONFIG);

export async function initCalNamespaces() {
  await Promise.all(
    portfolio.site.calLinks.map(async (meeting) => {
      const cal = await getCalApi({ namespace: meeting.id });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    }),
  );
}

export async function openCalModal(meetingId = "15min") {
  const meeting =
    portfolio.site.calLinks.find((m) => m.id === meetingId) ??
    portfolio.site.calLinks[0];

  if (!meeting) return;

  const cal = await getCalApi({ namespace: meeting.id });
  cal("modal", {
    calLink: meeting.link,
    config: CAL_MODAL_CONFIG,
  });
}
