---
title: SolarWinds and the Vulnerability of Digital States
subtitle: Espionage, technological dependencies and governments’ freedom of action, from the 2020 intrusion to the crises of 2026.
category: Essays
excerpt: SolarWinds shows how a compromised supplier can expose institutions to espionage. From state responses to European rules, this essay examines the role of technological research and education in protecting public services.
---

# The damage to institutions

An intrusion into a government’s communications can expose information about diplomatic decisions, investigations and national security to a foreign power. Prolonged access allows an adversary to reconstruct intentions and learn assessments that remain confidential; even after discovery, the information obtained remains in its possession. SolarWinds showed how such exposure could begin with an update received from a company entrusted with part of an administration’s network management.

Orion, the program involved, helped technicians monitor devices and connections. Between March and June 2020, some updates were distributed with a clandestine component inserted during software production. FireEye disclosed the discovery on 13 December after tracing Orion’s role in an intrusion into its own systems. Customers had received the altered program through the manufacturer’s official channel. Because the alteration preceded delivery, checks on its origin could succeed even for a compromised update. Security therefore depended on the supplier’s production process, over which public administrations exercised limited control.

SolarWinds reported up to approximately 18,000 potentially exposed customers, later clarifying that the count included updates downloaded but never installed. In March 2021, the FBI reported activity beyond the initial access in nine federal agencies and fewer than one hundred non-government organisations. The figures described different phenomena: distribution had created numerous opportunities for entry, from which operators had selected environments to explore further.

In April 2021, the United States and the United Kingdom attributed the operation to Russia’s foreign intelligence service, the SVR. Target selection was consistent with espionage, whose value depends on the information within reach and the ability to consult it undetected. After installation, the clandestine component could wait several days before activating; the attackers then sought credentials and permissions to reach other resources while offices continued working.

The US Department of Justice reported compromised employee accounts in 27 US Attorneys’ Offices, identifying a period of possible access between May and December 2020 and treating messages and attachments as exposed. Investigators needed to establish which information had been reached and what precautions were necessary. Removing Orion could leave later access routes usable: recovery therefore required reconstructing the intruders’ activities as well as assessing the consequences of possible access to correspondence.

# The political response and private dependencies

On 15 April 2021, Washington announced the expulsion of ten officials from the Russian mission, while the Treasury introduced sovereign debt restrictions and sanctions against companies supporting Moscow’s intelligence services. The package addressed SolarWinds alongside other activities attributed to Russia, including election interference. The United States sought to raise the cost of those activities through economic interests and diplomatic relations over which it could exert pressure.

The domestic response depended on knowledge distributed among public administrations, producers and security companies. In its 2022 report, the Government Accountability Office documented difficulties in information sharing and in the availability of records needed to reconstruct access. The public responsibility to protect institutions therefore required cooperation from companies holding some of the evidence and expertise essential to investigations. Where records were missing, investigators had to seek other evidence, adding time and uncertainty to the task of establishing which resources had been reached.

Buying technology provides capabilities that would be costly to develop independently, but ties offices to the conditions under which suppliers protect their tools. During a crisis, governments must be able to assess proposed interventions and decide which activities to maintain, particularly when a service is difficult to replace. The producer’s nationality offers insufficient guidance: SolarWinds was an American company supplying American administrations, while the operation was attributed to a foreign service.

International distribution extends these dependencies across borders. In expressing solidarity with the United States on 15 April 2021, the European Union recalled that SolarWinds had affected governments and businesses worldwide, including entities in Member States. The same update could expose organisations subject to different authorities, making cooperation necessary among those investigating the local consequences of a shared compromise.

# From suppliers to services

Some incidents in 2026 again raised the problem of access entrusted to external organisations. In October, OVHcloud reported that a compromised account had enabled the replacement of official files for an administration tool: for approximately ninety minutes, certain versions could deliver programs designed to steal credentials and data. The company confined the incident to the distributed files, through which users received altered material from their usual supply channel.

That same month, Microsoft described the abuse of ConnectWise applications already authorised by customers, attributing the campaign to Storm-0940, a group it considers aligned with the Chinese state. According to the analysis, attackers sought to use those permissions to enter customer environments. The comparison with SolarWinds concerns the abuse of an approved relationship; the attribution remains specific to the campaign described by Microsoft.

When access reaches equipment controls, the consequences can affect the physical operation of services. On 4 November 2026, the European Commission and ENISA confirmed incidents involving commercial refrigeration systems in several Member States. French authorities called for checks on settings and protection of remotely accessible controls: altering them could compromise temperatures required to preserve goods. Attribution remained open, while measures to protect the equipment had to be decided within the time imposed by the incident.

# European rules and defensive capabilities

The European Union has addressed these dependencies through obligations on organisations and suppliers. The NIS2 Directive covers technology supply chain security and business continuity; in finance, DORA, applicable since January 2025, provides for oversight of technology suppliers designated as critical. The concentration of customers among a small number of companies requires assessment of consequences that may affect several organisations together, generating simultaneous demands for assistance and making rapid replacement difficult. Each customer also depends on the supplier’s ability to manage other customers’ crises; understanding how supplies are distributed helps authorities identify activities that could be affected at the same time.

