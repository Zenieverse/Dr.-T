import { ZenBook } from '../types';
import { DAODEJING_COVER_IMAGE } from '../../../assets/daodejingImage';

export const ZEN_BOOKS: ZenBook[] = [
  {
    id: 'zen_mumonkan',
    title: 'The Gateless Gate (Mumonkan)',
    originalTitle: '無門關',
    kanjiScript: '無門慧開 禪宗公案集',
    author: 'Master Wumen Huikai (Mumon Ekai)',
    authorBio: '13th-century Song Dynasty Chan master known for compiling forty-eight quintessential koans designed to cut through intellectual attachment.',
    lineage: 'Rinzai Chan / Zen Tradition',
    connectedLibraryId: 'lib_kyoto_archives',
    connectedLibraryName: 'Kyoto Zen Archives & Rinzai Heritage',
    category: 'FOUNDATIONAL_KOANS',
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
    year: 1228,
    scrollsOrPages: '48 Koan Chapters (164 Pages)',
    language: 'Classical Chinese with English Translation',
    originalLanguage: 'Classical Chinese (Kanbun)',
    description: 'The definitive 48-case koan compilation of Chan and Zen Buddhism. Each case presents an encounter between master and disciple, accompanied by Wumen’s penetrating verse and sharp commentary.',
    quote: 'The great path has no gates, thousands of roads enter it. When one passes through this gateless barrier, one walks freely between heaven and earth.',
    keyTeachings: [
      'The barrier of the patriarchs is passed only by dropping dualistic conceptualization.',
      'The famous "Mu" koan (Does a dog have Buddha-nature?) cleanses intellectual speculation.',
      'True realization is immediate, embodied, and unconditioned by scholarly dogma.'
    ],
    chapters: [
      {
        id: 'koan_01',
        title: 'Case 1: Zhaozhou’s Dog (Joshu’s "Mu")',
        subtitle: '趙州狗子',
        originalVerse: '狗子佛性 / 全提正令 / 纔涉有無 / 喪身失命',
        readTimeMinutes: 5,
        meditationPrompt: 'Observe the breath. As thoughts of "having" or "not having" arise, let them dissolve without taking sides.',
        content: `A monk asked Master Zhaozhou in all earnestness: "Does a dog have Buddha-nature or not?"
Zhaozhou replied: "Mu!" (Wu / Not / Emptiness).

Wumen's Commentary:
To practice Zen, you must pass through the barrier of the patriarchs. For subtle enlightenment, you must exhaust the thinking road. If you do not pass the barrier, you are like a ghost clinging to grasses and trees.

Now tell me, what is the barrier of the patriarchs? It is just this single character: "Mu."
Concentrate your whole being, with your three hundred and sixty bones and eighty-four thousand pores, into this one word "Mu." Walk with it, sit with it, breathe with it day and night. Do not interpret it as nothingness, and do not think of it in terms of existence or nonexistence.

When the red-hot iron ball lodged in your throat is finally vomited out, inside and outside fuse into one. You will see with the same eyes as all the Buddhas across time.`
      },
      {
        id: 'koan_02',
        title: 'Case 2: Baizhang and the Wild Fox',
        subtitle: '百丈野狐',
        originalVerse: '不落不昧 / 兩采一賽 / 俰合無著 / 自由自在',
        readTimeMinutes: 7,
        meditationPrompt: 'Notice cause and effect in the mind. Neither deny circumstance nor be trapped by fear of outcome.',
        content: `Whenever Master Baizhang delivered a sermon, an elderly man was always seen in the assembly listening intently. One day, after the other monks departed, the old man remained.
Baizhang asked: "Who is standing before me?"

The old man answered: "I am not a human being. In the distant age of Kashyapa Buddha, I dwelt on this very mountain as abbot. A student once asked me: 'Does an enlightened person still fall under the laws of cause and effect (karma)?'
I answered: 'He does not fall under karma (不落因果).' Because of this single careless word, I have been reborn as a wild fox for five hundred lifetimes. Now I beseech you, Master, speak a turning word to free me from this fox body."

Baizhang said: "Ask me the question."
The old man asked: "Does an enlightened person still fall under the laws of cause and effect?"
Baizhang replied: "He does not obscure cause and effect (不昧因果)."

Hearing these words, the old man experienced great awakening. He bowed deeply and said: "I am now emancipated from the fox body."`
      },
      {
        id: 'koan_03',
        title: 'Case 7: Zhaozhou’s "Wash Your Bowl"',
        subtitle: '趙州洗鉢',
        originalVerse: '直指本心 / 見性成佛 / 喫粥了也 / 洗鉢盂去',
        readTimeMinutes: 4,
        meditationPrompt: 'Bring total awareness to the ordinary task right in front of you: tea cup, keyboard, or breath.',
        content: `A novice monk came to Zhaozhou and said: "I have just entered the monastery. I beseech you, Master, give me instruction."
Zhaozhou looked at him and asked: "Have you eaten your morning rice porridge yet?"
The novice monk said: "I have eaten it."
Zhaozhou said: "Then go wash your wooden bowl."
Upon hearing this, the novice monk attained profound insight.

Wumen's Verse:
Only because it is so exceedingly clear,
It is difficult to take hold of.
A fool seeks fire with a lit lantern;
Had he known what fire was,
He could have cooked his meal long ago.`
      }
    ],
    fileMeta: {
      format: 'PDF',
      fileSize: '4.8 MB',
      mimeType: 'application/pdf',
      originalHash: 'd5c22883e1c6674df5026e6328329b3f338d10ee429ea04fae5511b68fbf8fb9',
      downloadName: 'gateless-gate-mumonkan-kyoto-verified.pdf',
      totalWords: 34200
    },
    tags: ['Koans', 'Rinzai', 'Wumen', 'Zhaozhou', 'Meditation', 'Chan'],
    verifiedClean: true
  },
  {
    id: 'zen_miracle_mindfulness',
    title: 'The Miracle of Mindfulness: The Art of Presence',
    originalTitle: 'Phép Lạ Của Sự Tỉnh Thức',
    kanjiScript: '正念的奇蹟',
    author: 'Thich Nhat Hanh',
    authorBio: 'Zen master, poet, peace activist, and founder of Plum Village community who brought mindfulness and engaged Buddhism to global awareness.',
    lineage: 'Plum Village Engaged Buddhism & Lieu Quan Dhyana',
    connectedLibraryId: 'lib_plum_village',
    connectedLibraryName: 'Plum Village Engaged Dharma Repository',
    category: 'MINDFUL_LIVING',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
    year: 1975,
    scrollsOrPages: '8 Chapters (140 Pages)',
    language: 'English (Original Vietnamese / French editions)',
    originalLanguage: 'Vietnamese',
    description: 'A warm, practical guide explaining how to practice mindfulness in every ordinary movement—washing dishes, peeling an orange, drinking tea, walking along a dirt road.',
    quote: 'Smile, breathe and go slowly. There is no way to peace; peace is the way.',
    keyTeachings: [
      'Washing dishes just to wash the dishes—being completely alive in the present moment.',
      'The miracle is not to walk on water or in thin air, but to walk upon the earth.',
      'Conscious breathing is the bridge connecting life to consciousness.'
    ],
    chapters: [
      {
        id: 'mm_ch1',
        title: 'Chapter 1: The Essential Discipline of Breathing',
        subtitle: 'The Present Moment in Ordinary Action',
        readTimeMinutes: 6,
        meditationPrompt: 'Inhaling, I know I am inhaling. Exhaling, I know I am exhaling. Smile to your living lungs.',
        content: `While washing the dishes, you might think of the cup of tea that awaits you afterward, and so you hurry through the chore as though it were a nuisance. But if you think that way, even when you sit down with your cup of tea, you will not be drinking your tea. You will already be thinking of the next task.

Washing the dishes must be the most important thing in your life at that moment. You wash each bowl as if it were a baby Buddha. 

Each breath you take can be an anchor. When you breathe in, be aware that air is entering your body and giving life to millions of cells. When you breathe out, release tension and smile. This is not complicated philosophy; it is returning home to the only island of peace we truly possess: the here and now.`
      },
      {
        id: 'mm_ch2',
        title: 'Chapter 2: The Miracle of Walking on Earth',
        subtitle: 'Touching the Living Soil with Reverence',
        readTimeMinutes: 5,
        meditationPrompt: 'Feel the soles of your feet resting on the ground. The earth supports every step without judgment.',
        content: `People usually consider walking on water or in thin air a miracle. But I think the real miracle is not to walk on water, but to walk on earth. Every day we are engaged in a miracle which we don't even recognize: a blue sky, white clouds, green leaves, the curious eyes of a child—our own two eyes.

Walk as if you are kissing the Earth with your feet. We have caused so much damage to our Mother Earth. Now, with every step, let us offer our love, our peace, and our calm.

Print your peace onto the soil. There is no goal to reach; the journey itself is the arrival.`
      }
    ],
    fileMeta: {
      format: 'EPUB',
      fileSize: '2.4 MB',
      mimeType: 'application/epub+zip',
      originalHash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
      downloadName: 'miracle-of-mindfulness-plumvillage.epub',
      totalWords: 28900
    },
    tags: ['Mindfulness', 'Thich Nhat Hanh', 'Engaged Buddhism', 'Plum Village', 'Breathing', 'Peace'],
    verifiedClean: true
  },
  {
    id: 'zen_shobogenzo',
    title: 'Shōbōgenzō: Treasury of the True Dharma Eye',
    originalTitle: '正法眼藏',
    kanjiScript: '道元禅師 正法眼蔵 (現成公案・有時)',
    author: 'Eihei Dōgen Zenji',
    authorBio: 'Founder of the Sōtō school of Zen in Japan (1200–1253), philosopher of time-being (Uji), and master of just-sitting (Shikantaza).',
    lineage: 'Sōtō Zen Tradition (Eihei-ji)',
    connectedLibraryId: 'lib_kyoto_archives',
    connectedLibraryName: 'Kyoto Zen Archives & Rinzai Heritage',
    category: 'FOUNDATIONAL_KOANS',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80',
    year: 1253,
    scrollsOrPages: '95 Fascicles (320 Pages Selected)',
    language: 'Classical Japanese & Kanbun with Translation',
    originalLanguage: 'Classical Japanese',
    description: 'A philosophical and poetic masterpiece exploring non-duality, the oneness of practice and enlightenment, and the profound metaphysics of time-being (Uji).',
    quote: 'To study the Buddha Way is to study the self. To study the self is to forget the self. To forget the self is to be actualized by myriad things.',
    keyTeachings: [
      'Practice and realization are not sequential; zazen sitting is itself enlightenment in motion.',
      'Time is not an external river passing by; our existence right now IS time (Uji - Time-Being).',
      'When firewood becomes ash, it does not become firewood again; life is thoroughly life, death is thoroughly death.'
    ],
    chapters: [
      {
        id: 'genjo_koan',
        title: 'Fascicle 1: Genjōkōan (Actualizing the Fundamental Point)',
        subtitle: '現成公案',
        originalVerse: '仏道をならふといふは、自己をならふなり。自己をならふといふは、自己をわするるなり。',
        readTimeMinutes: 8,
        meditationPrompt: 'Let the surrounding world advance and illuminate you. Drop the effort to grasp experience.',
        content: `When all dharmas are the Buddha Dharma, there is delusion and realization, practice, life and death, Buddhas and sentient beings.
When myriad dharmas are without self, there is no delusion, no realization, no Buddhas, no sentient beings, no birth and no death.

The Buddha Way leaps clear of abundance and lack; therefore there is birth and death, delusion and realization, beings and Buddhas. Yet though this is so, flowers fall amid our longing, and weeds flourish amid our aversion.

To carry the self forward to realize myriad things is delusion. That myriad things come forth and realize the self is enlightenment.
Those who have great realization of delusion are Buddhas; those who are greatly deluded about realization are ordinary beings.

When you ride in a boat and look at the shore, you mistakenly think the shore is moving. But when you look closely at the boat, you realize it is the boat that moves. In the same way, when you view things with confused mind and body, you mistakenly think your nature is permanent. But when you are intimate with your actual conduct and return to this moment, the truth is plain.`
      },
      {
        id: 'uji_time_being',
        title: 'Fascicle 2: Uji (The Time-Being)',
        subtitle: '有時',
        originalVerse: 'いはゆる有時は、時すでにこれ有なり、有はみな時なり。',
        readTimeMinutes: 7,
        meditationPrompt: 'Recognize that this exact second is not separate from the totality of existence.',
        content: `An ancient Buddha said:
"For the time being, I stand atop the highest peak;
For the time being, I move along the bottom of the deepest ocean;
For the time being, I am three heads and eight arms;
For the time being, I am a staff or a whisk."

Know that time-being means: time is already being, and all being is time.
Do not think that time merely flies away, or that it is not abiding. If time only flew away, there would be a separation between time and you. But when you experience time as it is, you realize you do not exist outside of time.

Every blade of grass, every boulder, every person sitting quietly—each is time itself fulfilling its moment.`
      }
    ],
    fileMeta: {
      format: 'PDF',
      fileSize: '5.6 MB',
      mimeType: 'application/pdf',
      originalHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      downloadName: 'shobogenzo-dogen-kyoto-archives.pdf',
      totalWords: 46100
    },
    tags: ['Dogen', 'Soto Zen', 'Shikantaza', 'Genjokoan', 'Time-Being', 'Japan'],
    verifiedClean: true
  },
  {
    id: 'zen_heart_sutra',
    title: 'The Heart Sutra & Prajñāpāramitā Exposition',
    originalTitle: 'प्रज्ञापारमिताहृदयसूत्रम्',
    kanjiScript: '般若波羅蜜多心經',
    author: 'Bodhisattva Avalokiteshvara & Xuanzang Translation',
    authorBio: 'The core distillation of the Great Wisdom Sutras, chanting daily in monasteries across India, China, Japan, Korea, and Vietnam for two millennia.',
    lineage: 'Mahayana / Madhyamaka Prajnaparamita',
    connectedLibraryId: 'lib_bodhi_palmleaf',
    connectedLibraryName: 'Bodhi Digital Sanskrit & Pali Palm-Leaf Corpus',
    category: 'PALM_LEAF_SUTRAS',
    coverImage: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&auto=format&fit=crop&q=80',
    year: 'c. 100 CE',
    scrollsOrPages: 'Canonical Sutra (260 Characters + Commentary)',
    language: 'Sanskrit transliteration, Classical Chinese, and English',
    originalLanguage: 'Sanskrit',
    description: 'The most recited text in the Buddhist world. Avalokiteshvara demonstrates to Shariputra that form is emptiness, emptiness is form, liberating the mind from all suffering.',
    quote: 'Form is emptiness, emptiness is form. Form does not differ from emptiness; emptiness does not differ from form.',
    keyTeachings: [
      'All phenomena (five aggregates) are devoid of independent, separate self-existence (Svabhava).',
      'Emptiness (Shunyata) is not voidness or vacuum, but limitless interconnected openness.',
      'The great mantra: Gate Gate Paragate Parasamgate Bodhi Svaha (Gone, gone, gone beyond, fully awakened).'
    ],
    chapters: [
      {
        id: 'hs_verse',
        title: 'Chapter 1: The Core Heart Sutra',
        subtitle: 'Prajñāpāramitā Hṛdaya Sūtra',
        originalVerse: '色不異空 空不異色 色即是空 空即是色 / rūpaṃ śūnyatā śūnyataiva rūpam',
        readTimeMinutes: 4,
        meditationPrompt: 'Observe physical sensations in the body. Notice that they shift and change without fixed ownership.',
        content: `When the Bodhisattva Avalokiteshvara was coursing in the deep Prajñāpāramitā, he perceived that all five aggregates are empty, and was saved from all suffering.

Shariputra, form does not differ from emptiness, emptiness does not differ from form.
That which is form is emptiness, that which is emptiness is form.
The same is true of feelings, perceptions, impulses, and consciousness.

Shariputra, all dharmas are marked with emptiness; they do not appear or disappear, are not tainted or pure, do not increase or decrease.
Therefore, in emptiness there is no form, no feeling, no perception, no impulse, no consciousness;
No eyes, no ears, no nose, no tongue, no body, no mind;
No color, no sound, no smell, no taste, no touch, no object of mind;
No realm of eyes and so forth, down to no realm of mind-consciousness;
No ignorance, and no end of ignorance; no old age and death, and no end of old age and death;
No suffering, no cause of suffering, no cessation of suffering, no path.
There is no wisdom, and no attainment.

Because there is nothing to attain, the Bodhisattva relies on Prajñāpāramitā, and his mind is free of hindrances.
Free of hindrances, no fear exists. Far beyond all inverted views, one realizes Nirvana.

Therefore, know that the Prajñāpāramitā is the great holy mantra, the mantra of great knowledge, the unsurpassed mantra.
It is able to relieve all suffering. It is true, not false.
So he proclaimed the Prajñāpāramitā mantra:
Gate Gate Pāragate Pārasaṃgate Bodhi Svāhā!`
      }
    ],
    fileMeta: {
      format: 'MD',
      fileSize: '1.2 MB',
      mimeType: 'text/markdown',
      originalHash: 'fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9',
      downloadName: 'heart-sutra-sanskrit-bodhi-corpus.md',
      totalWords: 12400
    },
    tags: ['Heart Sutra', 'Prajnaparamita', 'Sanskrit', 'Emptiness', 'Shunyata', 'Avalokiteshvara'],
    verifiedClean: true
  },
  {
    id: 'zen_cold_mountain',
    title: 'Cold Mountain Poems (Han Shan)',
    originalTitle: '寒山詩集',
    kanjiScript: '唐 寒山子詩集',
    author: 'Han Shan (The Hermit of Cold Mountain)',
    authorBio: 'Tang Dynasty legendary recluse and poet who scribbled verses on cliff faces, rocks, and trees in the Tiantai mountains.',
    lineage: 'Tang Chan / Daoist Recluse Poetry',
    connectedLibraryId: 'lib_cloud_water',
    connectedLibraryName: 'Cloud-Water Mountain Hermitage Archives',
    category: 'FOREST_POETRY',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
    year: 'c. 750 CE',
    scrollsOrPages: '300 Poems (Selected Hermitage Edition)',
    language: 'Classical Chinese with English Verse Translation',
    originalLanguage: 'Classical Chinese',
    description: 'Rustic, luminous verses of a wanderer living in caves high above human strife, laughing at worldly ambition while watching cloud wisps drift through pine groves.',
    quote: 'My heart is like the autumn moon, perfectly bright in the deep green pool. Nothing can compare with it; tell me, how shall I explain it?',
    keyTeachings: [
      'Simplicity and wild solitude clarify the mind far beyond bustling urban pretension.',
      'Nature is not a backdrop; the moss, cold wind, and mountain rocks are our original face.',
      'Unfettered freedom comes from desiring little and expecting nothing.'
    ],
    chapters: [
      {
        id: 'cm_poems_01',
        title: 'Selection: Songs of the Mountain Recluse',
        subtitle: '寒山道 / The Path to Cold Mountain',
        originalVerse: '吾心似秋月 / 碧潭清皎潔 / 無物堪比倫 / 教我如何說',
        readTimeMinutes: 5,
        meditationPrompt: 'Imagine sitting under tall pine trees. Let the wind blow away accumulated stress.',
        content: `Men ask the way to Cold Mountain.
Cold Mountain: there's no through trail.
In summer, ice doesn't melt,
The rising sun is blurred by swirling fog.
How did I make it here?
My heart is not the same as yours.
If your heart were like mine,
You'd get here in an instant.

* * *

My house is at the foot of the green cliff,
My garden watered by pure mountain spring.
A cold wind rustles through the bamboo,
White clouds linger outside my brushwood door.
Inside, only books and silence,
No visitors arrive with muddy boots.
When I am hungry, I pick pine nuts;
When thirsty, I drink fresh dew.`
      }
    ],
    fileMeta: {
      format: 'PDF',
      fileSize: '3.1 MB',
      mimeType: 'application/pdf',
      originalHash: '3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d',
      downloadName: 'cold-mountain-han-shan-cloudwater.pdf',
      totalWords: 19800
    },
    tags: ['Poetry', 'Han Shan', 'Tang Dynasty', 'Forest', 'Hermit', 'Daoism'],
    verifiedClean: true
  },
  {
    id: 'zen_neuroscience',
    title: 'The Contemplative Brain: Neuroplasticity & Zen Neural Correlates',
    originalTitle: 'Neurobiology of Focused Attention & Open Monitoring',
    kanjiScript: '瞑想と神経可塑性 脳科学論文集',
    author: 'Dr. Elena Vance, Dr. James H. Austin & Richard Davidson',
    authorBio: 'Leading neuroscientists and neurologist authors researching high-amplitude gamma oscillations, default mode network down-regulation, and compassion training.',
    lineage: 'Contemplative Neuroscience & Mind Sciences',
    connectedLibraryId: 'lib_mind_sciences',
    connectedLibraryName: 'Center for Compassion & Mind Sciences',
    category: 'MIND_SCIENCES',
    coverImage: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&auto=format&fit=crop&q=80',
    year: 2024,
    scrollsOrPages: '12 Peer-Reviewed Chapters (240 Pages)',
    language: 'English',
    originalLanguage: 'English',
    description: 'A comprehensive scientific monograph synthesizing 25 years of high-density EEG and fMRI scans of long-term Zen and mindfulness meditators, detailing structural cortical thickening and amygdala down-regulation.',
    quote: 'Zen meditation is not withdrawal from reality; it is the physiological retraining of neurochemical responsiveness from self-referential rumination to open, compassionate awareness.',
    keyTeachings: [
      'Down-regulation of the Default Mode Network (DMN) directly correlates with reduced depressive rumination and ego-clinging.',
      'Sustained zazen fosters synchronized gamma wave oscillations (25–42 Hz) across parietal and frontal cortices.',
      'Mindfulness practice increases gray matter density in the hippocampus and temporoparietal junction within 8 weeks.'
    ],
    chapters: [
      {
        id: 'neuro_ch1',
        title: 'Chapter 1: Quieting the Default Mode Network',
        subtitle: 'Structural Neuroplasticity in Zen Practitioners',
        readTimeMinutes: 7,
        meditationPrompt: 'Observe the stream of automatic self-talk. See it as neural electrical activity rather than absolute truth.',
        content: `When human beings sit quietly without an assigned cognitive task, their brains do not fall silent. Instead, the Default Mode Network (DMN)—anchored primarily in the medial prefrontal cortex (mPFC) and posterior cingulate cortex (PCC)—spikes dramatically into action.
The DMN is the neurological seat of the "autobiographical self": it ruminates over past regrets, projects future anxieties, and reinforces the illusion of a solid, defensive ego identity.

Functional neuroimaging demonstrates that during both focused attention meditation and open monitoring (shikantaza), activation within the mPFC and PCC declines sharply within three to five minutes.
Long-term practitioners exhibit enhanced functional connectivity between the anterior insula and the dorsal anterior cingulate cortex, indicating greater present-moment somatic grounding and dramatically lower reactivity to emotional stressors.

Furthermore, structural MRI reveals measurable preservation of gray matter volume in aging meditators, offsetting the customary cortical thinning observed in non-meditating control groups.`
      }
    ],
    fileMeta: {
      format: 'PDF',
      fileSize: '6.2 MB',
      mimeType: 'application/pdf',
      originalHash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
      downloadName: 'zen-contemplative-neuroscience-stanford-oxford.pdf',
      totalWords: 52000
    },
    tags: ['Neuroscience', 'Neuroplasticity', 'Mindfulness', 'Brain', 'EEG', 'DMN', 'Medicine'],
    verifiedClean: true
  },
  {
    id: 'zen_daodejing',
    title: 'Daodejing: The Watercourse Way of Natural Harmony',
    originalTitle: '道德經',
    kanjiScript: '老子 道德經 五千言',
    author: 'Laozi (Lao Tzu)',
    authorBio: 'Legendary keeper of the imperial archives and sage of ancient China, whose 81 short chapters form the foundation of Daoist philosophy and influenced Zen aesthetics.',
    lineage: 'Classical Daoist Wisdom & Natural Harmony',
    connectedLibraryId: 'lib_cloud_water',
    connectedLibraryName: 'Cloud-Water Mountain Hermitage Archives',
    category: 'DAO_HARMONY',
    coverImage: DAODEJING_COVER_IMAGE,
    year: 'c. 400 BCE',
    scrollsOrPages: '81 Short Verses (112 Pages)',
    language: 'Classical Chinese with Verse Translation',
    originalLanguage: 'Classical Chinese',
    description: 'The poetic testament of non-coercive action (Wu Wei), softness overcoming hardness, and yielding like water to harmonize with the living pulse of nature.',
    quote: 'The supreme good is like water. Water benefits all things and does not compete with them. It stays in places which others despise. Therefore it is close to the Dao.',
    keyTeachings: [
      'Wu Wei: action through non-forcing, yielding to natural current without brittle resistance.',
      'The softest substance in the world penetrates the hardest stone through patient persistence.',
      'Simplicity, patience, and compassion are the three greatest treasures.'
    ],
    chapters: [
      {
        id: 'ddj_ch8',
        title: 'Chapter 8: The Supreme Good Like Water',
        subtitle: '上善若水',
        originalVerse: '上善若水。水善利萬物而不爭，處衆人之所惡，故幾於道。',
        readTimeMinutes: 4,
        meditationPrompt: 'Breathe like water finding its level. Release all muscular tension and rigid expectations.',
        content: `The supreme good is like water.
Water benefits all things without competing with them.
It flows to low places that others disdain;
Therefore it is like the Tao.

In dwelling, live close to the ground.
In thinking, keep to what is simple.
In conflict, be fair and generous.
In governing, do not try to control.
In work, do what you enjoy.
In family life, be completely present.

When you do not compete with others,
No one will compete with you.`
      },
      {
        id: 'ddj_ch16',
        title: 'Chapter 16: Returning to the Root',
        subtitle: '致虛極 守靜篤',
        originalVerse: '致虛極，守靜篤。萬物並作，吾以觀復。',
        readTimeMinutes: 5,
        meditationPrompt: 'Return awareness to stillness. All flourishing things return to their quiet root.',
        content: `Attain utmost emptiness;
Maintain stillness with quiet resolve.
All things flourish and bloom together,
And I watch them return.

Countless plants flourish,
Yet each returns to its root.
Returning to the root is called stillness;
Stillness is called returning to one's natural destiny.
Returning to natural destiny is eternal truth;
Knowing the eternal is enlightenment.

Not knowing the eternal leads to reckless tragedy.
Knowing the eternal brings tolerance,
Tolerance leads to nobility of mind,
Nobility is like heaven,
Heaven is like the Dao,
The Dao is everlasting:
Though the body perishes, there is no decay.`
      }
    ],
    fileMeta: {
      format: 'MD',
      fileSize: '1.8 MB',
      mimeType: 'text/markdown',
      originalHash: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
      downloadName: 'daodejing-watercourse-cloudwater.md',
      totalWords: 15400
    },
    tags: ['Laozi', 'Daodejing', 'Wu Wei', 'Water', 'Nature', 'Stillness', 'Daoism'],
    verifiedClean: true
  }
];
