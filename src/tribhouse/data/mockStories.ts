import { StoryObject } from '../types';

export const MOCK_COMMUNITY_STORIES: StoryObject[] = [
  {
    id: 'story_mekong_river_lore',
    title: 'Voice of the Floating River: 70 Years on the Tiền Giang Waterways',
    narrator: 'Ông Tư Đực (Elder Fisherman & Boatbuilder)',
    narratorRole: 'Elder River Guardian (Age 78)',
    location: 'Cái Răng & Sa Đéc, Mekong Delta',
    region: 'Vietnam',
    language: 'Vietnamese (Southern Dialect) with English Transcript',
    branchId: 'indigenous',
    type: 'ORAL_HISTORY',
    durationSeconds: 412,
    audioSimulationUrl: 'ambient_river',
    transcript: `Hồi xưa nước nổi về là cá linh non đi từng bầy đỏ rực mặt sông. Tụi tui chèo xuồng ba lá đi hái bông điên điển với bông súng ma. Nước ngọt mát lịm, múc lên uống trực tiếp không cần lọc gì hết ráo.

Cái bí quyết của người sống trên sông không phải là chống lại con nước, mà là nương theo nó. Nước lên thì xuồng nổi, nước giật thì phù sa lắng đọng bón cho đất ruộng tươi tốt. Đừng bao giờ đắp đê ngăn hết dòng chảy tự nhiên, con sông nó giận là không còn phù sa nuôi con cháu đâu.

[English Translation Summary]:
In the old days when the flood season arrived, shoals of young linh fish shimmered reddish across the river surface. We rowed our three-plank wooden skiffs to harvest yellow sesbania blossoms and wild water lilies. The freshwater was sweet and cool—we scooped it up and drank directly with both hands.

The secret of living with the river is never to fight the current, but to yield to its seasonal breath. When the flood rises, the boat floats; when it recedes, the nutrient-rich silt settles to fertilize the paddy fields. Never build high dikes to strangle the river’s veins, or the river will withhold the lifeblood of our grandchildren.`,
    summary: 'Elder Tu Duc shares seven decades of vernacular hydrological wisdom in the Mekong Delta, describing how traditional seasonal flooding brings organic fertility and aquatic biodiversity.',
    recordedYear: 2026,
    tags: ['Mekong', 'Oral History', 'River Lore', 'Linh Fish', 'Indigenous Knowledge'],
    license: 'Creative Commons CC-BY-NC-SA 4.0 (Community Owned)',
    consentVerified: true,
    aiAssistanceDisclosure: 'Audio transcribed by Whisperer engine, translated and reviewed with family consent.',
    provenance: 'PRIMARY_SOURCE'
  },
  {
    id: 'story_bamboo_mortise_craft',
    title: 'The Living Joint: Traditional Bamboo Joinery Without Iron Nails',
    narrator: 'Thợ Mộc Nguyễn Khắc Thành',
    narratorRole: 'Master Bamboo Architect & Carpenter (Age 64)',
    location: 'Chàng Sơn Craft Village, Thạch Thất, Hanoi',
    region: 'Northern Vietnam',
    language: 'Vietnamese / English',
    branchId: 'skills',
    type: 'CRAFT_GUIDE',
    durationSeconds: 320,
    transcript: `Cây tre nó dẻo nhưng nếu dùng đinh sắt đóng vào là nó tét làm đôi ngay. Người thợ mộc ngàn đời của làng Chàng Sơn dùng mộng én, mộng chốt bằng tre già ngâm bùn sáu tháng để chống mối mọt.

Cái nhà tre làm bằng mộng chốt khi bão gió cấp 11 quét qua nó chỉ rung rinh uốn mình như cây tre sống ngoài vườn, chứ không bao giờ gãy sụp như cột bê tông giòn.

[English Translation]:
Bamboo is extraordinarily flexible, but if you drive an iron nail into it, the culm splits immediately down its fibers. The master carpenters of Chàng Sơn have always used dovetailed bamboo dowels made from mature culms cured in alluvial mud for six months to prevent borers.

A traditional bamboo house joined with interlocking wooden mortises bends and flexes with typhoon winds like a living grove in the garden, dissipating kinetic energy rather than snapping like rigid concrete.`,
    summary: 'Master carpenter Nguyen Khac Thanh demonstrates how traditional mud-curing and nail-less joinery creates earthquake- and typhoon-resilient architectural structures using renewable bamboo.',
    recordedYear: 2026,
    tags: ['Bamboo Architecture', 'Traditional Crafts', 'Zero Nail', 'Chang Son', 'Passive Building'],
    license: 'Open Knowledge Craft Commons',
    consentVerified: true,
    aiAssistanceDisclosure: 'Curated by Hanoi Traditional Crafts Preservation Guild.',
    provenance: 'COMMUNITY'
  },
  {
    id: 'story_wild_herbal_compress',
    title: 'Mountain Herbal Compress: 12 Wild Medicinal Roots for Joint Health',
    narrator: 'Bà Mế Đinh Thị Mùi',
    narratorRole: 'Mường Ethnic Herbal Healer (Age 72)',
    location: 'Kim Bôi, Hòa Bình, Vietnam',
    region: 'Northwest Highlands',
    language: 'Mường / Vietnamese / English',
    branchId: 'health',
    type: 'TRADITIONAL_RECIPE',
    durationSeconds: 290,
    transcript: `Cây lá lốt rừng, củ gừng gió, rễ cây huyết đằng, và lá ngải dại hái vào buổi sớm khi còn đọng sương mai. Giã nát rồi sao vàng với muối hột và một chén rượu nếp cái hoa vàng.

Đắp lên khớp gối và cột sống khi còn ấm. Hơi nóng của muối và tinh dầu thảo dược sẽ dẫn máu huyết lưu thông, giải trừ phong hàn tích tụ trong cơ gân.

[English Translation]:
Wild piper lolot leaves, mountain wind ginger, milletia root (huyết đằng), and wild mugwort harvested at dawn while morning dew still clings to the foliage. Pound gently and roast in a cast-iron pan with coarse sea salt and a small cup of floral glutinous rice wine.

Apply as a warm compress over aching joints and the lumbar spine. The gentle thermal heat and volatile aromatic terpenes stimulate microvascular circulation and dispel cold stagnation from tendons and deep fascia.`,
    summary: 'Traditional Mường ethnomedicinal recipe for soothing musculoskeletal fatigue and osteoarthritis using wild highland herbs roasted with coarse mineral salt.',
    recordedYear: 2026,
    tags: ['Herbal Medicine', 'Muong Culture', 'Ethnobotany', 'Natural Remedies', 'Joint Health'],
    license: 'Traditional Knowledge Commons (Non-Commercial Heritage)',
    consentVerified: true,
    aiAssistanceDisclosure: 'Ethnobotanical field collection validated with Hoa Binh Traditional Medicine Association.',
    provenance: 'EXPERT_REVIEWED'
  }
];
