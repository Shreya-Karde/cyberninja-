const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();
 
const User       = require('./models/User');
const Question   = require('./models/Question');
const Article    = require('./models/Article');
const Simulation = require('./models/Simulation');
 
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
 
// q3: trilingual question builder. opts[0] is always the correct answer in source.
function q3(category, level, en, hi, mr, opts_en, opts_hi, opts_mr, exp_en, exp_hi, exp_mr) {
  const indices    = [0, 1, 2, 3];
  const shuffled   = shuffle(indices);
  const newCorrect = shuffled.indexOf(0);
  return {
    category, level, type: 'mcq',
    question:    { en, hi, mr },
    options:     shuffled.map(i => ({ en: opts_en[i], hi: opts_hi[i], mr: opts_mr[i] })),
    correctAnswer: newCorrect,
    explanation:  { en: exp_en, hi: exp_hi, mr: exp_mr },
    points: level === 'beginner' ? 10 : level === 'intermediate' ? 20 : 30,
    isActive: true,
  };
}
 
// English-only shorthand (hi/mr fallback to en)
const qe = (cat, level, en, opts, exp) => q3(
  cat, level,
  en, en, en,
  opts, opts, opts,
  exp, exp, exp
);

// ─── QUESTIONS ────────────────────────────────────────────────────────────────
const questions = [
 
  // ═══════════════════════════════════════════════════════════════
  // PHISHING — 10 questions (3 easy, 3 medium, 4 hard)
  // ═══════════════════════════════════════════════════════════════
 
  q3('phishing','beginner',
    'What is phishing?',
    'फ़िशिंग क्या है?',
    'फिशिंग म्हणजे काय?',
    ['A cyber attack using fake messages to steal credentials','A sport involving fishing rods','A type of antivirus software','A way to speed up the internet'],
    ['नकली संदेशों से जानकारी चुराने का साइबर हमला','एक मछली पकड़ने का खेल','एक प्रकार का एंटीवायरस सॉफ्टवेयर','इंटरनेट तेज करने का तरीका'],
    ['बनावट संदेशांद्वारे माहिती चोरणारा सायबर हल्ला','मासेमारीचा एक खेळ','एक प्रकारचे अँटीव्हायरस सॉफ्टवेअर','इंटरनेट वेगवान करण्याचा मार्ग'],
    'Phishing tricks victims into revealing passwords via fake emails, websites, or messages.',
    'फ़िशिंग पीड़ितों को नकली ईमेल, वेबसाइट या संदेशों के माध्यम से पासवर्ड उजागर करने के लिए धोखा देती है।',
    'फिशिंग पीडितांना बनावट ईमेल, वेबसाइट किंवा संदेशांद्वारे पासवर्ड उघड करण्यास फसवते.'),
 
  q3('phishing','beginner',
    'Which is a red flag in an email?',
    'ईमेल में कौन सा संकेत खतरनाक है?',
    'ईमेलमध्ये कोणती गोष्ट धोकादायक आहे?',
    ['Urgent demand to verify your password by clicking a link','Email from your known colleague','A newsletter you subscribed to','A calendar invite from your manager'],
    ['लिंक पर क्लिक करके पासवर्ड सत्यापित करने की तत्काल मांग','आपके जाने-पहचाने सहयोगी का ईमेल','आपकी सब्सक्राइब की गई न्यूज़लेटर','आपके मैनेजर का कैलेंडर आमंत्रण'],
    ['लिंकवर क्लिक करून पासवर्ड सत्यापित करण्याची तातडीची मागणी','तुमच्या ओळखीच्या सहकाऱ्याचा ईमेल','तुम्ही सदस्यता घेतलेले वृत्तपत्र','तुमच्या व्यवस्थापकाचे कॅलेंडर आमंत्रण'],
    'Legitimate services never send urgent, unsolicited password-reset requests via email.',
    'वैध सेवाएं कभी भी ईमेल के माध्यम से अनावश्यक पासवर्ड-रीसेट अनुरोध नहीं भेजतीं।',
    'वैध सेवा कधीही ईमेलद्वारे अनाग्रहित पासवर्ड-रीसेट विनंती पाठवत नाहीत.'),
 
  q3('phishing','beginner',
    'You receive: "Your account is suspended — verify now!" You should:',
    'आपको मिला: "आपका खाता निलंबित है — अभी सत्यापित करें!" आपको क्या करना चाहिए?',
    'तुम्हाला मिळाले: "तुमचे खाते निलंबित आहे — आत्ता सत्यापित करा!" तुम्ही काय करावे?',
    ['Navigate directly to the bank website in a new tab','Click the link immediately','Reply with your account details','Call the number in the email'],
    ['एक नए टैब में सीधे बैंक वेबसाइट पर जाएं','तुरंत लिंक पर क्लिक करें','अपने खाते की जानकारी के साथ जवाब दें','ईमेल में दिए नंबर पर कॉल करें'],
    ['नवीन टॅबमध्ये थेट बँकेच्या वेबसाइटवर जा','ताबडतोब लिंकवर क्लिक करा','तुमच्या खात्याची माहिती देऊन उत्तर द्या','ईमेलमधील नंबरवर कॉल करा'],
    'Always navigate to your bank directly. Banks do not suspend accounts via email links.',
    'हमेशा सीधे अपने बैंक पर जाएं। बैंक ईमेल लिंक के माध्यम से खाते निलंबित नहीं करते।',
    'नेहमी थेट बँकेकडे जा. बँका ईमेल लिंकद्वारे खाती निलंबित करत नाहीत.'),
 
  q3('phishing','intermediate',
    'An email from "support@paypa1.com" asks to verify PayPal. What is suspicious?',
    '"support@paypa1.com" से आया ईमेल PayPal सत्यापित करने को कहता है। क्या संदिग्ध है?',
    '"support@paypa1.com" कडून आलेला ईमेल PayPal सत्यापित करण्यास सांगतो. काय संशयास्पद आहे?',
    ['"paypa1" replaces letter l with digit 1 — typosquatting','The email uses plain HTTP','The email has no attachment','The greeting is too formal'],
    ['"paypa1" में अक्षर l की जगह अंक 1 है — टाइपोस्क्वाटिंग','ईमेल में plain HTTP का उपयोग है','ईमेल में कोई अटैचमेंट नहीं है','अभिवादन बहुत औपचारिक है'],
    ['"paypa1" मध्ये l अक्षराऐवजी 1 आंकडा आहे — टायपोस्क्वाटिंग','ईमेलमध्ये plain HTTP वापरले आहे','ईमेलमध्ये कोणतेही अटॅचमेंट नाही','अभिवादन खूप औपचारिक आहे'],
    'Typosquatting registers near-identical domains to deceive users who do not check carefully.',
    'टाइपोस्क्वाटिंग लगभग समान डोमेन रजिस्टर करता है ताकि जो उपयोगकर्ता ध्यान से नहीं देखते उन्हें धोखा दिया जा सके।',
    'टायपोस्क्वाटिंग जवळजवळ समान डोमेन नोंदणी करते जेणेकरून काळजीपूर्वक न पाहणाऱ्या वापरकर्त्यांना फसवता येईल.'),
 
  q3('phishing','intermediate',
    'What is smishing?',
    'स्मिशिंग क्या है?',
    'स्मिशिंग म्हणजे काय?',
    ['Phishing conducted through SMS or text messages','Phishing via email attachments','Phishing using social media','Phishing using voice calls'],
    ['SMS या टेक्स्ट संदेशों के माध्यम से की गई फ़िशिंग','ईमेल अटैचमेंट के माध्यम से फ़िशिंग','सोशल मीडिया का उपयोग करके फ़िशिंग','वॉयस कॉल का उपयोग करके फ़िशिंग'],
    ['SMS किंवा मजकूर संदेशांद्वारे केलेली फिशिंग','ईमेल अटॅचमेंटद्वारे फिशिंग','सोशल मीडिया वापरून फिशिंग','व्हॉईस कॉल वापरून फिशिंग'],
    'Smishing delivers malicious links via text messages impersonating banks or delivery services.',
    'स्मिशिंग बैंकों या डिलीवरी सेवाओं का रूप धारण करके टेक्स्ट संदेशों के माध्यम से दुर्भावनापूर्ण लिंक भेजती है।',
    'स्मिशिंग बँका किंवा डिलिव्हरी सेवांचा आव घेऊन मजकूर संदेशांद्वारे दुर्भावनापूर्ण लिंक पाठवते.'),
 
  q3('phishing','intermediate',
    'Spear phishing differs from generic phishing because it:',
    'स्पीयर फ़िशिंग सामान्य फ़िशिंग से कैसे अलग है?',
    'स्पीअर फिशिंग सामान्य फिशिंगपेक्षा वेगळी कशी आहे?',
    ['Targets a specific individual using personal details about them','Uses more attachments','Is sent to millions of people','Only targets corporate servers'],
    ['व्यक्तिगत जानकारी का उपयोग करके किसी विशिष्ट व्यक्ति को निशाना बनाता है','अधिक अटैचमेंट का उपयोग करता है','लाखों लोगों को भेजा जाता है','केवल कॉर्पोरेट सर्वर को निशाना बनाता है'],
    ['वैयक्तिक माहिती वापरून एखाद्या विशिष्ट व्यक्तीला लक्ष्य करते','अधिक अटॅचमेंट वापरते','लाखो लोकांना पाठवले जाते','केवळ कॉर्पोरेट सर्व्हरला लक्ष्य करते'],
    'Spear phishing researches the target to craft convincing personalised attacks.',
    'स्पीयर फ़िशिंग लक्ष्य पर शोध करके विश्वसनीय व्यक्तिगत हमले बनाती है।',
    'स्पीअर फिशिंग लक्ष्याचे संशोधन करून खात्रीलायक वैयक्तिक हल्ले तयार करते.'),
 
  q3('phishing','expert',
    'How do AiTM phishing kits defeat multi-factor authentication?',
    'AiTM फ़िशिंग किट मल्टी-फैक्टर ऑथेंटिकेशन को कैसे हराते हैं?',
    'AiTM फिशिंग किट्स मल्टी-फॅक्टर ऑथेंटिकेशनला कसे पराभूत करतात?',
    ['They relay credentials and session cookies in real time capturing post-MFA tokens','They brute-force OTPs within 30 seconds','They disable MFA on the account','They clone the authenticator app'],
    ['वे रीयल टाइम में क्रेडेंशियल और सेशन कुकीज़ रिले करते हैं और MFA के बाद के टोकन कैप्चर करते हैं','वे 30 सेकंड में OTP को ब्रूट-फोर्स करते हैं','वे खाते पर MFA को अक्षम करते हैं','वे ऑथेंटिकेटर ऐप को क्लोन करते हैं'],
    ['ते रिअल टाइममध्ये क्रेडेन्शियल्स आणि सेशन कुकीज रिले करतात आणि MFA नंतरचे टोकन कॅप्चर करतात','ते 30 सेकंदात OTP ब्रूट-फोर्स करतात','ते खात्यावर MFA अक्षम करतात','ते ऑथेंटिकेटर अॅप क्लोन करतात'],
    'AiTM toolkits act as transparent reverse proxies capturing authenticated session tokens after MFA completes.',
    'AiTM टूलकिट पारदर्शी रिवर्स प्रॉक्सी के रूप में काम करते हैं और MFA पूरा होने के बाद प्रमाणित सेशन टोकन कैप्चर करते हैं।',
    'AiTM टूलकिट पारदर्शक रिव्हर्स प्रॉक्सी म्हणून काम करतात आणि MFA पूर्ण झाल्यावर प्रमाणित सेशन टोकन कॅप्चर करतात.'),
 
  q3('phishing','expert',
    'DMARC policy "p=reject" instructs receiving servers to:',
    'DMARC नीति "p=reject" प्राप्त करने वाले सर्वर को क्या निर्देश देती है?',
    'DMARC धोरण "p=reject" प्राप्त करणाऱ्या सर्व्हरला काय निर्देश देते?',
    ['Reject emails that fail both SPF and DKIM checks','Deliver all emails regardless of authentication','Quarantine suspicious emails to spam','Log failures but still deliver the email'],
    ['SPF और DKIM दोनों जांच में विफल ईमेल को अस्वीकार करें','प्रमाणीकरण की परवाह किए बिना सभी ईमेल डिलीवर करें','संदिग्ध ईमेल को स्पैम में क्वारंटाइन करें','विफलताओं को लॉग करें लेकिन फिर भी ईमेल डिलीवर करें'],
    ['SPF आणि DKIM दोन्ही तपासण्यांमध्ये अयशस्वी ईमेल नाकारा','प्रमाणीकरणाची पर्वा न करता सर्व ईमेल वितरित करा','संशयास्पद ईमेल स्पॅममध्ये क्वारंटाइन करा','अयशस्वी लॉग करा परंतु तरीही ईमेल वितरित करा'],
    'p=reject is the strongest DMARC enforcement preventing unauthenticated email delivery.',
    'p=reject सबसे मजबूत DMARC प्रवर्तन है जो अप्रमाणित ईमेल डिलीवरी को रोकता है।',
    'p=reject हे सर्वात मजबूत DMARC अंमलबजावणी आहे जे अप्रमाणित ईमेल वितरण रोखते.'),
 
  q3('phishing','expert',
    "Why is HTTPS alone insufficient proof of a site's legitimacy?",
    'HTTPS अकेले किसी साइट की वैधता का पर्याप्त प्रमाण क्यों नहीं है?',
    'HTTPS एकट्याने साइटच्या वैधतेचा पुरेसा पुरावा का नाही?',
    ["Free certificates from Let's Encrypt can be obtained by anyone including phishing sites",'HTTPS certificates are only for government sites','HTTPS only encrypts images not form data','The padlock means the domain is government-verified'],
    ["Let's Encrypt के मुफ्त प्रमाणपत्र फ़िशिंग साइटों सहित कोई भी प्राप्त कर सकता है",'HTTPS प्रमाणपत्र केवल सरकारी साइटों के लिए हैं','HTTPS केवल छवियों को एन्क्रिप्ट करता है, फॉर्म डेटा को नहीं','पैडलॉक का अर्थ है कि डोमेन सरकार द्वारा सत्यापित है'],
    ["Let's Encrypt चे मोफत प्रमाणपत्र फिशिंग साइटांसह कोणीही मिळवू शकते",'HTTPS प्रमाणपत्रे केवळ सरकारी साइटांसाठी आहेत','HTTPS केवळ प्रतिमा एन्क्रिप्ट करते, फॉर्म डेटा नाही','पॅडलॉकचा अर्थ डोमेन सरकारद्वारे सत्यापित आहे'],
    'HTTPS encrypts the connection but says nothing about who owns the site.',
    'HTTPS कनेक्शन को एन्क्रिप्ट करता है लेकिन साइट के मालिक के बारे में कुछ नहीं बताता।',
    'HTTPS कनेक्शन एन्क्रिप्ट करते परंतु साइटचा मालक कोण आहे याबद्दल काहीही सांगत नाही.'),
 
  q3('phishing','expert',
    'What is a homograph attack?',
    'होमोग्राफ हमला क्या है?',
    'होमोग्राफ हल्ला म्हणजे काय?',
    ['Registering domains using Unicode characters that look identical to legitimate ASCII domains','Using homonyms to confuse spam filters','Sending the same email in many languages','Using multiple sub-domains to obscure the real domain'],
    ['Unicode वर्णों का उपयोग करके डोमेन रजिस्टर करना जो ASCII डोमेन जैसे दिखते हैं','स्पैम फिल्टर को भ्रमित करने के लिए समानार्थी शब्दों का उपयोग','एक ही ईमेल को कई भाषाओं में भेजना','वास्तविक डोमेन को छिपाने के लिए कई सब-डोमेन का उपयोग'],
    ['Unicode वर्ण वापरून डोमेन नोंदणी करणे जे ASCII डोमेनसारखे दिसतात','स्पॅम फिल्टर गोंधळवण्यासाठी समानार्थी शब्द वापरणे','तोच ईमेल अनेक भाषांमध्ये पाठवणे','खऱ्या डोमेनला लपवण्यासाठी अनेक सब-डोमेन वापरणे'],
    'Unicode allows characters like Cyrillic "а" that is visually indistinguishable from Latin "a".',
    'Unicode में सिरिलिक "а" जैसे वर्ण हैं जो लैटिन "a" से दृश्यात्मक रूप से अप्रभेद्य हैं।',
    'Unicode मध्ये सिरिलिक "а" सारखे वर्ण आहेत जे लॅटिन "a" पासून दृश्यात्मकदृष्ट्या अभेद्य आहेत.'),
 

  // ═══════════════════════════════════════════════════════════════
  // PASSWORD — 10 questions
  // ═══════════════════════════════════════════════════════════════
 
  q3('password','beginner',
    'Which password is strongest?',
    'कौन सा पासवर्ड सबसे मजबूत है?',
    'कोणता पासवर्ड सर्वात मजबूत आहे?',
    ['Tr0ub4dor&3!xK#9','password123','MyName1990','qwerty'],
    ['Tr0ub4dor&3!xK#9','password123','MyName1990','qwerty'],
    ['Tr0ub4dor&3!xK#9','password123','MyName1990','qwerty'],
    'A long password mixing uppercase, lowercase, digits and special characters is exponentially harder to crack.',
    'बड़े, छोटे अक्षर, अंक और विशेष वर्णों को मिलाने वाला लंबा पासवर्ड तोड़ना बेहद मुश्किल होता है।',
    'मोठी, लहान अक्षरे, अंक आणि विशेष वर्ण मिसळणारा लांब पासवर्ड क्रॅक करणे खूप कठीण असते.'),
 
  q3('password','beginner',
    'Why should you never reuse passwords across multiple accounts?',
    'एक ही पासवर्ड कई खातों में क्यों नहीं उपयोग करना चाहिए?',
    'एकच पासवर्ड अनेक खात्यांमध्ये का वापरू नये?',
    ['If one site is breached attackers use those credentials on all your other accounts','It makes your password weaker over time','Password managers cannot store repeated passwords','It slows down login speed'],
    ['एक साइट पर सेंध लगने पर हमलावर उन क्रेडेंशियल को आपके सभी अन्य खातों पर उपयोग करते हैं','इससे आपका पासवर्ड समय के साथ कमजोर होता है','पासवर्ड मैनेजर दोहराए गए पासवर्ड संग्रहीत नहीं कर सकते','यह लॉगिन गति को धीमा करता है'],
    ['एक साइट भंग झाल्यास आक्रमणकर्ते त्या क्रेडेन्शियल्स तुमच्या सर्व इतर खात्यांवर वापरतात','यामुळे तुमचा पासवर्ड कालांतराने कमकुवत होतो','पासवर्ड मॅनेजर पुनरावृत्ती पासवर्ड साठवू शकत नाहीत','यामुळे लॉगिन वेग कमी होतो'],
    'Credential stuffing automates login attempts using leaked pairs — unique passwords per account stop this.',
    'क्रेडेंशियल स्टफिंग लीक हुई जोड़ी का उपयोग करके लॉगिन प्रयासों को स्वचालित करती है — प्रत्येक खाते के लिए अद्वितीय पासवर्ड इसे रोकते हैं।',
    'क्रेडेन्शियल स्टफिंग लीक झालेल्या जोड्या वापरून लॉगिन प्रयत्न स्वयंचलित करते — प्रत्येक खात्यासाठी अनन्य पासवर्ड हे थांबवतात.'),
 
  q3('password','beginner',
    'What is two-factor authentication (2FA)?',
    'दो-कारक प्रमाणीकरण (2FA) क्या है?',
    'दोन-घटक प्रमाणीकरण (2FA) म्हणजे काय?',
    ['Requiring a second verification step such as OTP in addition to your password','Using two different passwords for one account','Logging in from two devices simultaneously','Changing your password every two months'],
    ['पासवर्ड के अतिरिक्त OTP जैसे दूसरे सत्यापन चरण की आवश्यकता','एक खाते के लिए दो अलग पासवर्ड का उपयोग','दो उपकरणों से एक साथ लॉगिन','हर दो महीने में पासवर्ड बदलना'],
    ['पासवर्डव्यतिरिक्त OTP सारख्या दुसऱ्या सत्यापन चरणाची आवश्यकता','एका खात्यासाठी दोन वेगळे पासवर्ड वापरणे','दोन उपकरणांवरून एकत्र लॉगिन करणे','दर दोन महिन्यांनी पासवर्ड बदलणे'],
    '2FA means even if your password is stolen the attacker cannot log in without the second factor.',
    '2FA का अर्थ है कि भले ही आपका पासवर्ड चोरी हो जाए, दूसरे कारक के बिना हमलावर लॉगिन नहीं कर सकता।',
    '2FA चा अर्थ आहे की जरी तुमचा पासवर्ड चोरला गेला तरी दुसऱ्या घटकाशिवाय आक्रमणकर्ता लॉगिन करू शकत नाही.'),
 
  q3('password','intermediate',
    'What is credential stuffing?',
    'क्रेडेंशियल स्टफिंग क्या है?',
    'क्रेडेन्शियल स्टफिंग म्हणजे काय?',
    ['Automating login attempts across many services using breached username/password pairs','Manually guessing common passwords','Installing a keylogger to steal passwords','Using rainbow tables to reverse hashes'],
    ['लीक हुए यूजरनेम/पासवर्ड जोड़ों का उपयोग करके कई सेवाओं पर लॉगिन प्रयासों को स्वचालित करना','सामान्य पासवर्डों का मैन्युअल अनुमान लगाना','पासवर्ड चुराने के लिए कीलॉगर स्थापित करना','हैश को उलटने के लिए रेनबो टेबल का उपयोग'],
    ['लीक झालेल्या युजरनेम/पासवर्ड जोड्या वापरून अनेक सेवांवर लॉगिन प्रयत्न स्वयंचलित करणे','सामान्य पासवर्डचा मॅन्युअल अंदाज करणे','पासवर्ड चोरण्यासाठी कीलॉगर स्थापित करणे','हॅश उलटण्यासाठी रेनबो टेबल वापरणे'],
    'Credential stuffing leverages the reality that people reuse passwords.',
    'क्रेडेंशियल स्टफिंग इस वास्तविकता का फायदा उठाती है कि लोग पासवर्ड का पुनः उपयोग करते हैं।',
    'क्रेडेन्शियल स्टफिंग या वास्तवाचा फायदा घेते की लोक पासवर्ड पुन्हा वापरतात.'),
 
  q3('password','intermediate',
    'Why is MD5 unsafe for storing passwords?',
    'MD5 पासवर्ड संग्रहीत करने के लिए असुरक्षित क्यों है?',
    'MD5 पासवर्ड साठवण्यासाठी का असुरक्षित आहे?',
    ['MD5 is extremely fast to compute making brute-force trivial on modern hardware','MD5 produces hashes that are too long','MD5 is not supported by databases','MD5 requires a special licence'],
    ['MD5 की गणना बेहद तेज है जो आधुनिक हार्डवेयर पर ब्रूट-फोर्स को आसान बनाती है','MD5 बहुत लंबे हैश उत्पन्न करता है','MD5 डेटाबेस द्वारा समर्थित नहीं है','MD5 के लिए विशेष लाइसेंस की आवश्यकता है'],
    ['MD5 ची गणना अत्यंत जलद आहे जी आधुनिक हार्डवेअरवर ब्रूट-फोर्स सोपे करते','MD5 खूप लांब हॅश तयार करते','MD5 डेटाबेसद्वारे समर्थित नाही','MD5 साठी विशेष परवान्याची आवश्यकता आहे'],
    'Password hashing should be deliberately slow. MD5 produces millions of hashes per second on consumer GPUs.',
    'पासवर्ड हैशिंग जानबूझकर धीमी होनी चाहिए। MD5 उपभोक्ता GPUs पर प्रति सेकंड लाखों हैश उत्पन्न करता है।',
    'पासवर्ड हॅशिंग जाणूनबुजून हळू असणे आवश्यक आहे. MD5 ग्राहक GPUs वर प्रति सेकंद लाखो हॅश तयार करते.'),
 
  q3('password','intermediate',
    'What additional security does password salting provide?',
    'पासवर्ड सॉल्टिंग क्या अतिरिक्त सुरक्षा प्रदान करती है?',
    'पासवर्ड सॉल्टिंग कोणती अतिरिक्त सुरक्षा प्रदान करते?',
    ['Adding a unique random value per password defeats precomputed rainbow table attacks','It makes passwords longer before hashing','It encrypts the password before storage','It limits the number of login attempts'],
    ['प्रत्येक पासवर्ड के लिए एक अद्वितीय यादृच्छिक मान जोड़ना पूर्व-गणना रेनबो टेबल हमलों को विफल करता है','यह हैशिंग से पहले पासवर्ड को लंबा बनाता है','यह भंडारण से पहले पासवर्ड को एन्क्रिप्ट करता है','यह लॉगिन प्रयासों की संख्या सीमित करता है'],
    ['प्रत्येक पासवर्डसाठी एक अनन्य यादृच्छिक मूल्य जोडणे पूर्व-गणना रेनबो टेबल हल्ल्यांना पराभूत करते','ते हॅशिंगपूर्वी पासवर्ड लांब करते','ते संचयापूर्वी पासवर्ड एन्क्रिप्ट करते','ते लॉगिन प्रयत्नांची संख्या मर्यादित करते'],
    'Without salting identical passwords have identical hashes. Salting forces attackers to crack each hash individually.',
    'सॉल्टिंग के बिना समान पासवर्ड के समान हैश होते हैं। सॉल्टिंग हमलावरों को प्रत्येक हैश को व्यक्तिगत रूप से क्रैक करने के लिए मजबूर करती है।',
    'सॉल्टिंगशिवाय समान पासवर्डचे समान हॅश असतात. सॉल्टिंग आक्रमणकर्त्यांना प्रत्येक हॅश वैयक्तिकरित्या क्रॅक करण्यास भाग पाडते.'),
 
  q3('password','expert',
    'Argon2id is recommended over bcrypt because:',
    'bcrypt की तुलना में Argon2id क्यों अनुशंसित है?',
    'bcrypt पेक्षा Argon2id का शिफारस केली जाते?',
    ['It resists both GPU-based brute-force and cache side-channel attacks simultaneously','It is faster and easier to implement','It produces longer hash outputs','It is open-source software'],
    ['यह GPU-आधारित ब्रूट-फोर्स और कैश साइड-चैनल हमलों दोनों का एक साथ प्रतिरोध करता है','यह लागू करना तेज और आसान है','यह लंबे हैश आउटपुट उत्पन्न करता है','यह ओपन-सोर्स सॉफ्टवेयर है'],
    ['हे GPU-आधारित ब्रूट-फोर्स आणि कॅश साइड-चॅनल हल्ले दोन्हींचा एकत्रितपणे प्रतिकार करते','ते अंमलात आणणे जलद आणि सोपे आहे','ते लांब हॅश आउटपुट तयार करते','हे ओपन-सोर्स सॉफ्टवेअर आहे'],
    'Argon2id combines time-hardness and memory-hardness making it the most robust choice per OWASP.',
    'Argon2id समय-कठोरता और मेमोरी-कठोरता को जोड़ता है जो इसे OWASP के अनुसार सबसे मजबूत विकल्प बनाता है।',
    'Argon2id वेळ-कठोरता आणि मेमोरी-कठोरता एकत्र करते जे OWASP नुसार सर्वात मजबूत पर्याय बनवते.'),
 
  qe('password','expert',
    'In bcrypt what does increasing the work factor by 1 do?',
    ['It doubles the computational time required exponentially increasing cracking cost','It adds 1 round to the hash function','It increases the salt length by 8 bytes','It enables hardware acceleration'],
    "bcrypt's work factor is an exponent: cost=12 means 4096 iterations, cost=13 means 8192."),
 
  qe('password','expert',
    'FIDO2/WebAuthn passkeys are phishing-resistant because:',
    ['The private key operation is bound to the relying-party origin so a phishing site gets a rejected assertion','They generate OTPs that expire in 30 seconds','They use biometrics that cannot be transmitted','They are stored in the cloud and cannot be intercepted'],
    'WebAuthn includes the RP ID in the signed assertion. A phishing site gets an assertion the legitimate server rejects.'),
 
  qe('password','expert',
    'Kerberoasting targets:',
    ['Active Directory service accounts with SPNs whose TGS tickets can be cracked offline','Linux SSH private keys','Windows local administrator password hashes','VPN pre-shared keys stored in Group Policy'],
    'Any authenticated domain user can request TGS tickets for SPN-registered accounts and crack them offline.'),
   // ═══════════════════════════════════════════════════════════════
  // NETWORK — 10 questions
  // ═══════════════════════════════════════════════════════════════
 
  q3('network','beginner',
    'What is the main security risk of using public Wi-Fi?',
    'सार्वजनिक Wi-Fi उपयोग करने का मुख्य सुरक्षा जोखिम क्या है?',
    'सार्वजनिक Wi-Fi वापरण्याचा मुख्य सुरक्षा धोका काय आहे?',
    ['Attackers can intercept unencrypted traffic via man-in-the-middle attacks','Your battery drains faster','You cannot access HTTPS websites','The connection is always slower'],
    ['हमलावर मैन-इन-द-मिडल हमलों के माध्यम से अनएन्क्रिप्टेड ट्रैफिक को इंटरसेप्ट कर सकते हैं','आपकी बैटरी जल्दी खत्म होती है','आप HTTPS वेबसाइटों तक नहीं पहुंच सकते','कनेक्शन हमेशा धीमा होता है'],
    ['आक्रमणकर्ते मॅन-इन-द-मिडल हल्ल्यांद्वारे अनएन्क्रिप्टेड ट्रॅफिक इंटरसेप्ट करू शकतात','तुमची बॅटरी जलद संपते','तुम्ही HTTPS वेबसाइटवर प्रवेश करू शकत नाही','कनेक्शन नेहमी हळू असते'],
    'Public Wi-Fi is often unencrypted. Attackers can capture and read data in transit including credentials.',
    'सार्वजनिक Wi-Fi अक्सर अनएन्क्रिप्टेड होता है। हमलावर ट्रांसमिशन में डेटा, क्रेडेंशियल सहित, कैप्चर और पढ़ सकते हैं।',
    'सार्वजनिक Wi-Fi अनेकदा अनएन्क्रिप्टेड असते. आक्रमणकर्ते ट्रांसमिशनमधील डेटा, क्रेडेन्शियलसह, कॅप्चर आणि वाचू शकतात.'),
 
  q3('network','beginner',
    'What does a VPN primarily do?',
    'VPN मुख्य रूप से क्या करता है?',
    'VPN मुख्यतः काय करते?',
    ['Encrypts all internet traffic and tunnels it through a private server','Removes viruses from your device','Speeds up your internet connection','Blocks all advertisements automatically'],
    ['सभी इंटरनेट ट्रैफिक को एन्क्रिप्ट करता है और एक निजी सर्वर के माध्यम से टनल करता है','आपके डिवाइस से वायरस हटाता है','आपका इंटरनेट कनेक्शन तेज करता है','सभी विज्ञापनों को स्वचालित रूप से ब्लॉक करता है'],
    ['सर्व इंटरनेट ट्रॅफिक एन्क्रिप्ट करते आणि खाजगी सर्व्हरद्वारे टनल करते','तुमच्या डिव्हाइसमधून व्हायरस काढते','तुमचे इंटरनेट कनेक्शन वेगवान करते','सर्व जाहिराती आपोआप ब्लॉक करते'],
    'A VPN creates an encrypted tunnel so even on compromised public Wi-Fi an attacker sees only encrypted noise.',
    'एक VPN एन्क्रिप्टेड टनल बनाता है ताकि समझौता किए गए सार्वजनिक Wi-Fi पर भी हमलावर केवल एन्क्रिप्टेड शोर देखता है।',
    'VPN एन्क्रिप्टेड टनल तयार करते जेणेकरून तडजोड केलेल्या सार्वजनिक Wi-Fi वरही आक्रमणकर्त्याला फक्त एन्क्रिप्टेड नॉइज दिसते.'),
 
  qe('network','beginner',
    'What does a firewall do?',
    ['Monitors and filters network traffic based on security rules blocking unauthorised access','Cools down the computer processor','Backs up your files automatically','Speeds up the network connection'],
    'Firewalls are security gatekeepers — they inspect packets and allow or block them based on configured rules.'),
 
  qe('network','intermediate',
    'What is ARP spoofing and what does it enable?',
    ['Sending forged ARP replies to associate attacker MAC with a legitimate IP enabling MitM interception','Encrypting ARP packets for security','Blocking all ARP requests to prevent discovery','Changing the default gateway MAC legitimately'],
    'ARP has no authentication. Forged ARP replies poison device caches redirecting LAN traffic through the attacker.'),
 
  qe('network','intermediate',
    'What is network segmentation and why is it a best practice?',
    ['Dividing a network into isolated zones so compromising one segment does not expose others','Splitting internet bandwidth equally across all users','Compressing network packets to save bandwidth','Assigning static IP addresses to all devices'],
    'Segmentation contains breaches — an attacker who compromises the guest Wi-Fi cannot reach corporate servers.'),
 
  qe('network','intermediate',
    'What is SSL stripping and how does it work?',
    ['Intercepting HTTP-to-HTTPS redirects and replacing them with plain HTTP silently','Removing the SSL certificate from a web server','Decrypting SSL traffic at the firewall','Expired SSL certificates being ignored by the browser'],
    'HSTS with preloading defends against SSL stripping by forcing browsers to always use HTTPS.'),
 
  qe('network','expert',
    'TLS 1.3 eliminated static RSA key exchange. What security property does this enforce?',
    ['Perfect Forward Secrecy via ephemeral key exchange ensuring past sessions cannot be decrypted if private key is later compromised','Faster handshakes with no security trade-off','Larger encryption keys for all cipher suites','Mandatory certificate pinning for all connections'],
    'With static RSA an attacker recording traffic could later decrypt it if they obtain the server private key. PFS prevents this.'),
 
  qe('network','expert',
    'A SYN flood attack exploits which TCP mechanism?',
    ['The three-way handshake filling the server half-open connection table until it cannot accept new connections','The TCP FIN handshake used to close connections','TCP sequence number prediction for session hijacking','The TCP sliding window for bandwidth amplification'],
    'SYN floods exhaust server connection tables. SYN cookies mitigate this by encoding state in the sequence number.'),
 
  qe('network','expert',
    'BGP hijacking allows an attacker to:',
    ['Announce routes for IP prefixes they do not own attracting internet traffic through their infrastructure','Modify DNS responses for a domain','Intercept Wi-Fi traffic at the ISP level','Clone TLS certificates for major websites'],
    'BGP lacks built-in authentication. RPKI enables cryptographic validation of route origin authorisations.'),
 
  qe('network','expert',
    'Zero Trust architecture differs from traditional perimeter security because it:',
    ['Assumes no user device or location is inherently trusted and verifies every access request explicitly','Requires all traffic to pass through a single firewall','Trusts all internal traffic by default','Only applies to cloud environments'],
    'Traditional perimeter models trust internal traffic. Zero Trust applies continuous authentication and least privilege regardless of origin.'),
  // ═══════════════════════════════════════════════════════════════
  // SOCIAL ENGINEERING — 10 questions
  // ═══════════════════════════════════════════════════════════════
  qe('social-engineering','beginner',
    'What is social engineering in cybersecurity?',
    ['Psychologically manipulating people into revealing information or performing security-compromising actions','Building social media platforms for companies','Hacking through automated software exploits','A method for improving workplace productivity'],
    'Social engineering exploits human psychology rather than technical vulnerabilities.'),

  qe('social-engineering','beginner',
    'IT staff calls and asks for your password to fix an issue. You should:',
    ['Refuse — legitimate IT support never needs your actual password','Give them the password because they are authorised','Give them only half the password','Email the password instead'],
    'Legitimate IT teams can reset passwords without knowing your current one.'),

  qe('social-engineering','beginner',
    'What is tailgating in physical security?',
    ['Following an authorised person through a secure door without authenticating yourself','Following someone closely on the motorway','Sending follow-up phishing emails','Tracking someone on social media'],
    'Tailgating exploits human politeness — people hold doors for others without checking credentials.'),

  qe('social-engineering','intermediate',
    'What is pretexting?',
    ['Creating a fabricated scenario or false identity to extract information from a target','Sending a text message before calling a target','Writing misleading email subject lines','Pretending to offer technical support'],
    'Pretexters build elaborate cover stories — fake IT auditors or bank fraud investigators — to gain credibility.'),

  qe('social-engineering','intermediate',
    'What is a watering-hole attack?',
    ['Compromising a website that the target group regularly visits to deliver malware','Contaminating a physical water supply','Making repeated phone calls to a target','Sending bulk phishing emails to a department'],
    'Instead of attacking targets directly attackers compromise trusted third-party sites the targets frequent.'),

  qe('social-engineering','intermediate',
    'OSINT assists social engineering attacks by:',
    ['Gathering personal and organisational data from public sources to craft convincing pretexts','Providing hacking tools for attackers','Scanning internal networks for vulnerabilities','Automatically sending phishing emails'],
    'LinkedIn, company websites and social media provide attackers with enough data to impersonate colleagues convincingly.'),

  qe('social-engineering','expert',
    'Deepfake voice technology increases BEC risk because:',
    ['It enables real-time synthesis of a trusted executive voice defeating the safeguard of calling to confirm wire transfers','It improves email formatting quality','It automates the writing of phishing emails','It clones email accounts automatically'],
    'Documented BEC cases have used cloned CEO voices to authorise fraudulent wire transfers worth millions.'),

  qe('social-engineering','expert',
    'Cialdini\'s commitment and consistency principle is exploited by:',
    ['Using a small initial request creating psychological pressure to comply with larger subsequent requests','Maintaining a consistent email sending schedule','Sending the same message across multiple channels','Always using the same pretext script'],
    'Foot-in-the-door: once someone agrees to a small request they feel obligated to stay consistent.'),

  qe('social-engineering','expert',
    'What distinguishes a supply-chain social engineering attack?',
    ['Compromising a trusted vendor or partner to reach the ultimate target through an already-trusted relationship','It targets suppliers exclusively','It only works on retail companies','It requires physical access to the target organisation'],
    'Supply-chain attacks exploit transitive trust — instead of attacking a hardened target attackers compromise a trusted supplier.'),

  qe('social-engineering','expert',
    'Why do simulation-based security programmes outperform annual lecture training?',
    ['Immediate corrective feedback during realistic simulated attacks creates lasting behavioural conditioning','They are cheaper to run','Annual lectures provide more comprehensive content coverage','Simulations are more entertaining for employees'],
    'Contextual consequence-based learning with immediate feedback produces durable behaviour change that lectures cannot.'),

  // ═══════════════════════════════════════════════════════════════
  // MALWARE — 10 questions
  // ═══════════════════════════════════════════════════════════════
  qe('malware','beginner',
    'What is ransomware?',
    ['Malware that encrypts files and demands payment for the decryption key','Software that improves computer performance','A type of antivirus protection','A network monitoring tool'],
    'Ransomware encrypts victim data making it completely inaccessible. Regular offline backups are the primary defence.'),

  qe('malware','beginner',
    'How does a Trojan horse malware infect a system?',
    ['By disguising itself as legitimate software while secretly containing malicious code','By exploiting operating system vulnerabilities automatically','By spreading through USB drives only','By intercepting network traffic'],
    'Like the mythological horse Trojans trick users into voluntarily installing them.'),

  qe('malware','beginner',
    'What is a common sign of malware infection?',
    ['Unexpected slowdowns unusual data usage pop-ups and programmes launching without user action','The device runs faster than usual','The screen brightness increases automatically','The battery charges faster'],
    'Malware consumes system resources for cryptomining botnet activity or data exfiltration.'),

  qe('malware','intermediate',
    'What makes fileless malware harder to detect?',
    ['It lives in memory and abuses legitimate built-in tools like PowerShell leaving no executable on disk','It uses larger encrypted files that evade size-based scanning','It uses a different programming language per infection','It only runs for 5 minutes before deleting itself'],
    'Living-off-the-land attacks use trusted OS tools as weapons. Without disk artefacts signature scanning is blind.'),

  qe('malware','intermediate',
    'What is a rootkit and why is it dangerous?',
    ['Malware that modifies core OS components to hide its presence and maintain persistent stealthy access','A tool for managing system root passwords','A legitimate system administration tool','Software that roots Android devices for customisation'],
    'Rootkits operate below the OS trust boundary and can hide files processes and network connections from antivirus.'),

  qe('malware','intermediate',
    'Command and Control (C2) infrastructure is used by malware to:',
    ['Receive instructions from attackers and exfiltrate stolen data from infected hosts','Update antivirus signature databases','Store encrypted backup copies of malware','Host legitimate websites as camouflage'],
    'C2 channels are the nervous system of malware operations. Disrupting C2 renders botnets and RATs useless.'),

  qe('malware','expert',
    'Process hollowing is a code injection technique where:',
    ['A legitimate process is spawned in suspended state its memory replaced with malicious code then resumed under the trusted process name','A process is crashed to cause a buffer overflow','Malware hides inside legitimate process memory without replacing it','System processes are deleted to destabilise the OS'],
    'Process hollowing makes malicious code run under trusted names like svchost.exe evading process-based detection.'),

  qe('malware','expert',
    'A supply-chain attack on software is particularly dangerous because:',
    ['Malicious code is injected into trusted software build pipelines reaching thousands of customers who install the signed update automatically','It targets only small companies without security teams','It requires physical access to the software vendor','It only works on Windows operating systems'],
    'Supply-chain attacks weaponise the software update trust mechanism. Victims install malware willingly via a trusted signed update.'),

  qe('malware','expert',
    'EDR improves over traditional AV because it:',
    ['Provides continuous behavioural monitoring telemetry collection and automated response detecting zero-day and fileless attacks','Uses larger and more frequently updated signature databases','Only scans executables at download time','Blocks all internet access to prevent malware communication'],
    'EDR detects attacks through behaviour patterns not signatures — it can identify malicious use of legitimate tools.'),

  qe('malware','expert',
    'What is a logic bomb and who typically plants them?',
    ['Malicious code that remains dormant until a specific condition triggers it — most often planted by disgruntled insiders','A physically explosive device targeting server hardware','Malware that triggers only during network outages','Ransomware with a countdown timer'],
    'Logic bombs are insider-threat weapons typically set to detonate on the planter\'s termination date.'),

  // ═══════════════════════════════════════════════════════════════
  // BROWSING — 10 questions
  // ═══════════════════════════════════════════════════════════════
  qe('browsing','beginner',
    'What does the padlock in a browser address bar indicate?',
    ['The connection uses HTTPS and data is encrypted between browser and server','The website is government-verified and 100% safe','The website contains no advertisements','The page cannot be copied or screenshotted'],
    'HTTPS encrypts data in transit but does not guarantee the site is trustworthy. Phishing sites also use HTTPS.'),

  qe('browsing','beginner',
    'A pop-up says "Your PC has 5 viruses! Call 1800-XXX now!" This is:',
    ['A scareware pop-up scam — close the browser tab and never call the number','A genuine Windows Defender security alert','A legitimate antivirus notification','An official Microsoft support message'],
    'Scareware creates fake urgency to trick users into calling premium-rate fake support lines.'),

  qe('browsing','beginner',
    'Why should you keep your web browser updated?',
    ['Browser updates patch zero-day vulnerabilities actively exploited in drive-by download attacks','Updates only add cosmetic features and themes','Updates make websites load slower','Browser versions have no security significance'],
    'Browser vulnerabilities are prime targets for exploit kits. Patches arrive frequently — unpatched browsers are a known attack vector.'),

  qe('browsing','intermediate',
    'What is a Cross-Site Scripting (XSS) attack?',
    ['An attack that injects malicious JavaScript into a trusted web page executing in other users browsers','An attack that injects SQL into a database query','A network-level attack intercepting HTTP traffic','An attack that forges HTTP request headers'],
    'XSS allows attackers to run arbitrary JavaScript in victims browsers within a trusted site context.'),

  qe('browsing','intermediate',
    'What is Cross-Site Request Forgery (CSRF)?',
    ['An attack that tricks an authenticated users browser into sending a forged request to a target site using their session cookies','An attack that steals cookies from the browser cache','An attack that modifies DNS responses to redirect traffic','An attack that intercepts SSL connections'],
    'CSRF abuses automatic cookie attachment — a malicious page can trigger authenticated bank transfers without user knowledge.'),

  qe('browsing','intermediate',
    'What does HTTP Strict Transport Security (HSTS) protect against?',
    ['Protocol downgrade attacks and SSL stripping by forcing browsers to use HTTPS refusing HTTP fallback','Cross-site scripting injection attacks','SQL injection through HTTP forms','Malware downloads from HTTPS websites'],
    'HSTS preloading ensures browsers never attempt HTTP connections to protected domains.'),

  qe('browsing','expert',
    'SSRF is especially dangerous in cloud environments because:',
    ['Forcing the server to request cloud metadata endpoints can retrieve IAM credentials enabling full infrastructure compromise','It only affects servers running Linux','It can only reach public internet resources','Cloud providers patch SSRF automatically'],
    'SSRF was the root cause of the Capital One breach enabling retrieval of AWS credentials granting access to S3 buckets.'),

  qe('browsing','expert',
    'Web cache poisoning works by:',
    ['Injecting malicious responses into shared caches using unkeyed HTTP headers so the poisoned response is served to all subsequent users','Deleting cached files from CDN servers','Stealing session cookies from the browser cache','Overloading the CDN with requests'],
    'Unkeyed headers that influence responses but are not included in the cache key allow attackers to poison CDN caches.'),

  qe('browsing','expert',
    'OWASP Top 10 2021 placed Broken Access Control at number one because:',
    ['It appeared in 94% of tested applications and consistently enables severe impact including IDOR and privilege escalation','It is the most technically complex vulnerability','It is the easiest to fix','It only affects web applications not APIs'],
    'BAC overtook injection in 2021 due to its sheer prevalence. IDOR vulnerabilities alone led to some of the largest data breaches.'),

  qe('browsing','expert',
    'HTTP Request Smuggling exploits:',
    ['Discrepancies in how front-end proxies and back-end servers parse HTTP request boundaries enabling hidden requests to the back end','Differences in how browsers render HTML between vendors','Inconsistencies in SSL certificate validation between servers','Differences in JavaScript engine behaviour across browsers'],
    'When a reverse proxy and back-end disagree on where one request ends an attacker can smuggle crafted requests.'),

  // ═══════════════════════════════════════════════════════════════
  // MOBILE — 10 questions
  // ═══════════════════════════════════════════════════════════════
  qe('mobile','beginner',
    'What is the safest source for downloading smartphone apps?',
    ['Only official stores (Google Play, Apple App Store) which perform security vetting','Any website that appears in Google search results','Links shared in WhatsApp groups','Telegram channels offering free premium apps'],
    'Official stores apply security review and Play Protect scanning. Third-party APK files bypass all of this.'),

  qe('mobile','beginner',
    'Why should you keep your smartphone OS updated?',
    ['Updates patch actively exploited security vulnerabilities — attackers begin targeting known CVEs within hours of disclosure','Updates add new emoji and wallpapers','Updates make the phone run slower','OS updates are purely optional cosmetic changes'],
    'Unpatched mobile OS vulnerabilities are actively weaponised. Updates are the only defence for many CVEs.'),

  qe('mobile','beginner',
    'Why is enabling a screen lock critically important?',
    ['Without a screen lock anyone with physical access gains immediate access to all apps messages banking and stored credentials','It conserves battery life','It prevents the phone from overheating','It is required by mobile carrier agreements'],
    'Physical access without a lock screen provides complete access to everything stored on or accessible through the device.'),

  qe('mobile','intermediate',
    'What is an IMSI catcher (Stingray) and what threat does it pose?',
    ['A device impersonating a cell tower forcing nearby phones to connect through it enabling call and SMS interception including OTPs','A legitimate cell tower that improves coverage','An app used for mobile device management','A software tool for optimising signal strength'],
    'IMSI catchers exploit the lack of mutual authentication in 2G/3G protocols intercepting all SMS-based OTPs.'),

  qe('mobile','intermediate',
    'What is certificate pinning and why do banking apps use it?',
    ['Hardcoding expected TLS certificate details in the app so it rejects any certificate not matching the known server preventing MitM','Storing SSL certificates locally for offline use','Compressing certificates to save bandwidth','Rotating certificates automatically every 90 days'],
    'Without pinning any trusted CA can issue a certificate for your bank domain. Pinning ensures only the specific certificate is accepted.'),

  qe('mobile','intermediate',
    'Android overlay attacks exploit which permission?',
    ['SYSTEM_ALERT_WINDOW to draw a fake UI layer over legitimate banking apps capturing credentials before they reach the real app','READ_CONTACTS for address book access','CAMERA to take screenshots of banking screens','READ_SMS to intercept OTPs'],
    'Banking Trojans use overlay attacks detecting when a banking app opens and rendering a fake screen on top.'),

  qe('mobile','expert',
    'ARM TrustZone provides security by:',
    ['Creating a hardware-isolated Trusted Execution Environment where biometric templates and cryptographic keys are processed even if the main OS is compromised','Encrypting all data at rest on the device','Monitoring app behaviour for suspicious network connections','Scanning installed apps for malware signatures'],
    'TrustZone divides the processor into Normal World (Android OS) and Secure World (TEE). Even a fully rooted device cannot access TEE data.'),

  qe('mobile','expert',
    'A zero-click exploit is more dangerous than conventional exploits because:',
    ['It compromises the device without any user interaction — simply receiving a crafted message can trigger full compromise','It is cheaper for attackers to purchase','It only works on jailbroken devices','It requires the attacker to be on the same Wi-Fi network'],
    'NSO Group\'s FORCEDENTRY exploited CoreGraphics in iMessage — opening the Messages app was enough for complete device compromise.'),

  qe('mobile','expert',
    'The confused deputy problem in Android security means:',
    ['A high-privilege component fails to validate caller identity allowing a malicious low-privilege app to use it as a proxy for its permissions','A misconfigured MDM policy for corporate devices','A bug causing apps to crash when switching between user accounts','A problem with Android permission inheritance in multi-user mode'],
    'Exported Android components without proper caller validation become privilege-escalation vectors for malicious apps.'),

  qe('mobile','expert',
    'iOS Pointer Authentication Codes (PAC) mitigate:',
    ['Return-Oriented Programming exploits — PAC cryptographically signs function pointers so any tampered pointer crashes rather than executes','SQL injection targeting CoreData databases','Phishing attacks targeting Safari','App Store bypass through enterprise provisioning profiles'],
    'PAC uses hardware instructions to sign pointers at creation. Memory corruption bugs produce invalid signatures causing crash not execution.'),

  // ═══════════════════════════════════════════════════════════════
  // PRIVACY — 10 questions
  // ═══════════════════════════════════════════════════════════════
  qe('privacy','beginner',
    'What is Personally Identifiable Information (PII)?',
    ['Information that can identify a specific individual such as name Aadhaar number email or biometrics','Any data stored on a computer','Only government-issued identification documents','Data that is publicly available on social media'],
    'PII is the foundation of privacy and data protection law. Its unauthorised exposure enables identity theft and fraud.'),

  qe('privacy','beginner',
    'What does incognito / private browsing actually protect?',
    ['It only prevents your browser from storing local history — your ISP employer and websites you visit can still see your activity','It makes you completely anonymous to all parties','It blocks all tracking cookies permanently','It encrypts all traffic leaving your device'],
    'Incognito mode is a local privacy feature only. Network-level observers and website servers still see your activity.'),

  qe('privacy','beginner',
    'Why is oversharing on LinkedIn a security risk?',
    ['Attackers harvest work history colleague names company email formats and org charts for targeted spear phishing','LinkedIn data is legally protected and cannot be misused','Only public figures face risk from LinkedIn oversharing','LinkedIn privacy settings prevent any data from being accessed'],
    'LinkedIn is the primary OSINT source for corporate social engineering providing everything attackers need.'),

  qe('privacy','intermediate',
    'What does the GDPR right to erasure entitle individuals to?',
    ['The right to request an organisation erase their personal data when no longer necessary or when they withdraw consent','The right to have all information about them removed from the entire internet','The right to delete their social media accounts','The right to have criminal records expunged'],
    'GDPR Article 17 creates a right to erasure with specific conditions. Controllers may retain data when legal obligations override it.'),

  qe('privacy','intermediate',
    'What is differential privacy and where is it used?',
    ['A mathematical technique adding calibrated noise to datasets so individual records cannot be inferred while accurate aggregate statistics are preserved','A privacy policy that treats different users differently','An encryption method for differential data types','A law creating different privacy rules for different sectors'],
    'Differential privacy provides a mathematical privacy guarantee used by Apple and Google for analytics.'),

  qe('privacy','intermediate',
    'India\'s DPDP Act 2023 applies to:',
    ['Any entity processing digital personal data collected in India and processing outside India if related to offering services to Indian residents','Only Indian government organisations and PSUs','Only foreign companies with Indian operations','Only companies processing more than 10 million records'],
    'DPDP 2023 has extraterritorial scope similar to GDPR — any entity handling data of Indian residents must comply.'),

  qe('privacy','expert',
    'Data re-identification research demonstrates that anonymisation is often insufficient because:',
    ['Combining supposedly anonymous datasets with auxiliary public information can re-identify individuals as demonstrated with Netflix and AOL data','Anonymisation algorithms are poorly implemented','Only small datasets can be de-anonymised','Modern anonymisation techniques are mathematically proven permanent'],
    'Narayanan and Shmatikoff showed Netflix anonymous ratings could be re-identified by cross-referencing with public IMDb reviews.'),

  qe('privacy','expert',
    'Homomorphic encryption enables:',
    ['Performing computations directly on encrypted data without decrypting it so the cloud provider processes ciphertext and cannot see plaintext','Encrypting data during transmission only','Encrypting different data fields with different keys','Real-time encryption of database queries'],
    'FHE allows cloud providers to run analytics on data they mathematically cannot see — the holy grail of privacy-preserving computation.'),

  qe('privacy','expert',
    'The Schrems II judgment invalidated Privacy Shield because:',
    ['US surveillance laws do not provide EU data subjects rights equivalent to EU law and there is no effective judicial redress mechanism','The agreement had technical implementation flaws','US companies stopped voluntarily participating','The agreement expired due to non-renewal'],
    'Schrems II requires Transfer Impact Assessments for US transfers. The EU-US Data Privacy Framework is Privacy Shield\'s successor.'),

  qe('privacy','expert',
    'Zero-Knowledge Proofs (ZKPs) provide which capability?',
    ['Mathematically proving knowledge of a fact such as age over 18 without revealing the underlying data used to establish that fact','Proving identity without sharing any data','Encrypting proof documents for secure transmission','Verifying blockchain transactions without a network connection'],
    'ZKPs allow selective disclosure — prove you are over 18 without revealing your actual date of birth.'),

  // ═══════════════════════════════════════════════════════════════
  // PAYMENTS — 10 questions
  // ═══════════════════════════════════════════════════════════════
  qe('payments','beginner',
    'You receive a call: "Your UPI is blocked — share your PIN to unblock." You should:',
    ['Hang up — no bank UPI platform or NPCI ever asks for your PIN over the phone','Share the PIN immediately to avoid account closure','Share only the last 2 digits as a compromise','Call them back on the number they provide'],
    'This is classic vishing fraud. No legitimate financial institution ever requests your PIN OTP or password via an incoming call.'),

  qe('payments','beginner',
    'A buyer on OLX asks you to scan a QR code to receive payment. You should:',
    ['Refuse — scanning a UPI QR code initiates a payment FROM your account. Share your UPI ID to receive money instead','Scan it because QR codes are always safe','Scan it only if the amount looks correct','Scan it after verifying the buyer\'s identity'],
    'In UPI you scan QR codes to pay. To receive money you share your UPI ID phone number or your own QR code.'),

  qe('payments','beginner',
    'What is the national helpline for reporting digital payment fraud in India?',
    ['1930 — National Cybercrime and Financial Fraud Helpline','100 — Police emergency','112 — National emergency services','155260 — RBI consumer helpline'],
    'Dial 1930 immediately after discovering financial fraud. Early reporting enables banks to potentially freeze fraudulent accounts.'),

  qe('payments','intermediate',
    'What is SIM swapping fraud and why is it effective against SMS 2FA?',
    ['Fraudulently convincing a mobile carrier to port your number to an attacker SIM enabling them to receive all your SMS OTPs','Physically swapping your SIM card to a new phone','A technical glitch that duplicates your SIM card','Cloning your SIM card using NFC technology'],
    'SIM swap completely compromises SMS-based 2FA. All OTPs for banking email and social media go to the attacker device.'),

  qe('payments','intermediate',
    'Why should you never install remote access apps like AnyDesk when asked by someone claiming to resolve a banking issue?',
    ['Remote access gives the caller complete real-time control over your device enabling them to operate banking apps and transfer funds','These apps are technically too complex for banking support use','These apps are not compatible with banking applications','The apps drain battery while running'],
    'Remote access fraud is one of India\'s most common banking fraud vectors. The agent takes control and transfers funds while watching.'),

  qe('payments','intermediate',
    'What is juice jacking?',
    ['Malware installation or data theft via compromised public USB charging ports that carry both power and data connections','Theft of beverages in shared spaces','A type of mobile ransomware','Overcharging of phone batteries via high-wattage chargers'],
    'Public USB charging points in airports and hotels can be weaponised. Use AC adapters or a USB data blocker.'),

  qe('payments','expert',
    'EMV 3-D Secure 2.0 (3DS2) improves on 3DS 1.0 because:',
    ['Risk-based authentication using 100+ contextual data elements enables frictionless flows for low-risk transactions while challenging only suspicious ones','3DS2 requires a static password for every transaction','3DS2 completely removes authentication for trusted merchants','3DS2 simply adds an additional SMS OTP step to all transactions'],
    '3DS2 intelligent risk engine means 95%+ of low-risk transactions complete seamlessly without a challenge.'),

  qe('payments','expert',
    'The RBI tokenisation mandate requires merchants to:',
    ['Replace raw card numbers with payment tokens at the merchant side — actual card numbers can no longer be stored by merchants','Store card numbers in encrypted form using AES-256','Obtain RBI certification before accepting card payments','Display partial card numbers on all receipts'],
    'Tokenisation means a breach of a merchant payment system only exposes tokens that are useless outside that specific context.'),

  qe('payments','expert',
    'Synthetic identity fraud is difficult to detect because:',
    ['It combines a real credential such as a real PAN with a fabricated name creating a technically valid identity that passes initial verification and builds credit history before a bust-out','It uses completely fabricated information that systems easily flag','It targets only elderly populations','Synthetic identities are always associated with known criminal networks'],
    'Synthetic identities pass KYC because one real element (the ID number) satisfies regulatory requirements.'),

  qe('payments','expert',
    'ML-based fraud detection in UPI identifies money mule networks using:',
    ['Graph analytics modelling transaction relationships across accounts — mule networks exhibit distinctive fan-in fan-out patterns','Simple velocity rules checking transaction frequency','IP address blacklists alone','Manual review of high-value transactions'],
    'Mule networks create distinctive transaction graph signatures. Graph ML algorithms identify these patterns that rule-based systems miss.'),

  // ═══════════════════════════════════════════════════════════════
  // CYBER LAWS — 10 questions
  // ═══════════════════════════════════════════════════════════════
  qe('cyber-laws','beginner',
    'Which Indian law primarily governs cybercrime offences?',
    ['Information Technology Act 2000 (IT Act) amended in 2008','Indian Penal Code 1860','Consumer Protection Act 2019','Right to Information Act 2005'],
    'The IT Act 2000 provides the legal framework for cybercrime prosecution electronic evidence and data protection in India.'),

  qe('cyber-laws','beginner',
    'CERT-In is responsible for:',
    ['Coordinating national cybersecurity incident response issuing security advisories and mandating 6-hour breach reporting','Conducting police investigations into cybercrimes','Licensing internet service providers','Adjudicating civil disputes under the IT Act'],
    'CERT-In operates under MeitY as India\'s national nodal agency with one of the world\'s strictest breach notification timelines.'),

  qe('cyber-laws','beginner',
    'What is the official Indian portal for reporting cybercrime?',
    ['cybercrime.gov.in — managed by the Ministry of Home Affairs','cybersafety.gov.in','ncib.gov.in','cyberpolice.nic.in'],
    'cybercrime.gov.in enables online filing of complaints for financial fraud cyberbullying and child exploitation material.'),

  qe('cyber-laws','intermediate',
    'Section 66C of the IT Act specifically criminalises:',
    ['Fraudulent use of another person\'s electronic signature password or unique identification feature','Publishing obscene material electronically','Hacking into a computer system without authorisation','Tampering with computer source code'],
    'Section 66C targets identity theft and credential fraud with up to 3 years imprisonment and fine up to Rs. 1 lakh.'),

  qe('cyber-laws','intermediate',
    'India\'s DPDP Act 2023 introduced which new entity designation?',
    ['Data Fiduciary — any entity that determines the purpose and means of processing personal data carrying primary compliance obligations','Data Auditor — an independent auditor of data practices','Data Regulator — a private sector equivalent of the Data Protection Board','Data Custodian — an entity storing data on behalf of others'],
    'Data Fiduciary obligations under DPDP 2023 are broadly equivalent to GDPR\'s data controller concept.'),

  qe('cyber-laws','intermediate',
    'The K.S. Puttaswamy judgment (2017) is significant for cyber law because:',
    ['A 9-judge Supreme Court bench unanimously held Right to Privacy is a fundamental right under Article 21 shaping data protection legislation','It established the right to free internet access as a fundamental right','It upheld Section 66A of the IT Act','It established India\'s first data localisation requirement'],
    'Puttaswamy was the constitutional foundation for striking down Section 66A and drove the creation of the DPDP Act 2023.'),

  qe('cyber-laws','expert',
    'IT (Intermediary Guidelines) Rules 2021 require significant social media intermediaries (SSMIs) to:',
    ['Appoint a Grievance Officer Nodal Officer and Chief Compliance Officer in India and implement first-originator traceability for messaging platforms on court order','Only publish quarterly transparency reports','Pay a government licence fee proportional to their user base','Share all user data with Indian intelligence agencies on request'],
    'SSMIs (platforms with over 5 million Indian users) face a tiered compliance regime. The traceability provision has raised E2E encryption concerns.'),

  qe('cyber-laws','expert',
    'The EU Cyber Resilience Act (CRA) 2024 introduces mandatory obligations for:',
    ['All manufacturers of products with digital elements placed on the EU market including security-by-design requirements 5-year update obligations and coordinated vulnerability disclosure','Only software companies with EU headquarters','Only critical infrastructure operators in EU member states','Only cloud service providers processing EU personal data'],
    'CRA extends mandatory cybersecurity baseline requirements to consumer IoT industrial devices and software filling the regulatory gap GDPR left for product security.'),

  qe('cyber-laws','expert',
    'Legal controversy around offensive hack-back operations centres on:',
    ['Whether active cyber operations against foreign infrastructure violate state sovereignty under UN Charter Article 2(4) and whether misattribution could escalate incidents into armed conflict','The high cost of offensive cyber tools','Whether private companies have the technical capability','Whether hack-back improves security outcomes'],
    'The Tallinn Manual 2.0 establishes that even non-lethal cyber operations against sovereign infrastructure may constitute a prohibited use of force.'),

  qe('cyber-laws','expert',
    'CERT-In\'s 2022 mandatory incident reporting directions are controversial because:',
    ['The 6-hour reporting window mandatory log retention VPN provider customer data retention requirements were issued without public consultation and raise operational burden and privacy concerns','They require reporting too infrequently compared to global standards','They only apply to government organisations','They conflict with RBI\'s separate incident reporting requirements'],
    'Cybersecurity researchers and industry bodies objected to the absence of consultation and the conflict with privacy principles in VPN log requirements.'),
];