Timely information helps organise the response. Since September 2026, the Cyber Resilience Act has required reporting of actively exploited vulnerabilities and severe incidents affecting product security; most obligations will apply from December 2027. These provisions define responsibilities and allow authorities to hold organisations accountable for their measures, while implementation requires people able to understand reports and assess interventions.

Those preparing an intrusion may already have accepted that they will break the law. The ability to stop them also depends on the difficulties they encounter in systems and on defenders’ capacity to detect them. Sustained investment in technological research is therefore needed so that universities, research centres and companies can study vulnerabilities, test protections and assess their effectiveness. Continuing funding makes it possible to address unresolved problems and develop knowledge that emergency purchasing can rarely provide.

Education must make that knowledge usable. A sound grounding in mathematics and computer science, combined with practical experience and the study of incidents, enables people to understand systems even as commercial products change. Organisational decision-makers also need to understand the dependencies that determine costs and the scope for action. For the state, training qualified staff and retaining them in public administrations means being able to question suppliers’ choices and assess security independently. Continuing relationships with researchers and opportunities for professional development help maintain that ability, preventing expertise from remaining confined to familiar technologies.

Laws establish obligations and responsibilities; addressing new attacks and previously unknown flaws requires research capabilities and expertise that develop over time. If investment ends with compliance, defenders remain dependent on available solutions while adversaries search for their limits. Funding experimentation and education allows institutions to develop their own means of protecting information and maintaining services when the conditions underpinning their security break down.

# Sources and documents

- SolarWinds / SEC — [Form 8-K on the Orion compromise](https://www.sec.gov/Archives/edgar/data/1739942/000162828020017451/swi-20201214.htm).
- FireEye / Mandiant — [Highly Evasive Attacker Leverages SolarWinds Supply Chain…](https://cloud.google.com/blog/topics/threat-intelligence/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor).
- SolarWinds / SEC — [An Investigative Update of the Cyberattack](https://www.sec.gov/Archives/edgar/data/1739942/000173994221000076/swi-20210507.htm).
- FBI — [Understanding and Responding to the SolarWinds Supply Chain Attack](https://www.fbi.gov/news/speeches-and-testimony/understanding-and-responding-to-the-solar-winds-supply-chain-attack-the-federal-perspective).
- Microsoft Threat Intelligence — [Using Microsoft 365 Defender to protect against Solorigate](https://www.microsoft.com/en-us/security/blog/2020/12/28/using-microsoft-365-defender-to-coordinate-protection-against-solorigate/).
- US Department of Justice — [Statement on the intrusion into the Department’s Microsoft O365 email environment](https://www.justice.gov/opcl/department-justice-statement-intrusion-department-s-microsoft-o365-email-environment).
- UK NCSC — [UK and US call out Russia for SolarWinds compromise](https://www.ncsc.gov.uk/news/uk-and-us-call-out-russia-for-solarwinds-compromise).
- US Department of State — [Holding Russia To Account](https://2021-2025.state.gov/holding-russia-to-account/).
- US Department of the Treasury — [Treasury Sanctions Russia with Sweeping New Sanctions Authority](https://home.treasury.gov/news/press-releases/jy0127).
- Council of the European Union — [Declaration … expressing solidarity with the United States on the impact of the SolarWinds cyber operation](https://www.consilium.europa.eu/en/press/press-releases/2021/04/15/declaration-by-the-high-representative-on-behalf-of-the-european-union-expressing-solidarity-with-the-united-states-on-the-impact-of-the-solarwinds-cyber-operation/).
- Government Accountability Office — [Cybersecurity: Federal Response to SolarWinds and Microsoft Exchange Incidents — GAO-22-104746](https://www.gao.gov/products/gao-22-104746).
- OVHcloud — [ovhcloud-cli security incident — GHSA-862f-55f5-vmvw](https://github.com/ovh/ovhcloud-cli/security/advisories/GHSA-862f-55f5-vmvw).
- Microsoft Threat Intelligence — [AI-driven, large-scale nation-state campaign using ARTEX enables supply chain compromise](https://www.microsoft.com/en-us/security/blog/2026/10/21/storm-0940-uses-artex-agentic-ai-connectwise-supply-chain-compromise/).
- European Commission / ENISA — [Joint statement on cyber incidents in refrigeration systems across the EU](https://www.enisa.europa.eu/news/joint-statement-on-cyber-incidents-in-refrigeration-systems-across-the-eu).
- ANSSI / CERT-FR — [Incident de sécurité ciblant les contrôleurs à distance des installations de réfrigération — CERTFR-2026-ALE-012](https://cert.cyber.gouv.fr/alerte/CERTFR-2026-ALE-012/).
- European Union / EUR-Lex — [Directive (EU) 2022/2555 — NIS2, Article 21](https://eur-lex.europa.eu/eli/dir/2022/2555/oj/eng).
- ESMA — [Digital Operational Resilience Act — DORA](https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/digital-operational-resilience-act-dora).
- European Commission — [Safer and more secure digital products](https://commission.europa.eu/news-and-media/news/safer-and-more-secure-digital-products-2026-09-11_en).
