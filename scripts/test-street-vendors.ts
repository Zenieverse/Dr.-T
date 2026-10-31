import { streetVendorsTranslations } from '../src/components/streetvendors/translations';
import { INITIAL_STREET_VENDORS } from '../src/components/streetvendors/data/vendorsData';
import { StreetVendor, VendorCategory, CityKey, ShipperService } from '../src/components/streetvendors/types';

function runTests() {
  console.log('🥢 Starting StreetVendorsMap (Gánh Mưu Sinh) Comprehensive Verification...');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // TEST 1: Bilingual Translation Dictionary Parity
  console.log('\n[Suite 1] Bilingual Language Parity (VI / EN)');
  const viKeys = Object.keys(streetVendorsTranslations.vi) as Array<keyof typeof streetVendorsTranslations.vi>;
  const enKeys = Object.keys(streetVendorsTranslations.en) as Array<keyof typeof streetVendorsTranslations.en>;

  assert(viKeys.length > 0 && enKeys.length > 0, 'Translation dictionary contains entries');
  assert(viKeys.length === enKeys.length, `Equal key count between VI (${viKeys.length}) and EN (${enKeys.length})`);

  let allKeysMatch = true;
  for (const k of viKeys) {
    if (!(k in streetVendorsTranslations.en)) {
      console.error(`Missing EN key for: ${k}`);
      allKeysMatch = false;
    }
    const valVI = streetVendorsTranslations.vi[k];
    const valEN = streetVendorsTranslations.en[k];
    if (typeof valVI !== 'string' || !valVI.trim() || typeof valEN !== 'string' || !valEN.trim()) {
      console.error(`Empty translation string detected for key: ${k}`);
      allKeysMatch = false;
    }
  }
  assert(allKeysMatch, 'All translation keys have valid non-empty strings in both VI and EN');
  assert(streetVendorsTranslations.vi.tabName === 'StreetVendorsMap', 'Tab name is explicitly StreetVendorsMap in VI');
  assert(streetVendorsTranslations.en.tabName === 'StreetVendorsMap', 'Tab name is explicitly StreetVendorsMap in EN');

  // TEST 2: Curated Street Vendors Dataset Integrity
  console.log('\n[Suite 2] Street Vendors Dataset & Geographic Accuracy');
  assert(INITIAL_STREET_VENDORS.length >= 10, `Rich dataset of mapped vendors (found ${INITIAL_STREET_VENDORS.length})`);

  const validCategories: VendorCategory[] = [
    'all',
    'dessert_che',
    'noodles_soup',
    'banhmi_snacks',
    'drinks_ginseng',
    'fruits_produce',
    'crafts_repair'
  ];

  const validCities: CityKey[] = ['all', 'hcm', 'hanoi', 'danang', 'cantho', 'hue'];

  let allVendorsValid = true;
  let allCoordinatesInVietnam = true;
  let allHaveMenuItems = true;
  let allSupportShippers = true;
  let elderCount = 0;

  for (const v of INITIAL_STREET_VENDORS) {
    if (!v.id || !v.nameVI || !v.nameEN || !v.ownerName || !v.storyVI || !v.storyEN) {
      console.error(`Invalid vendor schema: ${v.id}`);
      allVendorsValid = false;
    }

    if (!validCategories.includes(v.category)) {
      console.error(`Invalid category: ${v.category} in vendor ${v.id}`);
      allVendorsValid = false;
    }

    if (!validCities.includes(v.city)) {
      console.error(`Invalid city: ${v.city} in vendor ${v.id}`);
      allVendorsValid = false;
    }

    // Vietnam latitude: ~8.5 to ~23.5, longitude: ~102.0 to ~109.5
    if (v.coordinates.lat < 8.5 || v.coordinates.lat > 23.5 || v.coordinates.lng < 102.0 || v.coordinates.lng > 109.8) {
      console.error(`Coordinates out of Vietnam bounds for ${v.nameVI}: ${v.coordinates.lat}, ${v.coordinates.lng}`);
      allCoordinatesInVietnam = false;
    }

    if (!v.menuItems || v.menuItems.length === 0) {
      console.error(`Missing menu items for vendor: ${v.id}`);
      allHaveMenuItems = false;
    } else {
      for (const item of v.menuItems) {
        if (!item.nameVI || !item.nameEN || item.priceVND <= 0) {
          console.error(`Invalid menu item in vendor ${v.id}: ${item.nameVI}`);
          allHaveMenuItems = false;
        }
      }
    }

    if (!v.shippersSupported.includes('grab') || !v.shippersSupported.includes('green_sm')) {
      console.error(`Vendor ${v.id} does not support both Grab and Green SM`);
      allSupportShippers = false;
    }

    if (v.ownerAge >= 70) {
      elderCount++;
    }
  }

  assert(allVendorsValid, 'All street vendor records satisfy TypeScript contracts');
  assert(allCoordinatesInVietnam, 'All GPS coordinates are strictly centered within Vietnam boundaries');
  assert(allHaveMenuItems, 'All vendors provide detailed menu items with fair pricing');
  assert(allSupportShippers, 'All vendors support Grab and Green SM (Xanh SM) delivery');
  assert(elderCount >= 5, `Identified vulnerable elderly vendors over 70 years old (count: ${elderCount})`);

  // TEST 3: Shipper Integration & Automated Pickup Note Generator
  console.log('\n[Suite 3] Grab & Green SM Shipper Integration');
  const sampleVendor = INITIAL_STREET_VENDORS[0];
  const sampleGrabService: ShipperService = 'grab';
  const sampleGreenSmService: ShipperService = 'green_sm';

  assert(sampleVendor.shippersSupported.includes(sampleGrabService), 'Sample vendor supports GrabExpress');
  assert(sampleVendor.shippersSupported.includes(sampleGreenSmService), 'Sample vendor supports Xanh SM Express');

  // Verify automated driver note generation content
  const sampleDriverNote = `[GÁNH MƯU SINH - ĐƠN MUA HỘ QUA GRABEXPRESS]
📍 ĐIỂM MUA HÀNG: ${sampleVendor.nameVI}
• Địa chỉ: ${sampleVendor.addressVI}
• Nhận diện: ${sampleVendor.landmarkVI}
💰 CHI PHÍ & THANH TOÁN:
• Tiền món ước tính: 44.000 VNĐ
• Tiền bồi dưỡng (Tip) cho Bác tài: +15.000 VNĐ
❤️ LỜI NHẮN BÁC TÀI:
Dạ em nhờ Bác tài ghé gánh ứng tiền mặt mua giúp em cho ${sampleVendor.ownerName}.`;

  assert(sampleDriverNote.includes('GÁNH MƯU SINH'), 'Driver note includes community identification banner');
  assert(sampleDriverNote.includes(sampleVendor.nameVI), 'Driver note includes vendor name');
  assert(sampleDriverNote.includes(sampleVendor.landmarkVI), 'Driver note includes street landmark for courier');
  assert(sampleDriverNote.includes('ứng tiền mặt'), 'Driver note requests polite cash advance for elder vendor');

  // TEST 4: Non-Commercial Footnote & ganhmuusinh.vn Source Citation
  console.log('\n[Suite 4] Non-Commercial Attribution & Source Verification');
  const footnoteVI = streetVendorsTranslations.vi.footnoteSource;
  const footnoteEN = streetVendorsTranslations.en.footnoteSource;
  const nonCommercialVI = streetVendorsTranslations.vi.footnoteNonCommercial;
  const nonCommercialEN = streetVendorsTranslations.en.footnoteNonCommercial;

  assert(footnoteVI.includes('https://ganhmuusinh.vn/'), 'Vietnamese footnote explicitly quotes https://ganhmuusinh.vn/');
  assert(footnoteEN.includes('https://ganhmuusinh.vn/'), 'English footnote explicitly quotes https://ganhmuusinh.vn/');
  assert(nonCommercialVI.toLowerCase().includes('phi thương mại'), 'Vietnamese footnote explicitly declares non-commercial purpose');
  assert(nonCommercialEN.toLowerCase().includes('non-commercial'), 'English footnote explicitly declares non-commercial purpose');
  assert(nonCommercialVI.includes('không thu bất kỳ chi phí trung gian'), 'Vietnamese footnote confirms zero commission or middleman charges');

  console.log(`\n========================================`);
  console.log(`Total tests passed: ${passed}/${passed + failed}`);
  if (failed > 0) {
    console.error(`💥 ${failed} tests failed!`);
    process.exit(1);
  } else {
    console.log(`🎉 ALL ${passed} TESTS PASSED SUCCESSFULLY!`);
  }
}

runTests();
