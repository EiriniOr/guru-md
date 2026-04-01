-- Seed learning paths
insert into learning_paths (slug, title, description, icon, specialty, order_index) values
(
  'cardiology',
  'Cardiology',
  'Heart anatomy, electrophysiology, common cardiac conditions, ECG interpretation, and EU clinical guidelines for cardiovascular disease.',
  '❤️',
  'Internal Medicine',
  1
),
(
  'pharmacology',
  'Pharmacology',
  'Drug mechanisms, pharmacokinetics, pharmacodynamics, Swedish FASS drug database, and EU drug approval regulations.',
  '💊',
  'Pharmacology',
  2
),
(
  'anatomy',
  'Anatomy',
  'Systematic human anatomy covering musculoskeletal, nervous, and visceral systems with clinical correlations.',
  '🦴',
  'Basic Sciences',
  3
);

-- Cardiology modules
insert into modules (path_id, title, description, content_md, order_index)
select
  lp.id,
  m.title,
  m.description,
  m.content_md,
  m.order_index
from learning_paths lp
cross join (values
  (
    'Cardiac Anatomy',
    'Structure of the heart: chambers, valves, great vessels, and coronary circulation.',
    E'## Cardiac Anatomy\n\nThe heart is a four-chambered muscular organ located in the **mediastinum**.\n\n### Chambers\n- **Right atrium** → receives deoxygenated blood from systemic circulation\n- **Right ventricle** → pumps to pulmonary circulation\n- **Left atrium** → receives oxygenated blood from lungs\n- **Left ventricle** → pumps to systemic circulation (thickest wall)\n\n### Valves\n| Valve | Location | Type |\n|---|---|---|\n| Tricuspid | Right AV | Atrioventricular |\n| Pulmonary | RV outflow | Semilunar |\n| Mitral | Left AV | Atrioventricular |\n| Aortic | LV outflow | Semilunar |\n\n### Coronary Circulation\n- **Left main** → LAD + Circumflex\n- **Right coronary artery** → SA node, AV node (in 90% of people)\n\n> **Clinical pearl:** The left ventricle is the most common site of myocardial infarction due to the high oxygen demand of its thick wall.',
    1
  ),
  (
    'Electrophysiology & ECG',
    'Cardiac action potentials, conduction system, and ECG interpretation basics.',
    E'## Electrophysiology & ECG\n\n### Conduction System\n1. **SA node** (pacemaker, 60–100 bpm) → atria depolarise → P wave\n2. **AV node** (delay, 40–60 bpm) → PR interval\n3. **Bundle of His** → bundle branches → Purkinje fibres → QRS complex\n4. Repolarisation → T wave\n\n### ECG Basics\n```\nNormal intervals:\nPR:  120–200 ms\nQRS: < 120 ms\nQT:  < 440 ms (male), < 460 ms (female)\n```\n\n### Common Patterns\n- **STEMI**: ST elevation ≥ 1mm in ≥ 2 contiguous leads\n- **LBBB**: Wide QRS, notched R in V5–V6\n- **AF**: Absent P waves, irregularly irregular\n\n> **Swedish guideline (ESC 2023):** STEMI door-to-balloon time target: < 90 min in PCI-capable centres.',
    2
  ),
  (
    'Heart Failure',
    'Pathophysiology, classification (HFrEF vs HFpEF), and EU/Swedish treatment guidelines.',
    E'## Heart Failure\n\n### Definition\nHeart failure is a clinical syndrome where the heart cannot pump sufficient blood to meet metabolic demands, or does so only at elevated filling pressures.\n\n### Classification\n| Type | EF | Key Feature |\n|---|---|---|\n| HFrEF | < 40% | Systolic dysfunction |\n| HFmrEF | 40–49% | Mildly reduced |\n| HFpEF | ≥ 50% | Diastolic dysfunction |\n\n### ESC Guideline Pharmacotherapy (HFrEF)\n1. **ACE-i / ARB / ARNI** — RAAS blockade\n2. **Beta-blocker** — Bisoprolol, Carvedilol, Metoprolol succinate\n3. **MRA** — Spironolactone / Eplerenone\n4. **SGLT2-i** — Dapagliflozin / Empagliflozin (ESC 2021: Class I)\n\n### NYHA Classification\n- Class I: No limitation\n- Class II: Slight limitation\n- Class III: Marked limitation\n- Class IV: Symptoms at rest\n\n> **Swedish context:** SBU recommends telemonitoring for NYHA III–IV patients to reduce hospitalisation.',
    3
  ),
  (
    'Hypertension',
    'Definitions, risk stratification, and treatment targets per ESC/ESH 2023 guidelines.',
    E'## Hypertension\n\n### ESC/ESH 2023 Classification\n| Category | Systolic | Diastolic |\n|---|---|---|\n| Optimal | < 120 | < 80 |\n| Normal | 120–129 | 80–84 |\n| High-normal | 130–139 | 85–89 |\n| Grade 1 HT | 140–159 | 90–99 |\n| Grade 2 HT | 160–179 | 100–109 |\n| Grade 3 HT | ≥ 180 | ≥ 110 |\n\n### Treatment Targets\n- **General population:** < 130/80 mmHg (if tolerated)\n- **Elderly (> 65):** 130–139 / 70–79 mmHg\n\n### First-Line Drug Classes\n1. ACE inhibitors / ARBs\n2. Calcium channel blockers (CCB)\n3. Thiazide / thiazide-like diuretics\n\n> **FASS note:** Losartan and Ramipril are on the Swedish preferred drug list (Kloka Listan, Stockholm).',
    4
  )
) as m(title, description, content_md, order_index)
where lp.slug = 'cardiology';

