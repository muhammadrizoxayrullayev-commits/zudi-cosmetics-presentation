/* =========================================================
   ZUDI COSMETICS — Haute Beauté Interactive Script
   Google-Researched Luxury Cosmetics & Perfume Inspection
   ========================================================= */

(function() {
    'use strict';

    // ===== State =====
    let currentSlide = 0;
    const totalSlides = 8;
    let isAnimating = false;
    let touchStartY = 0;
    let touchEndY = 0;
    const ANIMATION_DURATION = 650;

    // ===== DOM Elements =====
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-menu-links a');
    const progressBar = document.querySelector('.slide-progress-bar');
    const currentSlideEl = document.querySelector('.current-slide');
    const nav = document.getElementById('main-nav');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const preloader = document.getElementById('preloader');

    // Controls & Modal Elements
    const btnOverview = document.getElementById('btn-overview');
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const overviewModal = document.getElementById('overview-modal');
    const overviewClose = document.getElementById('overview-close');
    const overviewBackdrop = document.getElementById('overview-backdrop');
    const overviewCards = document.querySelectorAll('.overview-card');

    // Product Detail Modal
    const productModal = document.getElementById('product-detail-modal');
    const pdmClose = document.getElementById('pdm-close');
    const pdmBackdrop = document.getElementById('pdm-backdrop');
    const pdmBody = document.getElementById('pdm-body');

    // =========================================================
    // LUXURY PRODUCT & PERFUME DATABASE (Researched & Structured)
    // =========================================================
    const PRODUCT_DATABASE = {
        'skincare': {
            curationNo: 'CURATION NO. 01',
            department: 'K-BEAUTY & CLINICAL DERMOCOSMETICS',
            title: 'Soins du Visage — Terini Chuqur Tiklovchi & Nurlantiruvchi Ritual',
            image: 'products_display.jpg',
            tagline: 'Koreya va Fransiyaning yetakchi estetik formulalari asosidagi benuqson parvarish',
            description: 'Ushbu to\'plam terining himoya to\'sig\'ini (skin barrier) mustahkamlash, chuqur gidratatsiya va mashhur Koreys "Glass Skin" (oyna kabi tiniq va ichki nurlanuvchi teri) effektini yaratish uchun maxsus jamlangan. Barcha mahsulotlar 100% original bo\'lib, bevosita Janubiy Koreyaning yetakchi laboratoriyalaridan keltirilgan.',
            brands: [
                { name: 'Beauty of Joseon', desc: 'Glow Serum: Propolis + Niacinamide, Relief Sun: Rice + Probiotics SPF50+' },
                { name: 'COSRX', desc: 'Advanced Snail 96 Mucin Power Essence, Centella Blemish Cream' },
                { name: 'Anua', desc: 'Heartleaf 77% Soothing Toner, Heartleaf Pore Control Cleansing Oil' },
                { name: 'Laneige', desc: 'Water Bank Blue Hyaluronic Moisture Cream, Lip Sleeping Mask Berry' },
                { name: 'Mediheal & Round Lab', desc: 'Dokdo 1025 Hydrating Complex, Teatree Care Essential Sheet Masks' }
            ],
            ingredients: [
                { icon: 'fas fa-seedling', name: 'Centella Asiatica (84%)', text: 'Terini chuqur tinchlantiradi, kuperoz, qizarish va yallig\'lanishni bir zumda bartaraf etadi.' },
                { icon: 'fas fa-tint', name: 'Multi-Depth Hyaluronic Acid', text: 'Molekulyar og\'irligi 5 xil bo\'lgan gialuron kislotasi terining chuqur qatlamlarigacha 24 soatlik intensiv namlik beradi.' },
                { icon: 'fas fa-sparkles', name: 'Niacinamide (5%) + Propolis', text: 'Kengaygan poralarni toraytiradi, post-akne izlarini ochartiradi va yuzga sog\'lom porlash beradi.' },
                { icon: 'fas fa-shield-alt', name: 'Bifida & Rice Ferment Kompleksi', text: 'Teri mikrobiomasini kuchaytiradi, erta ajin tushishining oldini oladi va elastiklikni oshiradi.' }
            ],
            routine: [
                { step: '01 / Ikki Bosqichli Tozalash', text: 'Anua gidrofil yog\'i bilan makiyaj va SPFni eritish, so\'ngra mayin pH 5.5 ko\'pik bilan yuvish.' },
                { step: '02 / Tinchlantiruvchi Balans', text: 'Anua Heartleaf 77% toneri bilan terining tabiiy namlik muvozanatini tiklash.' },
                { step: '03 / Chuqur Tiklash & Oziqlantirish', text: 'COSRX Snail Mucin 96 yoki Beauty of Joseon Glow zardobini yuz va bo\'yinga singdirish.' },
                { step: '04 / Namlikni Qulflash & Massaj', text: 'Laneige Water Bank kremi + kvars rolik yordamida yengil limfadrenaj harakatlari.' }
            ],
            expertAdvice: 'Chiroy estetisti Zufarova Dilnozadan ekspert tavsiyasi: "Har qanday go\'zallikning asosi — to\'g\'ri namlangan va tinchlangan teridir. K-Beauty vositalari qatlamlab surtishga mo\'ljallangan bo\'lib, terini og\'irlashtirmasdan ichki nur bag\'ishlaydi. Do\'konimizda har bir mijoz uchun shaxsiy teri diagnostikasi asosida parvarish rejasi tuzib beriladi."',
            origin: 'Janubiy Koreya & Fransiya',
            availability: 'Boutique Flagship Tashkent • Barcha flakonlar mavjud'
        },
        'makeup': {
            curationNo: 'CURATION NO. 02',
            department: 'HAUTE COUTURE MAKEUP & ATELIER',
            title: 'Le Maquillage — Nafis Fransuz & Zamonaviy Vizaj San\'ati',
            image: 'makeup_collection.jpg',
            tagline: 'Professional vizajistlar tanlovi: terini og\'irlashtirmaydigan ipakdek yengil baxmal teksturalar',
            description: 'ZUDI Cosmetics dekorativ kolleksiyasi har bir ayolning tabiiy jozibasini nozik bo\'yoqlar bilan ochib berishga qaratilgan. Mahsulotlar yuqori pigmentatsiyaga ega bo\'lib, 16 soat davomida o\'z ko\'rinishini yo\'qotmaydi va yuzda mutlaqo sezilmaydi.',
            brands: [
                { name: 'Couture Velvet Lipsticks', desc: 'Pillow Pink, Rose Damas, Vintage Terracotta, Ruby Allure — baxmal mat qoplama' },
                { name: '18-Shade Rose Gold Palette', desc: 'Ipakdek mayin mat tuslar, metallik duoxromlar va nur taratuvchi shimmers' },
                { name: 'Luminous Silk Foundation', desc: 'Second-skin (ikkinchi teri) effekti bilan teshikchalarni to\'sib qo\'ymaydigan tonal baza' },
                { name: 'Featherlight Setting Powder', desc: 'Yengil fiksatsiya, yaltirashni nazorat qiluvchi mineral shaffof fiksator pudra' },
                { name: 'Handcrafted Atelier Brushes', desc: 'Yuqori sifatli nozik toladan tayyorlangan professional vizaj cho\'tkalari to\'plami' }
            ],
            ingredients: [
                { icon: 'fas fa-feather-alt', name: 'Mikronlashtirilgan Ipak Pudrasi', text: 'Ajin va poralarga o\'tirib qolmaydi, yuzga fotoshopdek silliqlik va yumshoq fokus beradi.' },
                { icon: 'fas fa-heart', name: 'Jojoba & Argan Oziqlantiruvchi Moylar', text: 'Baxmal lab bo\'yoqlarida lab terisini aslo quritmaydi, kun bo\'yi komfort va namlikni saqlaydi.' },
                { icon: 'fas fa-sun', name: 'Yorug\'lik Qaytaruvchi Mineral Zarrachalar', text: 'Yuzga charchoq alomatlarini ketkazuvchi yoshartiruvchi mayin nur (Luminous Glow) beradi.' },
                { icon: 'fas fa-check-circle', name: 'Gipoallergen & Non-Comedogenic', text: 'Poralarni berkitmaydi, nozik, allergiyaga moyil va sezgir terilarga ham 100% mos.' }
            ],
            routine: [
                { step: '01 / Terini Tayyorlash', text: 'Yuzga namlantiruvchi yengil baza va ko\'z osti praymerini yupqa surtib olish.' },
                { step: '02 / Mukammal Ohang', text: 'Luminous Silk tonal kremini nam sponj yordamida yengil harakatlar bilan yoyish.' },
                { step: '03 / Ko\'z & Konturing', text: 'Rose Gold palitrasidan iliq shaftoli va shokolad tuslari bilan ko\'zlarga chuqurlik berish.' },
                { step: '04 / Nafis Lablar', text: 'Velvet Rose baxmal lab bo\'yog\'i va fiksator pudra bilan benuqson yakun yasash.' }
            ],
            expertAdvice: 'Chiroy estetisti Zufarova Dilnozadan ekspert tavsiyasi: "Makiyajda eng muhim qoida — kontrast va tabiiylik uyg\'unligidir. Agar ko\'zlarga boy tuslar bersangiz, lablarga baxmal nude tuslarni tanlang. Bizning butikimizda har bir mijozning rang turiga (color type) mos mahsulotlarni shaxsan tanlab beramiz."',
            origin: 'Fransiya, Italiya va Koreya',
            availability: 'Do\'konda testerlardan bepul sinab ko\'rish imkoniyati mavjud'
        },
        'perfume': {
            curationNo: 'CURATION NO. 03',
            department: 'HAUTE PARFUMERIE & OTLIVANTLAR',
            title: 'Haute Parfumerie — Eksklyuziv Selektiv Atirlar & Otlivantlar',
            image: 'perfumery.jpg',
            tagline: 'O\'zingizdan keyin unutilmas xotira va boy shleyf qoldiruvchi muattar durdonalar',
            description: 'ZUDI Cosmetics parfyumeriya bo\'limi dunyoning eng nufuzli niche uylarining sara durdonalarini o\'zida jamlagan. Butikimizda nafaqat to\'liq flakonlar, balki original atirlardan tayyorlanuvchi qulay hajmdagi "Otlivantlar" ham mavjud bo\'lib, istagan atirni terida sinab ko\'rish imkonini beradi.',
            brands: [
                { name: 'Maison Francis Kurkdjian', desc: 'Baccarat Rouge 540 Extrait, Grand Soir, Gentle Fluidity Gold — afsonaviy amber-zafaron' },
                { name: 'Marc-Antoine Barrois', desc: 'Ganymede, Encelade, Tilia — zamonaviy kosmopolit mineral-charm koutyuri' },
                { name: 'Ex Nihilo Paris', desc: 'Fleur Narcotique, Lust in Paradise — gipnoz qiluvchi fransuz gullar simfoniyasi' },
                { name: 'Byredo', desc: 'Bal d\'Afrique, Gypsy Water, Blanche — zamonaviy Shvetsiya minimalizmi va tozaligi' },
                { name: 'Kilian Paris', desc: 'Angels\' Share, Black Phantom, Good Girl Gone Bad — konyak va praline qandolati' },
                { name: 'Tom Ford Private Blend', desc: 'Lost Cherry, Tobacco Vanille, Bitter Peach — boy gurman va sharqona eliksirlar' }
            ],
            ingredients: [
                { icon: 'fas fa-wind', name: 'Top Notalar (Boshlanish)', text: 'Italiya bergamoti, xushbo\'y mandarin, qizil zafaron, pushti murch va mineral akkordlar.' },
                { icon: 'fas fa-gem', name: 'Yurak Notalari (Asosiy Ruh)', text: 'Damashq atirguli, osmantus, Yasmin sambak, eman konyak bochkalari va oq gullar.' },
                { icon: 'fas fa-fire', name: 'Baza Notalari (Boy Shleyf)', text: 'Kulrang amber (Ambergris), Akigalawood, Madagaskar vanili, tutunli oq mushk va sadr.' },
                { icon: 'fas fa-certificate', name: 'Konsentratsiya Standarti', text: 'Faqat Extrait de Parfum (25-30% moy) va Eau de Parfum — kiyimda 24 soatdan ortiq poydorlik.' }
            ],
            routine: [
                { step: '01 / To\'g\'ri Nuqtalar', text: 'Atirni puls uradigan joylarga (bilak, bo\'yin tomirlari, quloq orqasi) 15-20 sm masofadan seping.' },
                { step: '02 / Oltin Qoida', text: 'Atir sepgach bilaklarni aslo bir-biriga ishqalamang — bu xushbo\'y notalarning molekulalarini buzadi.' },
                { step: '03 / Sillage Buluti', text: 'Havoga bir purkab, uning mayin buluti (scent cloud) ostidan o\'tish atirni butun libosga bir tekis taratadi.' },
                { step: '04 / Otlivantlar Qulayligi', text: '3ml, 5ml, 10ml va 15ml hajmdagi original otlivantlarni sumkada olib yurish nihoyatda qulay.' }
            ],
            expertAdvice: 'Chiroy estetisti Zufarova Dilnozadan ekspert tavsiyasi: "Atir — siz xonadan chiqqaningizdan keyin ham siz haqingizda xotira qoldiruvchi ko\'rinmas kiyimdir. Otlivant xizmati orqali birdaniga qimmat butun flakon sotib olmasdan, o\'zingizga mos 3-4 xil eksklyuziv atirlardan iborat shaxsiy iforlar garderobini yaratishingiz mumkin."',
            origin: 'Fransiya, Italiya, Shvetsiya, Buyuk Britaniya',
            availability: 'Otlivantlar: 3ml, 5ml, 10ml, 15ml • 100% Original kafolat'
        },
        'cat-skincare': {
            curationNo: 'DÉPARTEMENT 01',
            department: 'DERMOCOSMÉTIQUE & K-BEAUTY',
            title: 'Soins Essentiels — Terini Chuqur Tiklash va Yoshartirish',
            image: 'products_display.jpg',
            tagline: 'Klinik darajadagi xavfsiz va samarali terini parvarish qilish vositalari',
            description: 'Ushbu bo\'limda muammoli, quruq, yog\'li va yosh bilan o\'zgarayotgan terilar uchun dunyoning yetakchi dermatologik brendlari to\'plangan. Akne, pigmentatsiya, kuperoz va suvsizlanish muammolarini ilmiy asosda bartaraf etishga mo\'ljallangan.',
            brands: [
                { name: 'K-Beauty Liderlari', desc: 'Beauty of Joseon, COSRX, Anua, Round Lab, Mediheal' },
                { name: 'Dermatologik Formulalar', desc: 'Gialuron kislotasi, Retinol 0.2%, Salitsil BHA kislotalari, Keramidlar' }
            ],
            ingredients: [
                { icon: 'fas fa-shield-virus', name: 'Keramidlar Kompleksi', text: 'Teri lipid to\'sig\'ini tiklaydi, tashqi shamol va sovuqdan ishonchli asraydi.' },
                { icon: 'fas fa-magic', name: 'Gialuron & Peptidlar', text: 'Mikroajinlarni ichkaridan to\'ldirib, yuzga yoshlik va elastiklik baxsh etadi.' }
            ],
            routine: [
                { step: 'Ertalabki tartib', text: 'Ko\'pik -> Toner -> Antioksidant zardob -> Quyoshdan saqlovchi SPF50 krem.' },
                { step: 'Kechki tartib', text: 'Gidrofil moy -> Tiklovchi toner -> Peptidli emulsiya -> Oziqlantiruvchi tungi krem.' }
            ],
            expertAdvice: 'Zufarova Dilnoza: "Terini parvarish qilishda eng muhim narsa — muntazamlik va to\'g\'ri tanlangan bosqichlardir. Mutaxassis sifatida har bir mijozimizga o\'z teri turiga mos individual yechim tanlaymiz."',
            origin: 'Janubiy Koreya, Fransiya',
            availability: 'Mavjud: Do\'konda va yetkazib berish bilan'
        },
        'cat-makeup': {
            curationNo: 'DÉPARTEMENT 02',
            department: 'COUTURE MAKEUP ATELIER',
            title: 'Couture Makeup — Nafis Fransuz va Yevropa Vizaji',
            image: 'makeup_collection.jpg',
            tagline: 'Yuz terisini og\'irlashtirmaydigan, boy pigmentli dekorativ vositalar',
            description: 'Kundalik yengil "nude" makiyajdan to tantanali kechki obrazlargacha kerak bo\'ladigan barcha vositalar. Baxmal lab bo\'yoqlari, nur taratuvchi xaylayterlar, mineral pudralar va ko\'z palitralari.',
            brands: [
                { name: 'Dekorativ Liderlar', desc: 'Velvet Matte Lipsticks, Rose Gold Palettes, Luminous Silk Bases' },
                { name: 'Aksessuarlar', desc: 'Professional sintetik cho\'tkalar, sponjlar, fiksator spreylar' }
            ],
            ingredients: [
                { icon: 'fas fa-feather', name: 'Ipak Mineral Zarrachalari', text: 'Yuzda og\'irlik sezilmaydi, kun davomida turg\'unlik saqlanadi.' },
                { icon: 'fas fa-spa', name: 'E Vitamini va O\'simlik Moylar', text: 'Makiyaj paytida ham terini namlantirib, parvarishlab turadi.' }
            ],
            routine: [
                { step: 'Vizaj qadamlari', text: 'Praymer -> Tonal baza -> Korrektor -> Ko\'z va qoshlar -> Baxmal lab bo\'yog\'i -> Fiksator.' }
            ],
            expertAdvice: 'Zufarova Dilnoza: "Chiroyli makiyaj — bu yuzdagi tabiiy nur va chiziqlarni go\'zal ta\'kidlash demakdir."',
            origin: 'Fransiya, Italiya, Koreya',
            availability: 'Barcha tuslar do\'konimizda mavjud'
        },
        'cat-kbeauty': {
            curationNo: 'DÉPARTEMENT 03',
            department: 'K-BEAUTY INNOVATION',
            title: 'K-Beauty Revolution — Koreys "Glass Skin" Fenomeni',
            image: 'korean_beauty.jpg',
            tagline: 'Tabiiy giyohlar va zamonaviy biotexnologiyalar uyg\'unligi',
            description: 'Koreys kosmetikasi butun dunyo go\'zallik standartlarini o\'zgartirdi. Centella, shilliqurt musini, guruch suti, propolis va fermentlangan ekstraktlar asosidagi formulalar teriga ichki nur va bolalardek mayinlik beradi.',
            brands: [
                { name: 'Afsonaviy Brendlar', desc: 'Beauty of Joseon, COSRX, Anua, Laneige, Skin1004, Round Lab' },
                { name: 'Maxsus Hitlar', desc: 'Relief Sun SPF50+, Snail Mucin 96, Heartleaf 77 Toner, Lip Sleeping Mask' }
            ],
            ingredients: [
                { icon: 'fas fa-leaf', name: 'Hanbang (Sharq Tabobati)', text: 'Jenshen, zanjabil, yashil choy va guruch kepagi ekstraktlari.' },
                { icon: 'fas fa-gem', name: 'Fermentlangan Biotexnologiya', text: 'Teri tomonidan 3 baravar tez va chuqurroq o\'zlashtiriladi.' }
            ],
            routine: [
                { step: 'Koreys 7-Skin Metodi', text: 'Tonerni bir necha bor yengil qatlamlab singdirish orqali favqulodda yorqinlikka erishish.' }
            ],
            expertAdvice: 'Zufarova Dilnoza: "Koreys parvarishining kuchi uning muloyimligidadir — u terini shikastlamaydi, balki o\'zining tabiiy kuchini uyg\'otadi."',
            origin: 'Janubiy Koreya (Seul)',
            availability: '100% Original Koreya partiyalari'
        },
        'cat-perfume': {
            curationNo: 'DÉPARTEMENT 04',
            department: 'PARFUMERIE SÉLECTIVE',
            title: 'Parfumerie Niche — Fransuz va Sharqiy Selektiv Atirlar',
            image: 'perfumery.jpg',
            tagline: 'O\'ziga xos shaxsiy ifor va takrorlanmas xarizma',
            description: 'Niche parfyumeriya — bu ommaviy atirlardan farqli o\'laroq, eng nodir va qimmatbaho tabiiy ekstraktlardan yaratilgan san\'at asaridir. Butikimizda butun flakonlar hamda qulay 3-15ml otlivantlar taqdim etiladi.',
            brands: [
                { name: 'Niche Uylari', desc: 'MFK (Baccarat), Marc-Antoine Barrois (Ganymede), Ex Nihilo, Byredo, Kilian, Tom Ford' },
                { name: 'Formatlar', desc: 'To\'liq 50ml, 100ml flakonlar hamda 3ml, 5ml, 10ml, 15ml original otlivantlar' }
            ],
            ingredients: [
                { icon: 'fas fa-gem', name: 'Nodir Moylar va Ekstraktlar', text: 'Ambergris, Akigalawood, Damashq atirguli, Madagaskar vanili.' }
            ],
            routine: [
                { step: 'Ifor kiyish', text: 'Puls nuqtalariga va soch uchlariga sepish tavsiya etiladi.' }
            ],
            expertAdvice: 'Zufarova Dilnoza: "Otlivantlar orqali har kuni o\'z kayfiyatingizga mos yangi iforni kashf etishingiz mumkin."',
            origin: 'Fransiya, Italiya, Shvetsiya',
            availability: 'Otlivantlar har kuni do\'konda quyib beriladi'
        },
        'cat-botanical': {
            curationNo: 'DÉPARTEMENT 05',
            department: 'BOTANICAL & NATURAL',
            title: 'Botanical Beauty — Belarus va Yevropaning Tabiiy Kosmetikasi',
            image: 'products_display.jpg',
            tagline: 'Tabiat in\'omi: xavfsiz, o\'simlik asosidagi toza go\'zallik',
            description: 'Belarus va Yevropaning sara tabiiy brendlari — toza organik moylar, o\'simlik ekstraktlari va ekologik toza tarkibiy qismlarga boy. Yuqori sifat va juda qulay narx mutanosibligi.',
            brands: [
                { name: 'Belarus Kosmetikasi', desc: 'Bielita, Relouis, Luxvisage, Masstige sara kolleksiyalari' },
                { name: 'Yo\'nalish', desc: 'Soch va tana parvarishi, tabiiy kremlar va yengil bo\'yoqlar' }
            ],
            ingredients: [
                { icon: 'fas fa-seedling', name: 'Tabiiy Ekstraktlar', text: 'Moychechak, oblepixa, zaytun moyi va tabiiy kollagen.' }
            ],
            routine: [
                { step: 'Kundalik foydalanish', text: 'Ertalab va kechqurun terini va sochlarni tabiiy vitaminlar bilan boyitish.' }
            ],
            expertAdvice: 'Zufarova Dilnoza: "Belarus kosmetikasi o\'zining ishonchli sifati va tabiiy tarkibi bilan har doim mijozlarimiz mehrini qozonib kelgan."',
            origin: 'Belarus va Sharqiy Yevropa',
            availability: 'Keng assortiment do\'konda mavjud'
        },
        'cat-tools': {
            curationNo: 'DÉPARTEMENT 06',
            department: 'BEAUTY ATELIER & ACCESSOIRES',
            title: 'Atelier Accessoires — Professional Vizaj Cho\'tkalari va Asboblari',
            image: 'makeup_collection.jpg',
            tagline: 'Benuqson makiyaj va estetik parvarish uchun professional qurollar',
            description: 'Yuqori sifatli vizaj cho\'tkalari, tabiiy tog\' billuri va kvars roliklar, gua-sha qirg\'ichlari hamda ergonomik vizaj aksessuarlari.',
            brands: [
                { name: 'Aksessuarlar', desc: 'Rose Gold cho\'tkalar to\'plami, Pushti Kvars Roliklar, Gua Sha toshlari, Sponjlar' }
            ],
            ingredients: [
                { icon: 'fas fa-gem', name: 'Tabiiy Kvars va Mineral Toshlar', text: 'Limfadrenaj massaj yordamida yuz shishlarini bir zumda ketkazadi va lifting beradi.' }
            ],
            routine: [
                { step: 'Massaj qoidasi', text: 'Yuzga zardob surtib, kvars rolik bilan markazdan chakkalarga qarab 5-10 daqiqa yengil massaj qilish.' }
            ],
            expertAdvice: 'Zufarova Dilnoza: "Kvars rolik bilan har tong 5 daqiqalik massaj qon aylanishini kuchaytiradi va yuzingizga tabiiy yoshlik baxsh etadi."',
            origin: 'Koreya, Yaponiya, Germaniya',
            availability: 'Sovg\'abop qutilarda mavjud'
        },
        'lookbook-1': {
            curationNo: 'LOOKBOOK NO. 01',
            department: 'FLAGSHIP ATMOSPHERE',
            title: 'ZUDI Cosmetics Flagship Boutique — Toshkentdagi Go\'zallik Makoni',
            image: 'store_interior.jpg',
            tagline: 'Shinam, zamonaviy va nafis estetikaga ega qulay butik muhiti',
            description: 'Bizning Toshkentdagi flagman butikimiz mijozlarimiz uchun eng qulay sharoitda yaratilgan. Bu yerda barcha mahsulotlarni bemalol ko\'rib, testerlardan sinab ko\'rishingiz va chiroy estetistidan shaxsiy maslahat olishingiz mumkin.',
            brands: [
                { name: 'Xizmatlar', desc: 'Professional tester zona, individual konsultatsiya, sovg\'abop qadoqlash' }
            ],
            ingredients: [
                { icon: 'fas fa-heart', name: 'Mijozlarga Ehtirom', text: 'Har bir mehmonimizga samimiy g\'amxo\'rlik va ekspert darajasidagi e\'tibor.' }
            ],
            routine: [
                { step: 'Do\'konga tashrif', text: 'Toshkent shahri markazida joylashgan. Har kuni soat 09:00 dan 21:00 gacha xizmatingizdamiz.' }
            ],
            expertAdvice: 'Zufarova Dilnoza: "Bizning butikimiz — bu shunchaki do\'kon emas, ayollar o\'zlarini go\'zal va baxtli his qiladigan estetik maskandir."',
            origin: 'Toshkent, O\'zbekiston',
            availability: 'Har kuni ochiq • 09:00 - 21:00'
        },
        'lookbook-6': {
            curationNo: 'LOOKBOOK NO. 06',
            department: 'ICONIC ELEGANCE',
            title: 'Go\'zallik va Nafosat Timsoli — Sizning Tabiiy Jozibangiz',
            image: 'beauty_model.jpg',
            tagline: 'To\'g\'ri parvarish qilingan teri — eng yaxshi libosdir',
            description: 'ZUDI Cosmetics falsafasining asosi — har bir ayolning tabiiy go\'zalligini yuksaltirishdir. Teri parvarishi, to\'g\'ri makiyaj va o\'ziga xos muattar ifor ayolga tengsiz ishonch bag\'ishlaydi.',
            brands: [
                { name: 'ZUDI Falsafasi', desc: 'Yuqori sifat, toza ingredientlar, xavfsizlik va yuksak natija' }
            ],
            ingredients: [
                { icon: 'fas fa-sparkles', name: 'Tabiiy Nur', text: 'Sog\'lom, namlangan va parvarishlangan terining betakror jilosi.' }
            ],
            routine: [
                { step: 'Shaxsiy dastur', text: 'Instagram orqali yozing yoki butikimizga tashrif buyuring — siz uchun eng yaxshisini tanlaymiz.' }
            ],
            expertAdvice: 'Zufarova Dilnoza: "O\'zingizga vaqt ajrating, go\'zalligingizni seving — ZUDI Cosmetics esa sizning ishonchli yo\'ldoshingiz bo\'ladi."',
            origin: 'ZUDI Cosmetics • Zufarova Dilnoza',
            availability: 'Online & Offline mavjud'
        }
    };

    // =========================================================
    // PRODUCT DETAIL MODAL CONTROLLER
    // =========================================================
    function openProductDetail(id) {
        const data = PRODUCT_DATABASE[id];
        if (!data || !productModal || !pdmBody) return;

        // Build Brands list HTML
        let brandsHtml = '';
        if (data.brands && data.brands.length > 0) {
            brandsHtml = `
                <div class="pdm-section">
                    <h4 class="pdm-section-title"><i class="fas fa-crown"></i> Bestseller Brendlar & Assortiment</h4>
                    <div class="pdm-brands-grid">
                        ${data.brands.map(b => `
                            <div class="pdm-brand-card">
                                <strong>${b.name}</strong>
                                <span>${b.desc}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Build Ingredients HTML
        let ingredientsHtml = '';
        if (data.ingredients && data.ingredients.length > 0) {
            ingredientsHtml = `
                <div class="pdm-section">
                    <h4 class="pdm-section-title"><i class="fas fa-flask"></i> Faol Moddalar & Notalar Tarkibi</h4>
                    <div class="pdm-ingredients-grid">
                        ${data.ingredients.map(ing => `
                            <div class="pdm-ing-item">
                                <div class="pdm-ing-icon"><i class="${ing.icon}"></i></div>
                                <div>
                                    <h5>${ing.name}</h5>
                                    <p>${ing.text}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Build Routine HTML
        let routineHtml = '';
        if (data.routine && data.routine.length > 0) {
            routineHtml = `
                <div class="pdm-section">
                    <h4 class="pdm-section-title"><i class="fas fa-check-circle"></i> Qo'llash Tartibi & Ekspert Tavsiyasi</h4>
                    <div class="pdm-routine-list">
                        ${data.routine.map(r => `
                            <div class="pdm-routine-step">
                                <span class="step-num">${r.step}</span>
                                <p>${r.text}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Render full modal layout
        pdmBody.innerHTML = `
            <div class="pdm-layout">
                <div class="pdm-media-col">
                    <div class="pdm-img-wrap">
                        <img src="${data.image}" alt="${data.title}" class="pdm-img">
                        <div class="pdm-img-badge">${data.curationNo}</div>
                        <div class="pdm-seal-badge">
                            <img src="logo_circular.png" alt="ZUDI Seal">
                        </div>
                    </div>
                    <div class="pdm-quick-meta">
                        <div class="pdm-meta-item">
                            <i class="fas fa-globe-asia"></i>
                            <div>
                                <strong>Ishlab Chiqarilgan:</strong>
                                <span>${data.origin}</span>
                            </div>
                        </div>
                        <div class="pdm-meta-item">
                            <i class="fas fa-certificate"></i>
                            <div>
                                <strong>Holati:</strong>
                                <span>${data.availability}</span>
                            </div>
                        </div>
                    </div>
                    <a href="https://www.instagram.com/zudi_cosmetics/" target="_blank" class="pdm-vip-btn">
                        <i class="fab fa-instagram"></i>
                        <span>Instagramda Buyurtma / Maslahat</span>
                    </a>
                </div>

                <div class="pdm-info-col">
                    <span class="pdm-dept-tag">${data.department}</span>
                    <h2 class="pdm-title">${data.title}</h2>
                    <p class="pdm-tagline">${data.tagline}</p>

                    <div class="pdm-desc-box">
                        <p>${data.description}</p>
                    </div>

                    ${brandsHtml}
                    ${ingredientsHtml}
                    ${routineHtml}

                    <div class="pdm-quote-box">
                        <div class="pdm-quote-icon"><i class="fas fa-quote-left"></i></div>
                        <p>${data.expertAdvice}</p>
                    </div>

                    <div class="pdm-footer-cta">
                        <a href="https://www.instagram.com/zudi_cosmetics/" target="_blank" class="btn-primary">
                            <span>Instagram @zudi_cosmetics orqali so'rash</span>
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;

        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeProductDetail() {
        if (productModal) {
            productModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (pdmClose) pdmClose.addEventListener('click', closeProductDetail);
    if (pdmBackdrop) pdmBackdrop.addEventListener('click', closeProductDetail);

    // Make globally accessible
    window.openProductDetail = openProductDetail;
    window.closeProductDetail = closeProductDetail;

    // =========================================================
    // SMART AI BEAUTY ADVISOR & 'NEGA AYNAN ZUDI?' CONTROLLER
    // =========================================================
    const AI_ADVICE_DATABASE = {
        'glass-skin': {
            icon: 'fas fa-tint',
            title: 'Koreys "Glass Skin" (Oyna Kabi Tiniq va Nurli Teri) Formulalari',
            whyZudi: 'Bozorda Koreys vositalarining arzon replikalari juda ko\'p bo\'lib, ular poralarni bekitib toshma chiqaradi. ZUDI Cosmetics esa bevosita Janubiy Koreya (Seul) laboratoriyalaridan keltirilgan, KFDA xalqaro sertifikatiga ega 100% asl partiyalarni kafolatlaydi va tonerni bir necha bor qatlamlab singdirish orqali haqiqiy "oyna terisi"ga erishishni o\'rgatadi.',
            bestMatch: 'Beauty of Joseon (Glow Serum: Propolis + Niacinamide) + Anua Heartleaf 77% Soothing Toner + Laneige Water Bank Moisture Cream',
            activeIngredients: 'Centella Asiatica 84%, Gialuron kislotasi (5 xil molekulyar og\'irlik), Propolis (60%) va Guruch kepagi ekstrakti',
            expectedResult: '7 kunda yuzdagi quruqlik va xiralik yo\'qoladi. 14 kunda yuz ichkaridan namlangan, oyna kabi silliq va nurlanuvchi holatga keladi.',
            estheticianTip: 'Zufarova Dilnoza: "Glass skin siri — tonerni kamida 2-3 marta qatlamlab singdirish va so\'ngra namlikni peptidli krem bilan qulflashdir."',
            actionText: 'Glass Skin To\'plamini Instagramda Buyurtma Qilish'
        },
        'acne-pores': {
            icon: 'fas fa-shield-virus',
            title: 'Akne, Qizarish, Kengaygan Poralarni Davolash & Tiklash',
            whyZudi: 'Ko\'pchilik noto\'g\'ri spirtli vositalar ishlatib, terining lipid to\'sig\'ini buzib qo\'yadi. ZUDI da chiroy estetisti nazorati ostida teri to\'sig\'ini shikastlamasdan, akne bakteriyalarini yo\'qotuvchi va poralarni chuqur tozalovchi nozik klinik formulalar beriladi.',
            bestMatch: 'COSRX Snail Mucin 96 Essence + Anua Heartleaf Pore Control Cleansing Oil + COSRX Centella Blemish Cream',
            activeIngredients: 'Centella Asiatica (84%), Salitsil (BHA) kislotasi, Keramidlar kompleksi va Choy daraxti ekstrakti',
            expectedResult: '3 kunda qizarish va yallig\'lanish bosiladi. 10 kunda poralar torayib, teri relyefi sezilarli darajada tekislanadi.',
            estheticianTip: 'Zufarova Dilnoza: "Aknega moyil teriga birinchi navbatda tinchlantiruvchi Centella va to\'g\'ri ikki bosqichli tozalash kerak — terini aslo quritib tashlamang."',
            actionText: 'Akne & Pora Parvarishini So\'rash'
        },
        'niche-sillage': {
            icon: 'fas fa-wind',
            title: '24 Soatlik Poydor Shleyfli Niche & Selektiv Iforlar',
            whyZudi: 'Ommaviy do\'konlarda selektiv atirlarning 100ml flakoni $200-$400 turadi va yoqmay qolsa behuda pul ketadi. ZUDI butikida esa har bir mijoz uchun original flakondan 3ml, 5ml, 10ml, 15ml sof shisha atomayzerga Otlivant qilib beriladi. Kichik narxga Parij va Nitssaning eng qimmat iforlarini sinash mumkin.',
            bestMatch: 'Marc-Antoine Barrois (Ganymede) + MFK (Baccarat Rouge 540 Extrait) + Byredo (Bal d\'Afrique) Otlivantlari',
            activeIngredients: 'Tabiiy Ambergris (kulrang amber), Akigalawood, Damashq atirguli va Madagaskar vanili konsentrati (25-30%)',
            expectedResult: 'Kiyimda 24-48 soatdan ortiq saqlanuvchi, siz o\'tganingizdan keyin ham atrofingizdagi insonlarni maftun etuvchi oliyjanob shleyf.',
            estheticianTip: 'Zufarova Dilnoza: "Selektiv atir — sizning xarakteringiz. 5ml otlivant bilan 1 oy davomida iforni terida bemalol sinab ko\'rishingiz mumkin."',
            actionText: 'Original Otlivantlarni Tanlash'
        },
        'velvet-makeup': {
            icon: 'fas fa-feather',
            title: 'Fotoshop Effekti Beruvchi, Terida Sezilmaydigan Baxmal Vizaj',
            whyZudi: 'Oddiy dekorativ vositalar yuzda og\'ir niqob hosil qiladi va ajinlarga to\'planib qoladi. ZUDI kolleksiyasidagi ipakdek yengil koutyur bo\'yoqlari terining tabiiy nafas olishini ta\'minlaydi va 16 soat davomida o\'chib ketmaydi.',
            bestMatch: 'Luminous Silk Foundation + Velvet Rose Lipsticks + Rose Gold 18-Shade Palette + Rose Quartz Roller',
            activeIngredients: 'Ipak mineral mikronlari, E vitamini, Argan va Jojoba oziqlantiruvchi tabiiy moylari',
            expectedResult: '16 soat davomida o\'zgarmaydigan, yuzni yoshartiruvchi, fotokameralar oldida mayin baxmal ko\'rinish.',
            estheticianTip: 'Zufarova Dilnoza: "Go\'zal vizajning siri — teriga mos tonal asos va baxmal lab bo\'yog\'i kontrastidadir."',
            actionText: 'Vizajist Maslahatini Olish'
        }
    };

    function switchWhyTab(tabName) {
        const tabs = ['matrix', 'ai', 'privileges'];
        tabs.forEach(function(t) {
            const btn = document.getElementById('wtab-' + t);
            const panel = document.getElementById('wpanel-' + t);
            if (btn) btn.classList.toggle('active', t === tabName);
            if (panel) panel.classList.toggle('active', t === tabName);
        });

        if (tabName === 'ai') {
            runAiAnalysis('glass-skin');
        }
    }

    function runAiAnalysis(goalKey) {
        const data = AI_ADVICE_DATABASE[goalKey] || AI_ADVICE_DATABASE['glass-skin'];
        const chips = document.querySelectorAll('.ai-chip');
        chips.forEach(function(chip) {
            chip.classList.toggle('active', chip.id === 'chip-' + goalKey);
        });

        const resultCard = document.getElementById('ai-result-card');
        if (!resultCard) return;

        // Show brief luxury scanning state
        resultCard.innerHTML = `
            <div class="ai-scanning-state">
                <div class="ai-scan-icon"><i class="fas fa-microchip"></i></div>
                <div class="ai-scan-text">
                    <h4>Sun'iy Intellekt Tahlil Qilmoqda...</h4>
                    <p>ZUDI estetik laboratoriyasi ma'lumotlar bazasi bilan solishtirilmoqda</p>
                </div>
            </div>
        `;

        setTimeout(function() {
            resultCard.innerHTML = `
                <div class="ai-card-inner">
                    <div class="ai-card-top">
                        <div class="ai-badge-group">
                            <span class="ai-status-pill"><i class="fas fa-check-circle"></i> AI TAHLIL YAKUNLANDI</span>
                            <span class="ai-match-pill"><i class="fas fa-sparkles"></i> 100% ANIQLIK</span>
                        </div>
                        <h3 class="ai-result-title"><i class="${data.icon}"></i> ${data.title}</h3>
                    </div>

                    <div class="ai-rationale-box">
                        <div class="ai-box-badge"><i class="fas fa-lightbulb"></i> NEGA AYNAN ZUDI TANLANISHI SHART?</div>
                        <p>${data.whyZudi}</p>
                    </div>

                    <div class="ai-details-grid">
                        <div class="ai-detail-item">
                            <div class="ai-item-label"><i class="fas fa-crown"></i> Tavsiya Etiluvchi ZUDI Formulalari:</div>
                            <div class="ai-item-val">${data.bestMatch}</div>
                        </div>
                        <div class="ai-detail-item">
                            <div class="ai-item-label"><i class="fas fa-flask"></i> Faol Moddalar (Ingredients):</div>
                            <div class="ai-item-val">${data.activeIngredients}</div>
                        </div>
                        <div class="ai-detail-item">
                            <div class="ai-item-label"><i class="fas fa-hourglass-half"></i> Kutiladigan Aniq Natija:</div>
                            <div class="ai-item-val result-highlight">${data.expectedResult}</div>
                        </div>
                        <div class="ai-detail-item quote-item">
                            <div class="ai-item-label"><i class="fas fa-user-md"></i> Chiroy Estetisti Zufarova Dilnozadan:</div>
                            <div class="ai-item-val expert-val">${data.estheticianTip}</div>
                        </div>
                    </div>

                    <div class="ai-card-footer">
                        <a href="https://www.instagram.com/zudi_cosmetics/" target="_blank" class="btn-primary">
                            <i class="fab fa-instagram"></i>
                            <span>${data.actionText}</span>
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            `;
        }, 180);
    }

    window.switchWhyTab = switchWhyTab;
    window.runAiAnalysis = runAiAnalysis;

    // Toggle Fullscreen
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(function() {});
            if (btnFullscreen) btnFullscreen.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            if (btnFullscreen) btnFullscreen.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }
    if (btnFullscreen) {
        btnFullscreen.addEventListener('click', toggleFullscreen);
    }
    document.addEventListener('fullscreenchange', function() {
        if (btnFullscreen) {
            btnFullscreen.innerHTML = document.fullscreenElement 
                ? '<i class="fas fa-compress"></i>' 
                : '<i class="fas fa-expand"></i>';
        }
    });

    // ===== Slide Overview Modal =====
    function openOverview() {
        if (overviewModal) {
            overviewModal.classList.add('active');
            updateOverviewActive();
        }
    }
    function closeOverview() {
        if (overviewModal) {
            overviewModal.classList.remove('active');
        }
    }
    function updateOverviewActive() {
        overviewCards.forEach(function(card, idx) {
            card.classList.toggle('active', idx === currentSlide);
        });
    }

    if (btnOverview) btnOverview.addEventListener('click', openOverview);
    if (overviewClose) overviewClose.addEventListener('click', closeOverview);
    if (overviewBackdrop) overviewBackdrop.addEventListener('click', closeOverview);

    overviewCards.forEach(function(card) {
        card.addEventListener('click', function() {
            const slideIdx = parseInt(this.dataset.slide, 10);
            closeOverview();
            goToSlide(slideIdx);
        });
    });

    // ===== Preloader & Init =====
    let isInitialized = false;
    function initPresentation() {
        if (isInitialized) return;
        isInitialized = true;
        if (preloader) {
            preloader.classList.add('hidden');
        }
        goToSlide(0, true);
        createParticles();
        runAiAnalysis('glass-skin');

        // Autoplay background video smoothly
        const heroVideo = document.getElementById('hero-bg-video');
        if (heroVideo) {
            const playPromise = heroVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(function() {
                    document.addEventListener('click', function playOnce() {
                        heroVideo.play().catch(function() {});
                    }, { once: true });
                });
            }
        }
    }

    window.addEventListener('load', function() {
        setTimeout(initPresentation, 400);
    });
    setTimeout(initPresentation, 1400); // Safety fallback
    if (preloader) preloader.addEventListener('click', initPresentation);

    // ===== Slide Navigation =====
    function goToSlide(index, force) {
        if (!force && (isAnimating || index === currentSlide || index < 0 || index >= totalSlides)) return;
        isAnimating = true;

        // Deactivate all slides
        slides.forEach(function(s) {
            s.classList.remove('active');
        });

        // Update index
        currentSlide = index;

        // Activate new slide
        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('active');
        }

        // Update UI elements
        updateUI();
        updateOverviewActive();

        // Animate stats if on stats slide
        if (currentSlide === 4) {
            animateStats();
            animateStatFills();
        }

        setTimeout(function() {
            isAnimating = false;
        }, ANIMATION_DURATION);
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    }

    // Make functions globally accessible
    window.goToSlide = goToSlide;
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
    window.openOverview = openOverview;
    window.closeOverview = closeOverview;

    // ===== Update UI =====
    function updateUI() {
        // Progress bar
        if (progressBar) {
            progressBar.style.width = ((currentSlide + 1) / totalSlides * 100) + '%';
        }

        // Slide counter
        if (currentSlideEl) {
            currentSlideEl.textContent = String(currentSlide + 1).padStart(2, '0');
        }

        // Dots
        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === currentSlide);
        });

        // Nav links
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (parseInt(link.dataset.slide, 10) === currentSlide) {
                link.classList.add('active');
            }
        });

        // Nav style based on slide theme
        const darkSlides = [0, 4]; // Hero and Stats
        if (darkSlides.indexOf(currentSlide) !== -1) {
            nav.classList.add('dark-mode');
            nav.classList.remove('scrolled');
        } else {
            nav.classList.remove('dark-mode');
            nav.classList.add('scrolled');
        }

        // Slide counter color
        const counter = document.querySelector('.slide-counter');
        if (counter) {
            if (darkSlides.indexOf(currentSlide) !== -1) {
                counter.style.color = 'rgba(255,255,255,0.6)';
            } else {
                counter.style.color = 'var(--text-muted)';
            }
        }
    }

    // ===== Smooth Scroll Wheel Navigation (Zero-Lag, 650ms Cooldown) =====
    let lastScrollTime = 0;
    const scrollCooldown = 650;
    let wheelDeltaAccumulator = 0;

    document.addEventListener('wheel', function(e) {
        // Don't trigger if modal is open
        if ((overviewModal && overviewModal.classList.contains('active')) ||
            (productModal && productModal.classList.contains('active'))) return;

        const now = Date.now();
        wheelDeltaAccumulator += e.deltaY;

        if (now - lastScrollTime < scrollCooldown) return;

        if (wheelDeltaAccumulator > 30) {
            nextSlide();
            lastScrollTime = now;
            wheelDeltaAccumulator = 0;
        } else if (wheelDeltaAccumulator < -30) {
            prevSlide();
            lastScrollTime = now;
            wheelDeltaAccumulator = 0;
        }
    }, { passive: true });

    // ===== Touch Navigation =====
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        if ((overviewModal && overviewModal.classList.contains('active')) ||
            (productModal && productModal.classList.contains('active'))) return;

        touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }, { passive: true });

    // ===== Keyboard Navigation =====
    document.addEventListener('keydown', function(e) {
        // ESC closes active modal
        if (e.key === 'Escape') {
            if (productModal && productModal.classList.contains('active')) {
                closeProductDetail();
                return;
            }
            if (overviewModal && overviewModal.classList.contains('active')) {
                closeOverview();
                return;
            }
            return;
        }

        // Modal toggle (M or G)
        if (e.key === 'm' || e.key === 'M' || e.key === 'g' || e.key === 'G') {
            if (productModal && productModal.classList.contains('active')) return;
            if (overviewModal && overviewModal.classList.contains('active')) {
                closeOverview();
            } else {
                openOverview();
            }
            return;
        }

        // Fullscreen toggle (F)
        if (e.key === 'f' || e.key === 'F') {
            toggleFullscreen();
            return;
        }

        if ((overviewModal && overviewModal.classList.contains('active')) ||
            (productModal && productModal.classList.contains('active'))) return;

        switch(e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(totalSlides - 1);
                break;
        }
    });

    // ===== Dot Navigation =====
    dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            goToSlide(parseInt(this.dataset.slide, 10));
        });
    });

    // ===== Nav Link Navigation =====
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            goToSlide(parseInt(this.dataset.slide, 10));
        });
    });

    // ===== Mobile Menu =====
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            if (mobileMenu) mobileMenu.classList.toggle('active');
        });
    }

    mobileLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const slideIndex = parseInt(this.dataset.slide, 10);
            if (hamburger) hamburger.classList.remove('active');
            if (mobileMenu) mobileMenu.classList.remove('active');
            goToSlide(slideIndex);
        });
    });

    // ===== Animate Stats Counter =====
    function animateStats() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(function(counter) {
            const target = parseInt(counter.dataset.target, 10);
            const duration = 1600;
            let startTime = null;

            function updateCounter(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easedProgress * target);

                if (target >= 1000) {
                    counter.textContent = (current / 1000).toFixed(1) + 'K';
                } else {
                    counter.textContent = current;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    if (target >= 1000) {
                        counter.textContent = (target / 1000).toFixed(0) + 'K';
                    } else {
                        counter.textContent = target;
                    }
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    function animateStatFills() {
        const fills = document.querySelectorAll('.stat-fill');
        fills.forEach(function(fill) {
            const targetWidth = fill.style.width || '80%';
            fill.style.width = '0%';
            setTimeout(function() {
                fill.style.width = targetWidth;
            }, 100);
        });
    }

    // ===== Lightweight Floating Particles =====
    function createParticles() {
        const container = document.getElementById('particles-hero');
        if (!container || container.children.length > 0) return;

        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            const size = Math.random() * 3 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.animationDuration = (Math.random() * 8 + 7) + 's';
            particle.style.animationDelay = (Math.random() * 6) + 's';
            particle.style.opacity = Math.random() * 0.35 + 0.15;
            fragment.appendChild(particle);
        }
        container.appendChild(fragment);
    }

    // ===== Resize Handler =====
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            slides.forEach(function(slide, i) {
                slide.classList.toggle('active', i === currentSlide);
            });
        }, 200);
    });

    // Set first slide active immediately
    slides[0].classList.add('active');

})();