// ─── ARTICLES ─────────────────────────────────────────────────────────────────
const articles = [
  { category:'phishing', title:{en:'How to Identify Phishing Emails',hi:'फिशिंग ईमेल कैसे पहचानें',mr:'फिशिंग ईमेल कसे ओळखावे'}, content:{en:'Phishing emails impersonate trusted senders to steal credentials. Look for generic greetings, urgent language, mismatched sender domains, and suspicious links. Always hover over links before clicking and navigate to banking sites by typing the URL directly.',hi:'फ़िशिंग ईमेल विश्वसनीय प्रेषकों का प्रतिरूपण करती हैं। हमेशा URL टाइप करके बैंकिंग साइट पर जाएं।',mr:'फिशिंग ईमेल विश्वासार्ह प्रेषकांचे अनुकरण करतात. नेहमी URL टाइप करून बँकिंग साइटवर जा.'}, tips:[{en:'Check the full sender email domain',hi:'पूरा ईमेल डोमेन जांचें',mr:'पूर्ण ईमेल डोमेन तपासा'},{en:'Hover over links to preview real destination',hi:'वास्तविक URL देखने के लिए होवर करें',mr:'खरी URL पाहण्यासाठी होव्हर करा'},{en:'Banks never ask for OTP or password via email',hi:'बैंक ईमेल से OTP नहीं मांगते',mr:'बँका ईमेलद्वारे OTP मागत नाहीत'},{en:'When in doubt call the organisation on their official number',hi:'संदेह होने पर आधिकारिक नंबर पर कॉल करें',mr:'शंका असल्यास अधिकृत नंबरवर कॉल करा'}], icon:'🎣', readTime:4 },
  { category:'password', title:{en:'How to Create Strong Passwords',hi:'मजबूत पासवर्ड कैसे बनाएं',mr:'मजबूत पासवर्ड कसे तयार करावे'}, content:{en:'Use at least 12 characters mixing upper/lowercase, digits and symbols. Never reuse passwords across accounts. Use a free password manager like Bitwarden. Enable 2FA everywhere possible.',hi:'12+ अक्षरों के मिश्रित पासवर्ड का उपयोग करें। पासवर्ड मैनेजर का उपयोग करें।',mr:'12+ अक्षरांचा मिश्र पासवर्ड वापरा. पासवर्ड मॅनेजर वापरा.'}, tips:[{en:'Use 12+ characters with mixed types',hi:'12+ अक्षर मिश्रित प्रकारों के साथ',mr:'12+ अक्षरे मिश्र प्रकारांसह'},{en:'Never reuse passwords across accounts',hi:'खातों में पासवर्ड न दोहराएं',mr:'खात्यांमध्ये पासवर्ड पुन्हा वापरू नका'},{en:'Enable 2FA everywhere',hi:'हर जगह 2FA सक्षम करें',mr:'सर्वत्र 2FA सक्षम करा'},{en:'Use Bitwarden or similar password manager',hi:'Bitwarden जैसे पासवर्ड मैनेजर का उपयोग करें',mr:'Bitwarden सारखा पासवर्ड मॅनेजर वापरा'}], icon:'🔐', readTime:3 },
  { category:'payments', title:{en:'Safe UPI and Digital Payment Practices',hi:'सुरक्षित UPI और डिजिटल भुगतान',mr:'सुरक्षित UPI आणि डिजिटल पेमेंट'}, content:{en:'You never need your UPI PIN to receive money. PIN is only used to send. Scammers send collect requests or QR codes that debit your account. Never share OTP or PIN on any call. Report fraud immediately to 1930.',hi:'UPI पिन केवल पैसे भेजने के लिए है। धोखाधड़ी को 1930 पर रिपोर्ट करें।',mr:'UPI PIN फक्त पैसे पाठवण्यासाठी आहे. फसवणूक 1930 वर नोंदवा.'}, tips:[{en:'NEVER share UPI PIN or OTP with anyone',hi:'UPI PIN या OTP कभी शेयर न करें',mr:'UPI PIN किंवा OTP कधीही शेअर करू नका'},{en:'PIN is only to SEND money never to receive',hi:'PIN केवल भेजने के लिए है',mr:'PIN फक्त पाठवण्यासाठी आहे'},{en:'Report fraud to 1930 immediately',hi:'धोखाधड़ी को 1930 पर तुरंत रिपोर्ट करें',mr:'फसवणूक ताबडतोब 1930 वर नोंदवा'},{en:'Decline collect requests from unknown sources',hi:'अज्ञात collect request अस्वीकार करें',mr:'अज्ञात collect request नाकारा'}], icon:'💳', readTime:4 },
  { category:'network', title:{en:'Public Wi-Fi Risks and Safe Practices',hi:'सार्वजनिक Wi-Fi जोखिम और सुरक्षा',mr:'सार्वजनिक Wi-Fi धोके आणि सुरक्षा'}, content:{en:'Public Wi-Fi is often unencrypted. Attackers set up fake hotspots to intercept traffic. Always use a VPN, avoid accessing banking on public networks, and disable Wi-Fi auto-connect on your device.',hi:'सार्वजनिक Wi-Fi पर VPN का उपयोग करें।',mr:'सार्वजनिक Wi-Fi वर VPN वापरा.'}, tips:[{en:'Always use a VPN on public Wi-Fi',hi:'सार्वजनिक Wi-Fi पर VPN का उपयोग करें',mr:'सार्वजनिक Wi-Fi वर VPN वापरा'},{en:'Never access banking on public networks',hi:'सार्वजनिक नेटवर्क पर बैंकिंग न करें',mr:'सार्वजनिक नेटवर्कवर बँकिंग करू नका'},{en:'Disable Wi-Fi auto-connect',hi:'Wi-Fi ऑटो-कनेक्ट बंद करें',mr:'Wi-Fi ऑटो-कनेक्ट बंद करा'},{en:'Use mobile data for financial transactions',hi:'वित्तीय लेनदेन के लिए मोबाइल डेटा उपयोग करें',mr:'आर्थिक व्यवहारांसाठी मोबाइल डेटा वापरा'}], icon:'📶', readTime:3 },
  { category:'browsing', title:{en:'How to Avoid Online Scams',hi:'ऑनलाइन घोटालों से बचाव',mr:'ऑनलाइन घोटाळे टाळणे'}, content:{en:'Online scams promise unrealistic returns, prizes, or jobs in exchange for advance fees or personal data. If it sounds too good to be true, it is a scam. Always verify through official channels and report to cybercrime.gov.in.',hi:'अगर यह बहुत अच्छा लगता है तो यह घोटाला है।',mr:'जर ते खूपच चांगले वाटत असेल तर ते घोटाळे आहे.'}, tips:[{en:'No legitimate job ever requires advance payment',hi:'कोई वैध नौकरी अग्रिम भुगतान नहीं मांगती',mr:'कोणतीही वैध नोकरी आगाऊ पेमेंट मागत नाही'},{en:'Never pay via gift cards or crypto for services',hi:'गिफ्ट कार्ड से भुगतान न करें',mr:'गिफ्ट कार्डने पेमेंट करू नका'},{en:'Research offers on Google before trusting them',hi:'विश्वास करने से पहले Google पर जांच करें',mr:'विश्वास ठेवण्यापूर्वी Google वर तपासा'},{en:'Report scams to cybercrime.gov.in and dial 1930',hi:'cybercrime.gov.in पर रिपोर्ट करें',mr:'cybercrime.gov.in वर नोंदवा'}], icon:'🚨', readTime:3 },
];