-- Pharmacology modules
insert into modules (path_id, title, description, content_md, order_index)
select
  lp.id,
  m.title,
  m.description,
  m.content_md,
  m.order_index
from learning_paths lp
cross join (values
  (
    'Pharmacokinetics',
    'ADME — absorption, distribution, metabolism, and excretion principles.',
    E'## Pharmacokinetics\n\nPharmacokinetics describes **what the body does to a drug**.\n\n### ADME\n\n#### Absorption\n- Bioavailability (F): fraction reaching systemic circulation\n- Route affects F: IV = 100%, oral < 100% (first-pass effect)\n\n#### Distribution\n- Volume of distribution (Vd) = dose / plasma concentration\n- High Vd → drug accumulates in tissues (e.g. lipophilic drugs)\n\n#### Metabolism\n- Primarily **hepatic** (CYP450 enzymes: CYP3A4, CYP2D6, CYP2C9)\n- Phase I: oxidation, reduction, hydrolysis\n- Phase II: conjugation (glucuronidation, sulfation)\n\n#### Excretion\n- Renal (most water-soluble metabolites)\n- Biliary / faecal\n- Half-life: t½ = 0.693 × Vd / CL\n\n> **Clinical:** Dose adjustment required in renal/hepatic impairment. Check FASS for specific guidance.',
    1
  ),
  (
    'Pharmacodynamics',
    'Receptor theory, dose-response relationships, agonists, antagonists, and drug interactions.',
    E'## Pharmacodynamics\n\nPharmacokinetics describes **what the drug does to the body**.\n\n### Receptor Interactions\n- **Agonist**: binds receptor and activates it\n- **Partial agonist**: activates but with lower Emax\n- **Antagonist**: binds but does not activate; blocks agonist\n- **Inverse agonist**: reduces constitutive receptor activity\n\n### Key Parameters\n| Parameter | Definition |\n|---|---|\n| EC50 | Concentration producing 50% maximal effect |\n| Emax | Maximum achievable effect |\n| Ki | Inhibition constant (affinity) |\n| Therapeutic index | TD50 / ED50 |\n\n### Drug Interactions\n- **Pharmacokinetic**: one drug alters ADME of another (e.g. CYP inhibition)\n- **Pharmacodynamic**: additive, synergistic, or antagonistic effects\n\n> **Example:** Warfarin + fluconazole → CYP2C9 inhibition → elevated INR → bleeding risk.',
    2
  ),
  (
    'Cardiovascular Drugs',
    'Beta-blockers, ACE inhibitors, statins, anticoagulants — mechanisms and FASS profiles.',
    E'## Cardiovascular Drugs\n\n### Beta-Blockers\n- **Mechanism:** Competitive antagonism at β1/β2 adrenoceptors\n- **Cardioselective (β1):** Metoprolol, Bisoprolol, Atenolol\n- **Uses:** HF, hypertension, angina, arrhythmia\n- **Contraindications:** Asthma (non-selective), severe bradycardia\n\n### ACE Inhibitors\n- **Mechanism:** Block conversion of Ang I → Ang II\n- **Examples (FASS SE):** Ramipril, Enalapril, Lisinopril\n- **Side effect:** Dry cough (bradykinin accumulation) → switch to ARB\n\n### Statins (HMG-CoA reductase inhibitors)\n- **Mechanism:** Reduce hepatic cholesterol synthesis → upregulate LDL receptors\n- **High-intensity:** Atorvastatin 40–80mg, Rosuvastatin 20–40mg\n- **ESC 2019 target:** LDL < 1.4 mmol/L (very high CV risk)\n\n### Anticoagulants\n| Drug | Target | Reversal |\n|---|---|---|\n| Warfarin | Vit K factors | Vit K / PCC |\n| Rivaroxaban | Xa | Andexanet alfa |\n| Dabigatran | IIa (thrombin) | Idarucizumab |\n\n> **Kloka Listan 2024:** Apixaban preferred DOAC for AF in Stockholm Region.',
    3
  )
) as m(title, description, content_md, order_index)
where lp.slug = 'pharmacology';

