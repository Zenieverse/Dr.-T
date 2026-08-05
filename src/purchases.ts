import { Purchases } from "@revenuecat/purchases-js";

const appUserId = Purchases.generateRevenueCatAnonymousAppUserId();
export const purchases = Purchases.configure({
    apiKey: "test_kVpvnqriCDcrcrdfHRfdULbHFzU",
    appUserId: appUserId,
});