// ─── SIMULATIONS ──────────────────────────────────────────────────────────────
const simulations = [
  { type:'phishing', title:{en:'🎣 Fake SBI Bank Email Attack',hi:'🎣 नकली SBI बैंक ईमेल हमला',mr:'🎣 बनावट SBI बँक ईमेल हल्ला'}, description:{en:'Experience a realistic phishing email targeting your SBI bank account.',hi:'SBI खाते को लक्षित फ़िशिंग ईमेल का अनुभव करें।',mr:'SBI खात्याला लक्ष्य करणाऱ्या फिशिंग ईमेलचा अनुभव घ्या.'}, difficulty:'beginner', steps:[{stepNumber:1,content:{en:'📧 EMAIL\n\nFrom: support@sbi-secure-alert.xyz\nSubject: URGENT: Your SBI Account Suspended!\n\n"Dear Customer,\nUnauthorised login detected. Click to verify now:\nhttp://sbi-secure-verify.xyz/login\n\nYou have 24 hours.\n— SBI Security Team"',hi:'ईमेल मिली।',mr:'ईमेल मिळाला.'},action:'What do you do?',result:{en:'🚨 RED FLAGS:\n1. Sender: sbi-secure-alert.xyz (NOT sbi.co.in)\n2. Urgency: "24 hours"\n3. Fake URL: sbi-secure-verify.xyz\n4. Generic greeting: "Dear Customer"',hi:'खतरे के संकेत।',mr:'धोक्याची चिन्हे.'},isCorrect:false,hint:{en:'✅ CORRECT: Open new tab → type onlinesbi.sbi.co.in directly.',hi:'सही: onlinesbi.sbi.co.in सीधे टाइप करें।',mr:'बरोबर: onlinesbi.sbi.co.in थेट टाइप करा.'}},{stepNumber:2,content:{en:'🖥️ FAKE LOGIN PAGE\n\nURL: http://sbi-secure-verify.xyz/login\nLooks identical to real SBI.\nAsks for: Username, Password, OTP.',hi:'नकली लॉगिन पेज।',mr:'बनावट लॉगिन पेज.'},action:'Do you enter credentials?',result:{en:'💀 COMPROMISED!\nCredentials sent to attacker in real time. Account balance transferred within 60 seconds.',hi:'खाता हैक हो गया!',mr:'खाते हॅक झाले!'},isCorrect:false,hint:{en:'HTTPS ≠ Safe. Always verify the full domain before entering credentials.',hi:'HTTPS सुरक्षित नहीं है! डोमेन जांचें।',mr:'HTTPS सुरक्षित नाही! डोमेन तपासा.'}},{stepNumber:3,content:{en:'✅ SAFE PATH\n1. Do NOT click email links\n2. New tab → type onlinesbi.sbi.co.in\n3. Call SBI: 1800-11-2211\n4. Report to report.phishing@sbi.co.in',hi:'सुरक्षित रास्ता।',mr:'सुरक्षित मार्ग.'},action:'Verify through official SBI website',result:{en:'🛡️ PROTECTED! You identified and avoided a sophisticated phishing attack.',hi:'आप सुरक्षित हैं!',mr:'तुम्ही सुरक्षित आहात!'},isCorrect:true,hint:{en:'Always type banking URLs directly. Bookmark them.',hi:'बैंकिंग URL हमेशा सीधे टाइप करें।',mr:'बँकिंग URL नेहमी थेट टाइप करा.'}}], lesson:{en:'Banks NEVER suspend accounts via email links. HTTPS does not guarantee legitimacy.',hi:'बैंक ईमेल लिंक से खाते निलंबित नहीं करते।',mr:'बँका ईमेल लिंकद्वारे खाती निलंबित करत नाहीत.'}},
  { type:'scam-call', title:{en:'📞 UPI Fraud Vishing Call',hi:'📞 UPI विशिंग कॉल',mr:'📞 UPI विशिंग कॉल'}, description:{en:'A fraudster calls pretending to be from your bank\'s UPI security team.',hi:'एक ठग बैंक से होने का नाटक करके कॉल करता है।',mr:'एक फसवणूकदार बँकेकडून असल्याचे भासवून कॉल करतो.'}, difficulty:'beginner', steps:[{stepNumber:1,content:{en:'📱 INCOMING CALL\n\n"I am Rajesh from HDFC Bank UPI Security. Suspicious transactions of ₹47,500 detected. To reverse them share:\n1. UPI PIN\n2. OTP you will receive\n3. Net banking password\n\n⚠️ 10 minutes or we cannot guarantee recovery."',hi:'कॉल आ रही है।',mr:'कॉल येत आहे.'},action:'What do you do?',result:{en:'💀 SCAMMED!\n4 RULES:\n1. No bank asks PIN via phone\n2. No bank asks OTP via phone\n3. No bank asks password via phone\n4. Urgency = manipulation',hi:'आप ठगे गए।',mr:'तुम्ही फसलात.'},isCorrect:false,hint:{en:'NEVER share PIN OTP or password on any call.',hi:'फोन पर PIN OTP कभी शेयर न करें।',mr:'फोनवर PIN OTP कधीही शेअर करू नका.'}},{stepNumber:2,content:{en:'✅ CORRECT RESPONSE\n1. Say: "I do not share financial info on incoming calls."\n2. HANG UP\n3. Open official bank app\n4. Check transactions yourself\n5. Call HDFC: 1800-202-6161\n6. Report fraud: 1930',hi:'सही प्रतिक्रिया।',mr:'योग्य प्रतिसाद.'},action:'Hang up and verify through official app',result:{en:'🛡️ PROTECTED!\n✓ Refused to share sensitive info\n✓ Verified through official app\n✓ Reported fraud to 1930',hi:'आप सुरक्षित हैं!',mr:'तुम्ही सुरक्षित आहात!'},isCorrect:true,hint:{en:'Hang up on suspicious calls. Call back only on official numbers.',hi:'संदिग्ध कॉल काटें।',mr:'संशयास्पद कॉल कट करा.'}}], lesson:{en:'No legitimate bank EVER asks for PIN OTP or password over the phone.',hi:'कोई वैध बैंक फोन पर PIN OTP नहीं मांगता।',mr:'कोणताही वैध बँक फोनवर PIN OTP मागत नाही.'}},
  { type:'social-engineering', title:{en:'🔑 Fake Bank Login Page Trap',hi:'🔑 नकली लॉगिन पेज का जाल',mr:'🔑 बनावट लॉगिन पेज सापळा'}, description:{en:'You search Google for your bank and land on a fake site identical to the real one.',hi:'आप Google पर बैंक खोजते हैं।',mr:'तुम्ही Google वर बँक शोधता.'}, difficulty:'intermediate', steps:[{stepNumber:1,content:{en:'🔍 GOOGLE SEARCH: "HDFC Bank Net Banking"\n\n[SPONSORED AD] hdfc-bank-netbanking-login.in\n"Secure Login | HDFC Bank Customer Portal"\n\n[Organic] hdfcbank.com\n\nYou click the sponsored ad.',hi:'गूगल खोज।',mr:'Google शोध.'},action:'You clicked the ad. Notice anything?',result:{en:'⚠️ FAKE SITE!\nURL: hdfc-bank-netbanking-login.in (NOT hdfcbank.com)\nHas HTTPS, same logo, same layout.\n🔴 Different domain\n🔴 Extra hyphens\n🔴 Different TLD',hi:'चेतावनी! नकली साइट।',mr:'इशारा! बनावट साइट.'},isCorrect:false,hint:{en:'NEVER click banking ads. Always TYPE the URL directly.',hi:'बैंकिंग विज्ञापन कभी न क्लिक करें।',mr:'बँकिंग जाहिराती कधीही क्लिक करू नका.'}},{stepNumber:2,content:{en:'✅ 5 RULES\n1. NEVER click bank ads in search results\n2. BOOKMARK your bank on first verified visit\n3. Always TYPE: hdfcbank.com\n4. Verify domain ends exactly in hdfcbank.com\n5. If entered credentials on wrong site → change password immediately',hi:'5 नियम।',mr:'5 नियम.'},action:'Type the official URL directly',result:{en:'🛡️ SECURED!\n✓ Typed hdfcbank.com directly\n✓ Verified complete domain\n✓ Bookmarked for future',hi:'पूरी तरह सुरक्षित!',mr:'पूर्णपणे सुरक्षित!'},isCorrect:true,hint:{en:'Bookmark all banking sites. Never use search ads for banking.',hi:'सभी बैंकिंग साइटें बुकमार्क करें।',mr:'सर्व बँकिंग साइट्स बुकमार्क करा.'}}], lesson:{en:'Search ads can be bought by fraudsters. HTTPS does not mean legitimate. Always type banking URLs directly.',hi:'सर्च विज्ञापन धोखेबाज खरीद सकते हैं।',mr:'सर्च जाहिराती फसवणूकदार खरेदी करू शकतात.'}},
  { type:'phishing', title:{en:'📱 QR Code Payment Scam',hi:'📱 QR कोड भुगतान घोटाला',mr:'📱 QR कोड पेमेंट घोटाळा'}, description:{en:'A buyer asks you to scan a QR code to receive advance payment for your OLX listing.',hi:'खरीदार QR कोड स्कैन करने को कहता है।',mr:'खरीदार QR कोड स्कॅन करण्यास सांगतो.'}, difficulty:'beginner', steps:[{stepNumber:1,content:{en:'📲 WHATSAPP:\n"I want your laptop. Sending ₹500 advance now.\n\nScan this QR code to RECEIVE:\n[📷 QR CODE]\n\nPlease scan quickly!"',hi:'WhatsApp संदेश।',mr:'WhatsApp संदेश.'},action:'You scan the QR code to receive ₹500. What happens?',result:{en:'💀 ₹500 DEBITED FROM YOU!\n\nQR code was a COLLECT REQUEST.\nScanning + PIN = YOU PAID.\n\nTo RECEIVE:\n✅ Share your UPI ID\n✅ Share your phone number\n❌ NEVER scan QR',hi:'आपके खाते से ₹500 कटे!',mr:'तुमच्या खात्यातून ₹500 कापले!'},isCorrect:false,hint:{en:'QR codes = you are PAYING. Share your UPI ID to receive.',hi:'QR कोड = आप भुगतान कर रहे हैं।',mr:'QR कोड = तुम्ही पेमेंट करत आहात.'}},{stepNumber:2,content:{en:'✅ CORRECT\n"Send to my UPI ID: myname@okhdfcbank"\nOR share your phone number.\n\nWait for payment notification.\nCheck your UPI app to confirm.\n\n❌ Never scan QR to receive\n❌ Never enter PIN to receive',hi:'सही प्रतिक्रिया।',mr:'योग्य प्रतिसाद.'},action:'Share your UPI ID for direct payment',result:{en:'🛡️ SAFE!\nRECEIVE = Share UPI ID\nPAY = Scan QR code\nThese are NEVER interchangeable.',hi:'लेनदेन सुरक्षित!',mr:'व्यवहार सुरक्षित!'},isCorrect:true,hint:{en:'Absolute rule: Share UPI ID to receive. Scan QR to pay.',hi:'UPI ID शेयर करें प्राप्त करने के लिए।',mr:'UPI ID शेअर करा मिळवण्यासाठी.'}}], lesson:{en:'Scanning QR ALWAYS means paying. Share your UPI ID or phone number to receive money.',hi:'QR स्कैन = भुगतान। प्राप्त करने के लिए UPI ID शेयर करें।',mr:'QR स्कॅन = पेमेंट. मिळवण्यासाठी UPI ID शेअर करा.'}},
  { type:'social-engineering', title:{en:'💼 Fake Job Offer Scam',hi:'💼 नकली नौकरी ऑफर घोटाला',mr:'💼 बनावट नोकरी ऑफर घोटाळा'}, description:{en:'A high-paying WFH job offer from a top company — navigate this employment scam.',hi:'शीर्ष कंपनी से उच्च वेतन का WFH जॉब ऑफर।',mr:'शीर्ष कंपनीकडून उच्च पगाराची WFH नोकरी.'}, difficulty:'intermediate', steps:[{stepNumber:1,content:{en:'📧 EMAIL:\n\nFrom: hr@infosys-careers-india.com\n"Infosys shortlisted you!\nRole: Data Entry (WFH)\nSalary: ₹55,000/month\nHours: 2-3 hrs/day\n\nConfirm by paying:\n• Registration: ₹3,500\n• Training: ₹1,500\n• Submit Aadhaar copy\n\n⚠️ Offer expires in 24 hours!"',hi:'ईमेल मिली।',mr:'ईमेल मिळाला.'},action:'This seems amazing! What do you do?',result:{en:'🚨 5 RED FLAGS:\n1. Infosys NEVER charges fees\n2. ₹55k/month for 2-3 hrs = unrealistic\n3. Urgency: "24 hours"\n4. Sender: infosys-careers-india.com (NOT infosys.com)\n5. Aadhaar via email = identity theft',hi:'लाल झंडे!',mr:'लाल ध्वज!'},isCorrect:false,hint:{en:'No legitimate employer charges fees to hire you.',hi:'कोई वैध नियोक्ता शुल्क नहीं लेता।',mr:'कोणताही वैध नियोक्ता शुल्क आकारत नाही.'}},{stepNumber:2,content:{en:'✅ VERIFY:\n1. Go to infosys.com/careers directly\n2. Check if role exists there\n3. Verify sender: must be @infosys.com\n4. Google: "Infosys WFH job scam"\n5. Call official HR only\n\nRules:\n✓ No job = advance payment\n✓ All interviews before any offer',hi:'सत्यापन करें।',mr:'सत्यापन करा.'},action:'Verify through Infosys official website',result:{en:'🛡️ SCAM AVOIDED!\n✓ No such role on infosys.com\n✓ Domain mismatch confirmed\n✓ Saved ₹5,000 in fees\n✓ Protected Aadhaar identity',hi:'घोटाला टाला!',mr:'घोटाळा टाळला!'},isCorrect:true,hint:{en:'Always verify job offers on the company\'s official website.',hi:'आधिकारिक वेबसाइट से जॉब ऑफर सत्यापित करें।',mr:'अधिकृत वेबसाइटवरून नोकरी ऑफर सत्यापित करा.'}}], lesson:{en:'No legitimate employer charges registration or training fees. Verify all job offers through the company\'s official website only.',hi:'कोई वैध नियोक्ता शुल्क नहीं लेता।',mr:'कोणताही वैध नियोक्ता शुल्क आकारत नाही.'}},
];