-- Anatomy modules
insert into modules (path_id, title, description, content_md, order_index)
select
  lp.id,
  m.title,
  m.description,
  m.content_md,
  m.order_index
from learning_paths lp
cross join (values
  (
    'Musculoskeletal System',
    'Bones, joints, muscles — upper and lower limb clinical anatomy.',
    E'## Musculoskeletal System\n\n### Upper Limb Key Structures\n\n#### Brachial Plexus (C5–T1)\n| Root | Nerve | Key muscle | Test |\n|---|---|---|---|\n| C5–C6 | Musculocutaneous | Biceps | Elbow flexion |\n| C6–C8 | Radial | Triceps, extensors | Wrist extension |\n| C8–T1 | Ulnar | Intrinsics | Finger abduction |\n| C5–T1 | Median | Thenar | Thumb opposition |\n\n#### Common Injuries\n- **Erb''s palsy (C5–C6):** waiter''s tip posture\n- **Klumpke''s (C8–T1):** claw hand\n- **Carpal tunnel (median nerve):** thenar wasting, Tinel''s sign\n\n### Lower Limb Key Structures\n- **Femoral nerve (L2–L4):** quadriceps, knee extension\n- **Sciatic nerve (L4–S3):** hamstrings, all below knee\n- **Common peroneal:** foot drop if injured at fibular neck\n\n> **Clinical:** Hip fractures are common in elderly Swedes; the majority require surgical fixation within 24h (Rikshöft guidelines).',
    1
  ),
  (
    'Nervous System',
    'CNS and PNS overview, cranial nerves, spinal tracts, and neurological examination.',
    E'## Nervous System\n\n### Cranial Nerves (I–XII)\n```\nI   Olfactory    — smell\nII  Optic        — vision (afferent pupil reflex)\nIII Oculomotor  — most EOMs, pupil constriction (efferent)\nIV  Trochlear    — superior oblique (SO4)\nV   Trigeminal   — facial sensation, mastication\nVI  Abducens     — lateral rectus (LR6)\nVII Facial       — facial expression, taste (anterior 2/3)\nVIII Vestibulocochlear — hearing, balance\nIX  Glossopharyngeal — taste (posterior 1/3), gag (afferent)\nX   Vagus        — gag (efferent), parasympathetics\nXI  Accessory    — SCM, trapezius\nXII Hypoglossal  — tongue\n```\n\n### Spinal Tracts\n| Tract | Decussation | Carries |\n|---|---|---|\n| Dorsal columns | Medulla | Fine touch, proprioception |\n| Spinothalamic | Spinal cord | Pain, temperature |\n| Corticospinal | Medulla (pyramids) | Motor commands |\n\n### UMN vs LMN\n| Feature | UMN | LMN |\n|---|---|---|\n| Tone | Increased (spastic) | Decreased (flaccid) |\n| Reflexes | Hyperreflexia | Hyporeflexia |\n| Babinski | Positive (extensor) | Negative |\n| Wasting | Late | Early |\n',
    2
  ),
  (
    'Thoracic & Abdominal Viscera',
    'Mediastinal contents, abdominal organs, and peritoneal relationships.',
    E'## Thoracic & Abdominal Viscera\n\n### Mediastinum\n#### Superior\n- Trachea, oesophagus, great vessels (aortic arch, SVC, brachiocephalic)\n- Thymus\n\n#### Inferior\n- **Anterior:** thymus remnant, fat\n- **Middle:** heart + pericardium, phrenic nerves\n- **Posterior:** oesophagus, descending aorta, thoracic duct, vagus nerves\n\n### Abdominal Organs\n| Structure | Peritoneal Status | Key Relations |\n|---|---|---|\n| Stomach | Intraperitoneal | Lesser sac posteriorly |\n| Duodenum D2–D4 | Retroperitoneal | Head of pancreas |\n| Liver | Intraperitoneal (mostly) | IVC posteriorly |\n| Kidneys | Retroperitoneal | Suprarenal glands superiorly |\n| Pancreas | Retroperitoneal | Splenic vein posteriorly |\n\n### McBurney''s Point\n- 1/3 of the way from ASIS to umbilicus\n- Point of maximal tenderness in appendicitis\n\n> **Surgical pearl:** Courvoisier''s sign: palpable, non-tender gallbladder in jaundiced patient → suspect pancreatic head carcinoma (not gallstones).',
    3
  )
) as m(title, description, content_md, order_index)
where lp.slug = 'anatomy';
