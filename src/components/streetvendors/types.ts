// ==========================================
// STREET VENDORS MAP (GÁNH MƯU SINH) TYPES
// Connected with Grab and Green SM (Xanh SM)
// Non-commercial community initiative
// ==========================================

export type VendorCategory = 
  | 'all'
  | 'dessert_che'
  | 'noodles_soup'
  | 'banhmi_snacks'
  | 'drinks_ginseng'
  | 'fruits_produce'
  | 'crafts_repair';

export type CityKey = 'all' | 'hcm' | 'hanoi' | 'danang' | 'cantho' | 'hue';

export type ShipperService = 'grab' | 'green_sm';

export interface VendorCoordinates {
  lat: number;
  lng: number;
}

export interface MenuItem {
  id: string;
  nameVI: string;
  nameEN: string;
  priceVND: number;
  descriptionVI?: string;
  descriptionEN?: string;
}

export interface StreetVendor {
  id: string;
  nameVI: string;
  nameEN: string;
  ownerName: string;
  ownerAge: number;
  yearsTrading: number;
  category: VendorCategory;
  city: CityKey;
  districtVI: string;
  districtEN: string;
  addressVI: string;
  addressEN: string;
  landmarkVI: string;
  landmarkEN: string;
  coordinates: VendorCoordinates;
  operatingHoursVI: string;
  operatingHoursEN: string;
  isOpenNow?: boolean;
  priceRangeVND: string;
  priceRangeUSD: string;
  specialtiesVI: string[];
  specialtiesEN: string[];
  menuItems: MenuItem[];
  storyVI: string;
  storyEN: string;
  phone?: string;
  photoUrl: string;
  verified: boolean;
  verificationDate: string;
  verifiedByCount: number;
  likesCount: number;
  supportNeedsVI?: string[];
  supportNeedsEN?: string[];
  shippersSupported: ShipperService[];
  paymentNotesVI: string;
  paymentNotesEN: string;
}

export interface ShipperOrderRequest {
  vendorId: string;
  selectedItems: Array<{ item: MenuItem; quantity: number }>;
  buyerName: string;
  buyerPhone: string;
  deliveryAddress: string;
  specialInstructions: string;
  shipperService: ShipperService;
  driverTipVND: number;
}

export interface StreetVendorStats {
  totalVendors: number;
  totalDistricts: number;
  eldersOver70: number;
  verifiedDeliveries: number;
}
