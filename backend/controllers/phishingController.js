exports.analyzeURL = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ message: 'URL is required' });
    }
    const results = analyzeURL(url.trim());
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Helper: extract hostname safely ────────────────────────────────────────
function getHostname(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function getPathAndQuery(url) {
  try {
    const u = new URL(url);
    return (u.pathname + u.search + u.hash).toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

// ─── Main analysis function ──────────────────────────────────────────────────
function analyzeURL(url) {
  const warnings = [];
  const safe     = [];
  let   score    = 0;

  const urlLower  = url.toLowerCase();
  const hostname  = getHostname(url);
  const pathQuery = getPathAndQuery(url);

  // ── Invalid URL ────────────────────────────────────────────────────────────
  if (!hostname) {
    return {
      url, status: 'DANGEROUS', color: 'red', riskScore: 100,
      warnings: ['🚨 Invalid or malformed URL — cannot be parsed'],
      safe: [],
      advice: 'This is not a valid URL. Do not attempt to visit it.',
      details: [{ rule: 'URL Format', result: 'FAIL', explanation: 'The URL could not be parsed. It may be malformed or use an unsupported protocol.' }]
    };
  }

  const details = []; // For detailed explanation panel

  // ── CHECK 1: HTTPS ────────────────────────────────────────────────────────
  if (url.startsWith('https://')) {
    safe.push('✅ Uses HTTPS encryption');
    details.push({
      rule: 'HTTPS Check',
      result: 'PASS',
      explanation: 'The URL uses HTTPS, meaning traffic between your browser and the server is encrypted. Note: HTTPS alone does NOT confirm the site is legitimate — phishing sites also use HTTPS.'
    });
  } else if (url.startsWith('http://')) {
    warnings.push('🚨 Uses plain HTTP — your data is NOT encrypted in transit');
    score += 30;
    details.push({
      rule: 'HTTPS Check',
      result: 'FAIL',
      explanation: 'Plain HTTP transmits data in clear text. Anyone on the same network can intercept passwords, form data and personal information you submit.'
    });
  } else {
    warnings.push('🚨 Unknown or non-standard protocol detected');
    score += 25;
    details.push({
      rule: 'HTTPS Check',
      result: 'WARN',
      explanation: 'The URL uses an unusual protocol. Standard websites use https:// or http://'
    });
  }

  // ── CHECK 2: IP address as host ───────────────────────────────────────────
  const ipv4Pattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  const isIPHost    = ipv4Pattern.test(hostname);

  if (isIPHost) {
    warnings.push('🚨 IP address used instead of domain name — websites rarely use raw IPs legitimately');
    score += 40;
    details.push({
      rule: 'IP Address Host',
      result: 'FAIL',
      explanation: 'Legitimate websites use domain names (e.g., sbi.co.in), not raw IP addresses. Phishing sites and malware command-and-control servers commonly use IP addresses to avoid domain registration.'
    });
  } else {
    safe.push('✅ Uses a proper domain name (not a raw IP address)');
    details.push({
      rule: 'IP Address Host',
      result: 'PASS',
      explanation: 'The URL uses a domain name rather than a raw IP address, which is consistent with legitimate websites.'
    });
  }

  // ── CHECK 3: @ symbol in URL ──────────────────────────────────────────────
  // Only check the part AFTER the protocol — not inside the protocol string
  const urlWithoutProtocol = url.replace(/^https?:\/\//i, '');
  if (urlWithoutProtocol.includes('@')) {
    warnings.push('🚨 "@" symbol in URL — everything before @ is ignored by the browser, used to disguise real destination');
    score += 35;
    details.push({
      rule: '@ Symbol',
      result: 'FAIL',
      explanation: 'When a URL contains @, browsers treat the part before @ as credentials and ignore it. Attackers use this trick: "https://secure-bank.com@evil.com" actually goes to evil.com. This is almost always malicious.'
    });
  } else {
    safe.push('✅ No deceptive "@" symbol in URL');
    details.push({
      rule: '@ Symbol',
      result: 'PASS',
      explanation: 'No @ symbol found. Legitimate URLs do not use @ in the domain portion.'
    });
  }

  // ── CHECK 4: Double slash redirect trick ──────────────────────────────────
  // Strip the protocol (https:// or http://) first, then check for //
  const urlAfterProtocol = url.replace(/^https?:\/\//i, '');
  if (urlAfterProtocol.includes('//')) {
    warnings.push('⚠️ Extra "//" found after domain — possible redirect or URL injection trick');
    score += 20;
    details.push({
      rule: 'Double Slash',
      result: 'WARN',
      explanation: 'A double slash (//) after the protocol and domain can sometimes be used in redirect tricks or URL injection attacks. Legitimate URLs typically use single slashes in their paths.'
    });
  } else {
    details.push({
      rule: 'Double Slash',
      result: 'PASS',
      explanation: 'No suspicious double slashes detected after the domain.'
    });
  }

  // ── CHECK 5: Suspicious TLDs ──────────────────────────────────────────────
  const badTLDs = ['.xyz', '.tk', '.ml', '.ga', '.cf', '.gq', '.click', '.download',
                   '.loan', '.work', '.gdn', '.rest', '.top', '.pw', '.cc'];
  const matchedTLD = badTLDs.find(tld => hostname.endsWith(tld));
  if (matchedTLD) {
    warnings.push(`🚨 Suspicious top-level domain "${matchedTLD}" — commonly used in free/throwaway phishing domains`);
    score += 25;
    details.push({
      rule: 'Suspicious TLD',
      result: 'FAIL',
      explanation: `The domain ends in "${matchedTLD}" which is frequently abused by attackers because these domains are free or very cheap to register. Established companies use well-known TLDs like .com, .in, .org, .gov, etc.`
    });
  } else {
    safe.push('✅ Domain uses a standard, reputable TLD');
    details.push({
      rule: 'Suspicious TLD',
      result: 'PASS',
      explanation: 'The domain extension appears normal and is not on the list of commonly abused free TLDs.'
    });
  }

  // ── CHECK 6: Too many hyphens in domain ───────────────────────────────────
  // Only count hyphens in the registered domain part, not subdomains
  const domainParts = hostname.split('.');
  const hyphensInDomain = (hostname.match(/-/g) || []).length;

  if (hyphensInDomain >= 4) {
    warnings.push(`🚨 Domain contains ${hyphensInDomain} hyphens — highly suspicious (e.g., "secure-login-verify-bank.com")`);
    score += 30;
    details.push({
      rule: 'Excessive Hyphens',
      result: 'FAIL',
      explanation: `The domain has ${hyphensInDomain} hyphens. Phishing domains frequently use many hyphens to impersonate legitimate sites (e.g., "sbi-net-banking-secure-login.xyz"). Legitimate domains rarely need more than one or two hyphens.`
    });
  } else if (hyphensInDomain >= 2) {
    warnings.push(`⚠️ Domain contains ${hyphensInDomain} hyphens — slightly suspicious, verify carefully`);
    score += 12;
    details.push({
      rule: 'Excessive Hyphens',
      result: 'WARN',
      explanation: `The domain has ${hyphensInDomain} hyphens. While some legitimate domains use hyphens, multiple hyphens combined with other factors can indicate a phishing attempt.`
    });
  } else {
    safe.push('✅ Domain has normal hyphen usage');
    details.push({
      rule: 'Excessive Hyphens',
      result: 'PASS',
      explanation: 'The domain uses hyphens normally (0–1), consistent with legitimate websites.'
    });
  }

  // ── CHECK 7: Excessive subdomains ─────────────────────────────────────────
  // e.g., secure.login.verify.sbi.in — 4+ parts
  if (domainParts.length >= 5) {
    warnings.push(`⚠️ Excessive subdomains (${domainParts.length - 2} levels) — often used to hide the real domain at the end`);
    score += 20;
    details.push({
      rule: 'Excessive Subdomains',
      result: 'WARN',
      explanation: `The URL has ${domainParts.length - 2} subdomain levels. Phishing URLs use deep subdomains to make the trusted-looking part appear at the start: "paypal.com.secure.verify.evil.xyz" — the real domain is evil.xyz.`
    });
  } else if (domainParts.length === 4) {
    details.push({
      rule: 'Excessive Subdomains',
      result: 'PASS',
      explanation: 'Subdomain depth is moderate (one subdomain level), which is normal for services like "net.bankname.com" or regional subdomains like "in.sitename.com".'
    });
  } else {
    safe.push('✅ Normal subdomain depth');
    details.push({
      rule: 'Excessive Subdomains',
      result: 'PASS',
      explanation: 'The URL has a simple, clean domain structure with no excessive subdomain nesting.'
    });
  }

  // ── CHECK 8: URL total length ─────────────────────────────────────────────
  if (url.length > 100) {
    warnings.push(`⚠️ Very long URL (${url.length} characters) — legitimate URLs are usually under 75 characters`);
    score += 15;
    details.push({
      rule: 'URL Length',
      result: 'WARN',
      explanation: `This URL is ${url.length} characters long. Very long URLs are sometimes used to hide the real destination, bury suspicious parameters, or overwhelm users into not reading the full address. Legitimate banking and shopping URLs are typically under 75 characters.`
    });
  } else if (url.length > 75) {
    score += 6;
    details.push({
      rule: 'URL Length',
      result: 'WARN',
      explanation: `URL is ${url.length} characters — slightly above average but not necessarily suspicious on its own.`
    });
  } else {
    safe.push(`✅ URL length is normal (${url.length} characters)`);
    details.push({
      rule: 'URL Length',
      result: 'PASS',
      explanation: `The URL is ${url.length} characters long, which is within the typical range for legitimate websites.`
    });
  }

  // ── CHECK 9: Suspicious keywords ─────────────────────────────────────────
  // Check full URL (hostname + path) but exclude the protocol
  const fullCheckTarget = urlLower.replace(/^https?:\/\//, '');

  const suspiciousKeywords = [
    { word: 'verify',    score: 12, reason: 'used in fake identity verification scams' },
    { word: 'login',     score: 10, reason: 'commonly mimicked in credential-harvesting pages' },
    { word: 'secure',    score: 8,  reason: 'used to create false sense of safety in phishing URLs' },
    { word: 'account',   score: 8,  reason: 'appears in account takeover phishing URLs' },
    { word: 'update',    score: 8,  reason: 'used in fake "update your account" phishing campaigns' },
    { word: 'confirm',   score: 8,  reason: 'used in confirmation-phishing URLs' },
    { word: 'banking',   score: 10, reason: 'often injected into fake bank login pages' },
    { word: 'signin',    score: 10, reason: 'used in fake sign-in page phishing' },
    { word: 'password',  score: 12, reason: 'rarely appears in legitimate URLs — red flag' },
    { word: 'urgent',    score: 15, reason: 'manufactured urgency is a hallmark of phishing' },
    { word: 'suspended', score: 15, reason: 'fake account suspension notices are classic phishing' },
    { word: 'winner',    score: 18, reason: 'used in lottery and prize scam URLs' },
    { word: 'prize',     score: 18, reason: 'appears in fake prize claim phishing pages' },
    { word: 'free',      score: 8,  reason: 'common in scam and adware URLs' },
    { word: 'lucky',     score: 15, reason: 'used in lottery scam pages' },
    { word: 'claim',     score: 12, reason: 'used in fake prize and insurance claim phishing' },
    { word: 'upi',       score: 12, reason: 'fake UPI payment and fraud sites use this keyword' },
    { word: 'paytm',     score: 10, reason: 'brand impersonation of Paytm payment service' },
    { word: 'ebay',      score: 10, reason: 'brand impersonation phishing' },
    { word: 'amazon',    score: 10, reason: 'brand impersonation phishing' },
    { word: 'paypal',    score: 10, reason: 'PayPal is the most impersonated brand in phishing' },
    { word: 'apple',     score: 10, reason: 'Apple ID phishing is extremely common' },
    { word: 'microsoft', score: 10, reason: 'Microsoft impersonation used in tech support scams' },
  ];

  // Only flag keywords that appear in path/query (not in legitimate domain names)
  // For brand names, also check if they appear in wrong context
  const foundKeywords = [];
  suspiciousKeywords.forEach(kw => {
    // For generic keywords (verify, login, etc.), check full URL excluding protocol
    if (fullCheckTarget.includes(kw.word)) {
      // Exception: if the keyword IS part of a legitimate known domain, skip it
      // e.g., "login" in "login.microsoftonline.com" or "accounts.google.com"
      const legitimateDomains = [
        'google.com', 'microsoft.com', 'microsoftonline.com', 'apple.com',
        'amazon.com', 'paypal.com', 'paytm.com', 'facebook.com', 'instagram.com',
        'twitter.com', 'linkedin.com', 'github.com', 'stackoverflow.com',
        'sbi.co.in', 'hdfcbank.com', 'icicibank.com', 'axisbank.com',
        'npci.org.in', 'upi.org', 'ebay.com', 'flipkart.com',
        'youtube.com', 'netflix.com', 'spotify.com', 'wikipedia.org',
        'reddit.com', 'pinterest.com', 'zoom.us', 'dropbox.com',
      ];
      const isKnownDomain = legitimateDomains.some(domain => hostname.endsWith(domain));

      // For brand keywords in legitimate domain context, skip
      const brandKeywords = ['paypal', 'paytm', 'amazon', 'ebay', 'apple', 'microsoft', 'upi'];
      if (isKnownDomain && brandKeywords.includes(kw.word)) return;

      // For generic phishing keywords on any domain, flag them
      // But reduce score impact on known domains
      const adjustedScore = isKnownDomain ? Math.floor(kw.score * 0.3) : kw.score;
      if (adjustedScore > 0) {
        foundKeywords.push({ ...kw, adjustedScore });
      }
    }
  });

  if (foundKeywords.length > 0) {
    // Cap keyword score contribution
    const keywordScore = Math.min(foundKeywords.reduce((s, k) => s + k.adjustedScore, 0), 35);
    score += keywordScore;
    const kwList = foundKeywords.map(k => k.word).join(', ');
    warnings.push(`⚠️ Suspicious keywords in URL: "${kwList}" — often appear in phishing and scam pages`);
    details.push({
      rule: 'Suspicious Keywords',
      result: foundKeywords.length >= 3 ? 'FAIL' : 'WARN',
      explanation: foundKeywords.map(k => `"${k.word}": ${k.reason}`).join(' | ')
    });
  } else {
    safe.push('✅ No suspicious phishing keywords detected in URL');
    details.push({
      rule: 'Suspicious Keywords',
      result: 'PASS',
      explanation: 'No high-risk keywords associated with phishing or scam pages were found in this URL.'
    });
  }

  // ── CHECK 10: Brand impersonation (typosquatting) ─────────────────────────
  const brands = [
    { name: 'google',    legit: 'google.com' },
    { name: 'facebook',  legit: 'facebook.com' },
    { name: 'amazon',    legit: 'amazon.com' },
    { name: 'microsoft', legit: 'microsoft.com' },
    { name: 'apple',     legit: 'apple.com' },
    { name: 'paypal',    legit: 'paypal.com' },
    { name: 'paytm',     legit: 'paytm.com' },
    { name: 'sbi',       legit: 'sbi.co.in' },
    { name: 'hdfc',      legit: 'hdfcbank.com' },
    { name: 'icici',     legit: 'icicibank.com' },
    { name: 'npci',      legit: 'npci.org.in' },
    { name: 'ebay',      legit: 'ebay.com' },
    { name: 'netflix',   legit: 'netflix.com' },
    { name: 'instagram', legit: 'instagram.com' },
    { name: 'twitter',   legit: 'twitter.com' },
    { name: 'linkedin',  legit: 'linkedin.com' },
  ];

  const impersonated = brands.filter(b => {
    // Brand name appears in hostname BUT hostname is NOT the legitimate domain
    return hostname.includes(b.name) && !hostname.endsWith(b.legit);
  });

  if (impersonated.length > 0) {
    impersonated.forEach(b => {
      warnings.push(`🚨 Possible "${b.name}" brand impersonation — real domain is ${b.legit}, this is ${hostname}`);
      score += 40;
    });
    details.push({
      rule: 'Brand Impersonation',
      result: 'FAIL',
      explanation: `This URL contains brand name(s) (${impersonated.map(b => b.name).join(', ')}) but is NOT hosted on the official domain. This is a classic typosquatting / phishing technique where attackers register domains like "paypal-secure.com" to fool victims.`
    });
  } else {
    safe.push('✅ No brand impersonation detected');
    details.push({
      rule: 'Brand Impersonation',
      result: 'PASS',
      explanation: 'No well-known brand names were found in a suspicious context in this URL.'
    });
  }

  // ── CHECK 11: Known legitimate domains whitelist ───────────────────────────
  const trustedDomains = [
    'google.com', 'youtube.com', 'gmail.com', 'googleapis.com',
    'microsoft.com', 'microsoftonline.com', 'office.com', 'live.com', 'outlook.com',
    'apple.com', 'icloud.com',
    'amazon.com', 'amazonaws.com',
    'facebook.com', 'instagram.com', 'whatsapp.com',
    'twitter.com', 'x.com', 'linkedin.com',
    'github.com', 'stackoverflow.com', 'wikipedia.org',
    'netflix.com', 'spotify.com', 'zoom.us', 'dropbox.com',
    'paypal.com', 'paytm.com', 'phonepe.com', 'gpay.app',
    'sbi.co.in', 'onlinesbi.sbi.co.in', 'hdfcbank.com', 'icicibank.com',
    'axisbank.com', 'kotak.com', 'rbi.org.in', 'npci.org.in',
    'irctc.co.in', 'incometax.gov.in', 'uidai.gov.in', 'mca.gov.in',
    'digilocker.gov.in', 'cowin.gov.in',
    'flipkart.com', 'meesho.com', 'myntra.com', 'nykaa.com',
    'swiggy.com', 'zomato.com', 'ola.com', 'uber.com',
    'pinterest.com', 'reddit.com', 'quora.com', 'medium.com',
    'yahoo.com', 'bing.com', 'duckduckgo.com',
  ];
  const isTrusted = trustedDomains.some(d => hostname === d || hostname.endsWith('.' + d));

  if (isTrusted) {
    safe.push('✅ Domain is a well-known, trusted website');
    // Reduce score by half if on trusted domain (other checks may have added some)
    score = Math.floor(score * 0.3);
    details.push({
      rule: 'Trusted Domain',
      result: 'PASS',
      explanation: `"${hostname}" is a widely recognised and trusted domain. While this does not guarantee safety (accounts can be phished, sub-pages can be malicious), the base domain itself has a strong trust reputation.`
    });
  }

  // ── Finalise score ────────────────────────────────────────────────────────
  const finalScore = Math.min(Math.max(Math.round(score), 0), 100);

  let status, color, advice;

  if (finalScore <= 15) {
    status = 'SAFE';
    color  = 'green';
    advice = 'This URL appears safe based on our checks. Always stay alert — verify the full domain before entering personal information.';
  } else if (finalScore <= 45) {
    status = 'SUSPICIOUS';
    color  = 'yellow';
    advice = 'Proceed with caution. One or more checks raised concerns. Verify the website independently before entering any personal information, passwords, or payment details.';
  } else {
    status = 'DANGEROUS';
    color  = 'red';
    advice = 'Do NOT visit or interact with this URL. It shows multiple strong indicators of a phishing or malicious website. Report it to cybercrime.gov.in if received via email or message.';
  }

  return {
    url,
    status,
    color,
    riskScore: finalScore,
    warnings,
    safe,
    advice,
    details,
    hostname,
  };
}