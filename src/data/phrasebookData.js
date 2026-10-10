/**
 * ROOTS Lingua — Authentic Travel Phrasebook Dataset
 * 
 * Curated specifically for community travelers in India & beyond.
 * Focuses on authentic, polite, local colloquial expressions with native script
 * and clear phonetic transliteration guides.
 */

export const PHRASEBOOK_CATEGORIES = [
  { id: 'all', label: 'All Phrases', icon: 'Sparkles' },
  { id: 'greetings', label: 'Greetings & Politeness', icon: 'Smile' },
  { id: 'food', label: 'Food & Restaurants', icon: 'Utensils' },
  { id: 'directions', label: 'Directions & Landmarks', icon: 'Compass' },
  { id: 'transport', label: 'Transport & Fares', icon: 'Bus' },
  { id: 'accommodation', label: 'Homestay & Accommodation', icon: 'Home' },
  { id: 'shopping', label: 'Shopping & Local Markets', icon: 'ShoppingBag' },
  { id: 'emergencies', label: 'Safety & Emergencies', icon: 'AlertTriangle' }
];

export const TRAVEL_PHRASES = [
  // 1. GREETINGS & POLITENESS
  {
    id: 'greet-1',
    category: 'greetings',
    english: 'Hello / Greetings',
    context: 'Standard respectful greeting for all times of day',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'നമസ്കാരം', phonetic: 'Namaskaram', note: 'Universal polite greeting with folded hands' },
      hi: { text: 'नमस्ते', phonetic: 'Namaste', note: 'Standard respectful greeting' },
      ta: { text: 'வணக்கம்', phonetic: 'Vanakkam', note: 'Polite traditional greeting' },
      ar: { text: 'مرحبًا', phonetic: 'Marhaban', note: 'Friendly casual hello' }
    }
  },
  {
    id: 'greet-2',
    category: 'greetings',
    english: 'How are you?',
    context: 'Friendly opening question when meeting locals or host families',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'സുഖമാണോ?', phonetic: 'Sukhamano?', note: 'Very warm and respectful' },
      hi: { text: 'आप कैसे हैं?', phonetic: 'Aap kaise hain?', note: 'Polite formal address' },
      ta: { text: 'எப்படி இருக்கீங்க?', phonetic: 'Eppadi irukkeenga?', note: 'Warm greeting' },
      ar: { text: 'كيف حالك؟', phonetic: 'Kaifa haluk?', note: 'Asking how one is doing' }
    }
  },
  {
    id: 'greet-3',
    category: 'greetings',
    english: 'Thank you very much',
    context: 'Expressing gratitude for help, chai, or food',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'വളരെ നന്ദി', phonetic: 'Valare nandi', note: 'Deep gratitude' },
      hi: { text: 'बहुत बहुत धन्यवाद', phonetic: 'Bahut bahut dhanyavaad', note: 'Warm thanks' },
      ta: { text: 'ரொம்ப நன்றி', phonetic: 'Romba nandri', note: 'Sincere thanks' },
      ar: { text: 'شكرًا جزيلاً', phonetic: 'Shukran jazeelan', note: 'Universal polite gratitude' }
    }
  },
  {
    id: 'greet-4',
    category: 'greetings',
    english: 'Please / Could you help?',
    context: 'Polite preface when asking for assistance',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'ദയവായി ഒന്നു സഹായിക്കാമോ?', phonetic: 'Dayavaayi onnu sahayaikkamo?', note: 'Polite request' },
      hi: { text: 'कृपया क्या आप मदद कर सकते हैं?', phonetic: 'Kripya kya aap madad kar sakte hain?', note: 'Gentle request' },
      ta: { text: 'தயவுசெய்து கொஞ்சம் உதவ முடியுமா?', phonetic: 'Thayavu seidhu konjam udhava mudiyuma?', note: 'Polite plea' },
      ar: { text: 'من فضلك هل يمكنك مساعدتي؟', phonetic: 'Min fadlak hal yumkinuk musa\'adati?', note: 'Respectful request' }
    }
  },
  {
    id: 'greet-5',
    category: 'greetings',
    english: 'Goodbye / See you again',
    context: 'Warm departure phrase',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'പോയിട്ട് വരാം', phonetic: 'Poyittu varaam', note: 'Literally "I will go and return" — culturally warmer than permanent goodbye' },
      hi: { text: 'फिर मिलेंगे / अलविदा', phonetic: 'Phir milenge', note: 'Literally "we will meet again"' },
      ta: { text: 'போயிட்டு வரேன்', phonetic: 'Poitu varen', note: 'Traditional warm farewell' },
      ar: { text: 'مع السلامة', phonetic: 'Ma\'a as-salama', note: 'Go in peace' }
    }
  },

  // 2. FOOD & RESTAURANTS
  {
    id: 'food-1',
    category: 'food',
    english: 'The food was delicious!',
    context: 'Complimenting a local cook or homestay host',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'ഭക്ഷണം വളരെ രുചികരമായിരുന്നു!', phonetic: 'Bhakshanam valare ruchikaramayirunnu!', note: 'Hosts will smile and appreciate this greatly' },
      hi: { text: 'खाना बहुत स्वादिष्ट था!', phonetic: 'Khaana bahut swaadisht tha!', note: 'Heartfelt food praise' },
      ta: { text: 'சாப்பாடு ரொம்ப சுவையா இருந்தது!', phonetic: 'Saappaadu romba suvaiya irundhadhu!', note: 'High praise for meals' },
      ar: { text: 'الطعام كان لذيذًا جدًا!', phonetic: 'Al-ta\'aam kaana latheethan jiddan!', note: 'High culinary compliment' }
    }
  },
  {
    id: 'food-2',
    category: 'food',
    english: 'Can I have drinking water please?',
    context: 'Essential request at roadside eateries and homes',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'കുറച്ചു കുടിവെള്ളം തരുമോ?', phonetic: 'Kurachu kudivellam tharumo?', note: 'Polite request for boiled/filtered water' },
      hi: { text: 'क्या मुझे पीने का पानी मिल सकता है?', phonetic: 'Kya mujhe peene ka paani mil sakta hai?', note: 'Clear water request' },
      ta: { text: 'கொஞ்சம் குடிதண்ணீர் கிடைக்குமா?', phonetic: 'Konjam kudithanneer kidaikkuma?', note: 'Standard water request' },
      ar: { text: 'هل يمكنني الحصول على ماء شرب من فضلك؟', phonetic: 'Hal yumkinuni al-husool \'ala maa\' shurb?', note: 'Standard request' }
    }
  },
  {
    id: 'food-3',
    category: 'food',
    english: 'Make it less spicy, please',
    context: 'Very important for travelers with spice sensitivity',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'എരിവ് കുറച്ചു മതി, ദയവായി', phonetic: 'Erivu kurachu mathi, dayavaayi', note: 'Crucial at local toddy shops & seafood dhabas' },
      hi: { text: 'कृपया कम तीखा बनाइए', phonetic: 'Kripya kam teekha banaiye', note: 'Polite spice reduction' },
      ta: { text: 'காரம் கொஞ்சம் குறைவா போடுங்க', phonetic: 'Kaaram konjam kuraiva podunga', note: 'Clear spice warning' },
      ar: { text: 'رجاءً اجعله قليل الحار', phonetic: 'Raja\'an ij\'alhu qaleel al-haar', note: 'Low spice request' }
    }
  },
  {
    id: 'food-4',
    category: 'food',
    english: 'Is this purely vegetarian?',
    context: 'Dietary check for vegetarian travelers',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'ഇത് പ്യുവർ വെജിറ്റേറിയൻ ആണോ?', phonetic: 'Ithu pure vegetarian aano?', note: 'Checks for egg/fish oil free items' },
      hi: { text: 'क्या यह पूरी तरह शाकाहारी है?', phonetic: 'Kya yeh poori tarah shaakahari hai?', note: 'Pure veg verification' },
      ta: { text: 'இது சுத்த சைவமா?', phonetic: 'Idhu sutha saivamaa?', note: 'Pure vegetarian check' },
      ar: { text: 'هل هذا نباتي بالكامل؟', phonetic: 'Hal hatha nabaatiy bil-kamil?', note: 'Vegetarian inquiry' }
    }
  },
  {
    id: 'food-5',
    category: 'food',
    english: 'One tea / chai and one coffee, please',
    context: 'Ordering at local tea stalls (chaya kada)',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'ഒരു ചായയും ഒരു കാപ്പിയും തരൂ', phonetic: 'Oru chaayayum oru kaappiyum tharoo', note: 'Authentic Kerala tea stall staple' },
      hi: { text: 'एक चाय और एक कॉफ़ी दीजिए', phonetic: 'Ek chai aur ek coffee deejiye', note: 'Everyday tea stall order' },
      ta: { text: 'ஒரு டீயும் ஒரு காபியும் குடுங்க', phonetic: 'Oru tea-yum oru coffee-yum kudunga', note: 'Everyday tea stall order' },
      ar: { text: 'واحد شاي وواحد قهوة من فضلك', phonetic: 'Wahed shai wa wahed qahwa min fadlak', note: 'Cafe order' }
    }
  },

  // 3. DIRECTIONS & LANDMARKS
  {
    id: 'dir-1',
    category: 'directions',
    english: 'Where is the beach / cliff / waterfall?',
    context: 'Asking locals for natural landmarks',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'ബീച്ച് / വെള്ളച്ചാട്ടം എവിടെയാണ്?', phonetic: 'Beach / vellachaattam evideyaanu?', note: 'Very useful in Varkala or Wayanad' },
      hi: { text: 'समुद्र तट / झरना कहाँ है?', phonetic: 'Samundar tat / jharna kahan hai?', note: 'Landmark search' },
      ta: { text: 'கடற்கரை / அருவி எங்கே இருக்கிறது?', phonetic: 'Kadarkarai / aruvi enge irukkiradhu?', note: 'Landmark query' },
      ar: { text: 'أين هو الشاطئ / الشلال؟', phonetic: 'Ayna huwa ash-shati\' / ash-shallal?', note: 'Location question' }
    }
  },
  {
    id: 'dir-2',
    category: 'directions',
    english: 'How far is the village from here?',
    context: 'Estimating walking or trek distance',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'ഇവിടെനിന്ന് ഗ്രാമത്തിലേക്ക് എത്ര ദൂരമുണ്ട്?', phonetic: 'Ivide ninnu graamathilekku ethra dooramundu?', note: 'Distance estimation' },
      hi: { text: 'यहाँ से गाँव कितनी दूर है?', phonetic: 'Yahan se gaon kitni door hai?', note: 'Distance question' },
      ta: { text: 'இங்கிருந்து கிராமத்திற்கு எவ்வளவு தூரம்?', phonetic: 'Ingirundhu graamathukku evvalavu thooram?', note: 'Village distance check' },
      ar: { text: 'كم تبعد القرية عن هنا؟', phonetic: 'Kam tab\'ud al-qaryah \'an huna?', note: 'Distance check' }
    }
  },
  {
    id: 'dir-3',
    category: 'directions',
    english: 'Go straight, then take a left / right',
    context: 'Common reply when receiving directions',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'നേരെ പോയിട്ട് ഇടത്തോട്ട് / വലത്തോട്ട് തിരിയുക', phonetic: 'Nere poyittu idathottu / valathottu thiriyuka', note: 'Idathottu = Left, Valathottu = Right' },
      hi: { text: 'सीधे जाइए, फिर बाएँ / दाएँ मुड़िए', phonetic: 'Seedhe jaaiye, phir baayein / daayein mudiye', note: 'Baayein = Left, Daayein = Right' },
      ta: { text: 'நேரா போய் இடது / வலது பக்கம் திரும்புங்க', phonetic: 'Nera poi idadhu / valadhu pakkam thirumbunga', note: 'Idadhu = Left, Valadhu = Right' },
      ar: { text: 'اذهب مباشرة، ثم انعطف يسارًا / يمينًا', phonetic: 'Ithhab mubasharatan, thumma in\'atif yasaaran / yameenan', note: 'Straight, left, right' }
    }
  },
  {
    id: 'dir-4',
    category: 'directions',
    english: 'I think I am lost. Can you guide me?',
    context: 'When off-grid or wandering remote trails',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'എനിക്ക് വഴി തെറ്റി. ഒന്ന് വഴി കാണിച്ചു തരുമോ?', phonetic: 'Enikku vazhi thetti. Onnu vazhi kaanichu tharumo?', note: 'Friendly local rescue phrase' },
      hi: { text: 'मैं रास्ता भटक गया हूँ। क्या आप रास्ता बता सकते हैं?', phonetic: 'Main raasta bhatak gaya hoon. Kya aap raasta bata sakte hain?', note: 'Lost traveler request' },
      ta: { text: 'எனக்கு வழி தெரியவில்லை. கொஞ்சம் வழி சொல்வீர்களா?', phonetic: 'Enakku vazhi theriyavillai. Konjam vazhi solveergala?', note: 'Lost traveler request' },
      ar: { text: 'أعتقد أنني ضللت الطريق. هل يمكنك إرشادي؟', phonetic: 'A\'taqidu annani dalaltu at-tareeq. Hal yumkinuk irshadi?', note: 'Lost traveler request' }
    }
  },

  // 4. TRANSPORT & FARES
  {
    id: 'trans-1',
    category: 'transport',
    english: 'Will you go to [Destination]?',
    context: 'Asking auto-rickshaw or taxi driver before boarding',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: '[Destination]-ലേക്ക് വരുമോ?', phonetic: '[Destination]-lekku varumo?', note: 'Standard auto hail in Kerala' },
      hi: { text: 'क्या आप [Destination] चलेंगे?', phonetic: 'Kya aap [Destination] chalenge?', note: 'Standard auto question' },
      ta: { text: '[Destination]-க்கு போவீங்களா?', phonetic: '[Destination]-kku poveengala?', note: 'Standard auto hail' },
      ar: { text: 'هل ستذهب إلى [Destination]؟', phonetic: 'Hal satathhab ila [Destination]?', note: 'Taxi question' }
    }
  },
  {
    id: 'trans-2',
    category: 'transport',
    english: 'How much is the auto fare by meter?',
    context: 'Checking fare or meter usage',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'മീറ്റർ പ്രകാരം എത്ര രൂപയാകും?', phonetic: 'Meter prakaaram ethra roopayaakum?', note: 'Encourages fair fare usage' },
      hi: { text: 'मीटर से कितना किराया होगा?', phonetic: 'Meter se kitna kiraaya hoga?', note: 'Meter fare query' },
      ta: { text: 'மீட்டர் படி எவ்வளவு கட்டணம் வரும்?', phonetic: 'Meter padi evvalavu kattanam varum?', note: 'Meter fare query' },
      ar: { text: 'كم ستكون الأجرة بالعداد؟', phonetic: 'Kam satakoon al-ujrah bil-\'addad?', note: 'Meter fare query' }
    }
  },
  {
    id: 'trans-3',
    category: 'transport',
    english: 'When does the next bus leave?',
    context: 'At rural village bus stands',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'അടുത്ത ബസ് എപ്പോഴാണ് പുറപ്പെടുന്നത്?', phonetic: 'Adutha bus eppozhaanu purappedunnathu?', note: 'Check timing at KSRTC stops' },
      hi: { text: 'अगली बस कब निकलेगी?', phonetic: 'Agli bus kab niklegi?', note: 'Bus schedule check' },
      ta: { text: 'அடுத்த பஸ் எப்போது புறப்படும்?', phonetic: 'Adutha bus eppodhu purappadum?', note: 'Bus schedule check' },
      ar: { text: 'متى تنطلق الحافلة القادمة؟', phonetic: 'Mata tantaliq al-haafilah al-qadimah?', note: 'Bus timetable question' }
    }
  },
  {
    id: 'trans-4',
    category: 'transport',
    english: 'Please stop here, I will get down',
    context: 'Signaling bus driver or auto to drop you off',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'ഇവിടെ ഒന്ന് നിർത്താമോ, ഞാൻ ഇവിടെ ഇറങ്ങാം', phonetic: 'Ivide onnu nirthamo, njan ivide irangam', note: 'Alerting bus conductor or auto driver' },
      hi: { text: 'कृपया यहाँ रोक दीजिए, मुझे उतरना है', phonetic: 'Kripya yahan rok deejiye, mujhe utarna hai', note: 'Stop request' },
      ta: { text: 'இங்க கொஞ்சம் நிறுத்துங்க, நான் இறங்கிக்கிறேன்', phonetic: 'Inga konjam niruthunga, naan irangikkiren', note: 'Drop off request' },
      ar: { text: 'توقف هنا من فضلك، سأنزل هنا', phonetic: 'Tawaqqaf huna min fadlak, sa-anzil huna', note: 'Stop request' }
    }
  },

  // 5. ACCOMMODATION & HOMESTAYS
  {
    id: 'acc-1',
    category: 'accommodation',
    english: 'What is the Wi-Fi password?',
    context: 'Connecting in homestays or heritage cottages',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'വൈഫൈ പാസ്‌വേഡ് എന്താണ്?', phonetic: 'Wi-Fi password enthaanu?', note: 'Universally understood' },
      hi: { text: 'वाई-फ़ाई का पासवर्ड क्या है?', phonetic: 'Wi-Fi ka password kya hai?', note: 'Standard query' },
      ta: { text: 'வைஃபை பாஸ்வேர்ட் என்ன?', phonetic: 'Wi-Fi password enna?', note: 'Standard query' },
      ar: { text: 'ما هي كلمة مرور الواي فاي؟', phonetic: 'Ma hiya kalimat muroor al-wifi?', note: 'Standard query' }
    }
  },
  {
    id: 'acc-2',
    category: 'accommodation',
    english: 'Is hot water available for a bath?',
    context: 'Important during mountain or forest stays',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'കുളിക്കാൻ ചൂടുവെള്ളം കിട്ടുമോ?', phonetic: 'Kulikkan chooduvellam kittumo?', note: 'Very useful for hill station homestays' },
      hi: { text: 'क्या नहाने के लिए गर्म पानी मिलेगा?', phonetic: 'Kya nahaane ke liye garm paani milega?', note: 'Hot water check' },
      ta: { text: 'குளிக்க சுடுதண்ணீர் கிடைக்குமா?', phonetic: 'Kulikka suduthanneer kidaikkuma?', note: 'Hot water check' },
      ar: { text: 'هل يتوفر ماء ساخن للاستحمام؟', phonetic: 'Hal yatawaffar maa\' saakhin lil-istihmam?', note: 'Hot water check' }
    }
  },
  {
    id: 'acc-3',
    category: 'accommodation',
    english: 'What time is breakfast served in the morning?',
    context: 'Homestay morning schedule',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'രാവിലെ പ്രഭാതഭക്ഷണം എത്ര മണിക്കാണു?', phonetic: 'Raavile prabhathabhakshanam ethra manikkaanu?', note: 'Homestay meal timing' },
      hi: { text: 'सुबह नाश्ता कितने बजे मिलेगा?', phonetic: 'Subah naashta kitne baje milega?', note: 'Breakfast timing' },
      ta: { text: 'காலையில் காலை உணவு எத்தனை மணிக்கு?', phonetic: 'Kaalaiyil kaalai unavu ethanai manikku?', note: 'Breakfast timing' },
      ar: { text: 'في أي وقت يتم تقديم وجبة الإفطار في الصباح؟', phonetic: 'Fi ayyi waqt yutamm taqdeem al-iftaar?', note: 'Breakfast timing' }
    }
  },

  // 6. SHOPPING & BARGAINING
  {
    id: 'shop-1',
    category: 'shopping',
    english: 'How much does this cost?',
    context: 'Fundamental shopping phrase at street stalls & spice bazaars',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'ഇതിന് എത്ര രൂപയാണ്?', phonetic: 'Ithinu ethra roopayaanu?', note: 'Essential local market question' },
      hi: { text: 'यह कितने का है?', phonetic: 'Yeh kitne ka hai?', note: 'Essential pricing question' },
      ta: { text: 'இது எவ்வளவு ரூபாய்?', phonetic: 'Idhu evvalavu roobai?', note: 'Essential pricing question' },
      ar: { text: 'بكم هذا؟', phonetic: 'Bikam hatha?', note: 'Universal price check' }
    }
  },
  {
    id: 'shop-2',
    category: 'shopping',
    english: 'Can you give a small discount for this?',
    context: 'Respectful and friendly local bargaining',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'കുറച്ചു കുറച്ചു തരാമോ?', phonetic: 'Kurachu kurachu tharaamo?', note: 'Very natural colloquial friendly bargaining' },
      hi: { text: 'क्या थोड़ा कम कर सकते हैं?', phonetic: 'Kya thoda kam kar sakte hain?', note: 'Gentle discount request' },
      ta: { text: 'கொஞ்சம் குறைச்சு தர முடியுமா?', phonetic: 'Konjam kuraichu thara mudiyuma?', note: 'Friendly discount plea' },
      ar: { text: 'هل يمكنك إعطائي خصمًا صغيرًا؟', phonetic: 'Hal yumkinuk i\'ta\'i khasmam sagheeran?', note: 'Polite bargaining' }
    }
  },
  {
    id: 'shop-3',
    category: 'shopping',
    english: 'Do you accept UPI / Google Pay?',
    context: 'Digital payments check across India',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'ഇവിടെ ഗൂഗിൾ പേ / യുപിഐ എടുക്കുമോ?', phonetic: 'Ivide Google Pay / UPI edukkuymo?', note: 'Accepted almost everywhere in India' },
      hi: { text: 'क्या यहाँ गूगल पे / यूपीआई चलता है?', phonetic: 'Kya yahan Google Pay / UPI chalta hai?', note: 'Digital payment check' },
      ta: { text: 'இங்க கூகுள் பே / UPI வாங்குவீங்களா?', phonetic: 'Inga Google Pay / UPI vaanguveengala?', note: 'Digital payment check' },
      ar: { text: 'هل تقبل الدفع الرقمي؟', phonetic: 'Hal taqbal ad-daf\' ar-raqami?', note: 'Digital payment inquiry' }
    }
  },

  // 7. SAFETY & EMERGENCIES
  {
    id: 'em-1',
    category: 'emergencies',
    english: 'Help! Please help me!',
    context: 'Urgent call for emergency assistance',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'സഹായിക്കൂ! ദയവായി ഒന്ന് സഹായിക്കൂ!', phonetic: 'Sahaayikku! Dayavaayi onnu sahaayikku!', note: 'Immediate distress call' },
      hi: { text: 'मदद करो! कृपया मेरी मदद कीजिए!', phonetic: 'Madad karo! Kripya meri madad keejiye!', note: 'Urgent plea for help' },
      ta: { text: 'காப்பாத்துங்க! தயவுசெய்து எனக்கு உதவுங்க!', phonetic: 'Kaapaathunga! Thayavu seidhu enakku udhavunga!', note: 'Emergency assistance call' },
      ar: { text: 'النجدة! ساعدني من فضلك!', phonetic: 'An-najdah! Sa\'idni min fadlak!', note: 'Urgent emergency call' }
    }
  },
  {
    id: 'em-2',
    category: 'emergencies',
    english: 'I need a doctor / Where is the nearest hospital?',
    context: 'Medical emergency',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'ഡോക്ടറെ കാണണം / അടുത്തുള്ള ആശുപത്രി എവിടെയാണ്?', phonetic: 'Doctor-e kaananam / aduthulla aashupathri evideyaanu?', note: 'Emergency medical direction' },
      hi: { text: 'मुझे डॉक्टर की ज़रूरत है / पास का अस्पताल कहाँ है?', phonetic: 'Mujhe doctor ki zaroorat hai / paas ka aspatal kahan hai?', note: 'Hospital direction request' },
      ta: { text: 'மருத்துவர் தேவை / பக்கத்துல ஆஸ்பத்திரி எங்கே?', phonetic: 'Maruthuvar thevai / pakkathula aaspathiri enge?', note: 'Medical assistance' },
      ar: { text: 'أحتاج إلى طبيب / أين أقرب مستشفى؟', phonetic: 'Ahtaaju ila tabeeb / ayna aqrab mustashfa?', note: 'Hospital emergency inquiry' }
    }
  },
  {
    id: 'em-3',
    category: 'emergencies',
    english: 'Please call the police / emergency number (112)',
    context: 'Severe emergency or theft',
    supportedLanguages: ['ml', 'hi', 'ta', 'ar'],
    translations: {
      ml: { text: 'ദയവായി പോലീസിനെ വിളിക്കൂ (112)', phonetic: 'Dayavaayi police-ine vilikkoo (112)', note: 'India universal emergency number is 112' },
      hi: { text: 'कृपया पुलिस को बुलाइए (112)', phonetic: 'Kripya police ko bulaiye (112)', note: 'India universal emergency number is 112' },
      ta: { text: 'தயவுசெய்து போலீஸை கூப்பிடுங்க (112)', phonetic: 'Thayavu seidhu police-ai kooppidunga (112)', note: 'Emergency police alert' },
      ar: { text: 'اتصل بالشرطة من فضلك (112)', phonetic: 'Ittasil bish-shurtah min fadlak (112)', note: 'Police emergency call' }
    }
  }
];