// ─── SEED ─────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    await Promise.all([
      User.deleteMany({}),
      Question.deleteMany({}),
      Article.deleteMany({}),
      Simulation.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    await User.create([
      { username:'admin',     email:'admin@cyberninja.com', password:'Admin@123', role:'admin', level:'expert' },
      { username:'demo_user', email:'demo@cyberninja.com',  password:'Demo@123', role:'user',  level:'beginner', totalScore:150, quizzesTaken:5, accuracy:72 },
    ]);
    console.log('✅ Users created');

    const inserted = await Question.insertMany(questions);

    // Distribution summary
    const stats = {};
    inserted.forEach(q => {
      if (!stats[q.category]) stats[q.category] = { beginner:0, intermediate:0, expert:0, answerDist:{0:0,1:0,2:0,3:0} };
      stats[q.category][q.level]++;
      stats[q.category].answerDist[q.correctAnswer]++;
    });

    console.log(`\n✅ Seeded ${inserted.length} questions:\n`);
    console.log('Category             | Easy | Med | Hard | A | B | C | D');
    console.log('─────────────────────────────────────────────────────────');
    Object.entries(stats).forEach(([cat, s]) => {
      const d = s.answerDist;
      console.log(`${cat.padEnd(21)}| ${String(s.beginner).padStart(4)} | ${String(s.intermediate).padStart(3)} | ${String(s.expert).padStart(4)} | ${d[0]}|${d[1]}|${d[2]}|${d[3]}`);
    });

    // Overall answer distribution
    const overall = {0:0,1:0,2:0,3:0};
    inserted.forEach(q => overall[q.correctAnswer]++);
    console.log(`\n📊 Overall answer distribution: A=${overall[0]} B=${overall[1]} C=${overall[2]} D=${overall[3]}`);

    await Article.insertMany(articles);
    await Simulation.insertMany(simulations);
    console.log(`\n✅ Seeded ${articles.length} articles`);
    console.log(`✅ Seeded ${simulations.length} simulations`);
    console.log('\n🔑 Credentials:');
    console.log('   Admin: admin@cyberninja.com / Admin@123');
    console.log('   Demo:  demo@cyberninja.com  / Demo@123\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();