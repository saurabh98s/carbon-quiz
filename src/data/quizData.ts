import type { QuizQuestion } from '../types/quiz';
import { QUIZ_SECTIONS } from '../types/quiz';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Energy & Emissions (7 questions)
  {
    id: 1,
    section: QUIZ_SECTIONS[0],
    statement: "We track our electricity and fuel usage using digital tools.",
    explanation: "Digital tools include smart meters, energy dashboards, and monitoring software that track energy use in real time.",
    category: "Energy Tracking"
  },
  {
    id: 2,
    section: QUIZ_SECTIONS[0],
    statement: "At least part of our energy mix comes from renewable sources.",
    explanation: "Renewable energy includes solar, wind, or hydro power instead of fossil fuels.",
    category: "Renewable Energy"
  },
  {
    id: 3,
    section: QUIZ_SECTIONS[0],
    statement: "We've calculated our Scope 1, 2, and 3 emissions.",
    explanation: "Scope 1 = direct emissions, Scope 2 = purchased energy, Scope 3 = supply chain & travel.",
    category: "Emissions Measurement"
  },
  {
    id: 4,
    section: QUIZ_SECTIONS[0],
    statement: "We've implemented energy-efficient upgrades (LEDs, HVAC, BMS controls).",
    explanation: "Upgrades like LED lighting, efficient HVAC systems, and Building Management Systems (BMS) help monitor and control energy use to reduce waste and emissions.",
    category: "Energy Efficiency"
  },
  {
    id: 5,
    section: QUIZ_SECTIONS[0],
    statement: "We have carbon reduction targets aligned to science-based goals.",
    explanation: "Science-based targets follow global standards to help limit climate change.",
    category: "Carbon Targets"
  },
  {
    id: 6,
    section: QUIZ_SECTIONS[0],
    statement: "We monitor progress toward our emission reduction targets.",
    explanation: "Reduction targets like cutting energy use, switching to renewables, or lowering travel emissions.",
    category: "Progress Monitoring"
  },
  {
    id: 7,
    section: QUIZ_SECTIONS[0],
    statement: "We regularly evaluate our building or facility energy performance.",
    explanation: "Evaluating through energy audits, performance benchmarking, or efficiency assessments.",
    category: "Performance Evaluation"
  },

  // Water Use & Treatment (5 questions)
  {
    id: 8,
    section: QUIZ_SECTIONS[1],
    statement: "Our company tracks water use through meters or smart systems.",
    explanation: "Tracking through water meters, sensors, or smart meter/ monitoring systems.",
    category: "Water Tracking"
  },
  {
    id: 9,
    section: QUIZ_SECTIONS[1],
    statement: "We reuse or recycle a portion of our water.",
    explanation: "Reusing treated wastewater for cleaning, cooling, or irrigation.",
    category: "Water Reuse"
  },
  {
    id: 10,
    section: QUIZ_SECTIONS[1],
    statement: "We have a wastewater treatment system that's regularly audited.",
    explanation: "A wastewater treatment system cleans used water by removing pollutants before it's reused or released safely into the environment.",
    category: "Wastewater Treatment"
  },
  {
    id: 11,
    section: QUIZ_SECTIONS[1],
    statement: "We've set goals or initiatives to reduce water consumption.",
    explanation: "Goals like fixing leaks, installing low-flow fixtures, or reusing greywater.",
    category: "Water Reduction Goals"
  },
  {
    id: 12,
    section: QUIZ_SECTIONS[1],
    statement: "We consider water risks in our operational decisions.",
    explanation: "Considering risks like water scarcity, flooding, or supply disruptions.",
    category: "Water Risk Management"
  },

  // Waste & Circularity (5 questions)
  {
    id: 13,
    section: QUIZ_SECTIONS[2],
    statement: "We've mapped out all major waste streams in our operations.",
    explanation: "Identifying where waste comes from, like production, packaging, or office use.",
    category: "Waste Mapping"
  },
  {
    id: 14,
    section: QUIZ_SECTIONS[2],
    statement: "We recycle or reuse most of our non-hazardous waste.",
    explanation: "Recycling materials like paper, plastics, or metals instead of sending them to a landfill.",
    category: "Waste Recycling"
  },
  {
    id: 15,
    section: QUIZ_SECTIONS[2],
    statement: "We apply circular economy principles (repair, refurbish, reuse).",
    explanation: "Extending product life by repairing, reusing, or refurbishing items instead of discarding them.",
    category: "Circular Economy"
  },
  {
    id: 16,
    section: QUIZ_SECTIONS[2],
    statement: "Our packaging is sustainable — recyclable, reusable, or compostable.",
    explanation: "Using eco-friendly packaging materials that reduce plastic waste and pollution.",
    category: "Sustainable Packaging"
  },
  {
    id: 17,
    section: QUIZ_SECTIONS[2],
    statement: "We track and report our landfill diversion rate.",
    explanation: "Measuring how much waste is kept out of landfills through recycling or reuse.",
    category: "Landfill Diversion"
  },

  // Sustainable Procurement (5 questions)
  {
    id: 18,
    section: QUIZ_SECTIONS[3],
    statement: "We screen suppliers based on their sustainability practices.",
    explanation: "Checking if suppliers follow eco-friendly practices like waste reduction or fair labor.",
    category: "Supplier Screening"
  },
  {
    id: 19,
    section: QUIZ_SECTIONS[3],
    statement: "We prefer local or low-carbon suppliers whenever possible.",
    explanation: "Choosing nearby suppliers or those using cleaner transport to cut emissions.",
    category: "Local Procurement"
  },
  {
    id: 20,
    section: QUIZ_SECTIONS[3],
    statement: "We assess ESG compliance of key vendors and partners.",
    explanation: "ESG means Environmental, Social, and Governance, a standard for responsible business.",
    category: "ESG Assessment"
  },
  {
    id: 21,
    section: QUIZ_SECTIONS[3],
    statement: "We've conducted life-cycle assessments of major materials/products.",
    explanation: "Life-cycle assessment (LCA) measures environmental impact from production to disposal.",
    category: "Life-cycle Assessment"
  },
  {
    id: 22,
    section: QUIZ_SECTIONS[3],
    statement: "We engage suppliers to help them improve their sustainability.",
    explanation: "Working with suppliers through training, CPD, or collaboration to reduce their impact.",
    category: "Supplier Engagement"
  },

  // ESG Compliance & Integrity (5 questions)
  {
    id: 23,
    section: QUIZ_SECTIONS[4],
    statement: "We are fully compliant with all relevant environmental regulations.",
    explanation: "Following national and local laws on pollution, waste, and emissions.",
    category: "Regulatory Compliance"
  },
  {
    id: 24,
    section: QUIZ_SECTIONS[4],
    statement: "We publish ESG reports or disclosures (GRI, CDP, SASB, etc.).",
    explanation: "ESG : Environmental, Social & Governance. Reports follow global standards like GRI : Global Reporting Initiative, CDP : Carbon Disclosure Project, and SASB : Sustainability Accounting Standards Board.",
    category: "ESG Reporting"
  },
  {
    id: 25,
    section: QUIZ_SECTIONS[4],
    statement: "We ensure our sustainability claims are backed by real data.",
    explanation: "All environmental and social statements are supported by verified data, like bills/invoices or audits.",
    category: "Data Integrity"
  },
  {
    id: 26,
    section: QUIZ_SECTIONS[4],
    statement: "We hold recognized certifications (e.g., ISO 14001, B Corp).",
    explanation: "ISO 14001 = International Environmental Management Standard; B Corp = Certified Benefit Corporation focused on social and environmental impact.",
    category: "Certifications"
  },
  {
    id: 27,
    section: QUIZ_SECTIONS[4],
    statement: "Our data reporting process is independently reviewed or verified.",
    explanation: "External auditors or third parties check sustainability data for accuracy.",
    category: "Independent Verification"
  },

  // Governance & Culture (5 questions)
  {
    id: 28,
    section: QUIZ_SECTIONS[5],
    statement: "Sustainability is integrated into our company's overall strategy.",
    explanation: "Environmental and social goals are part of the business plan and decisions.",
    category: "Strategic Integration"
  },
  {
    id: 29,
    section: QUIZ_SECTIONS[5],
    statement: "ESG responsibility sits with senior leadership (C-suite or board).",
    explanation: "C-suite = top executives like CEO, CFO, etc., who oversee ESG performance.",
    category: "Leadership Responsibility"
  },
  {
    id: 30,
    section: QUIZ_SECTIONS[5],
    statement: "Employees are engaged in sustainability training or activities.",
    explanation: "Staff take part in eco-awareness sessions, green initiatives, or workshops.",
    category: "Employee Engagement"
  },
  {
    id: 31,
    section: QUIZ_SECTIONS[5],
    statement: "We foster an inclusive and equitable workplace culture.",
    explanation: "Promoting diversity, fair treatment, and equal opportunities for everyone.",
    category: "Inclusive Culture"
  },
  {
    id: 32,
    section: QUIZ_SECTIONS[5],
    statement: "Our sustainability team has decision-making authority.",
    explanation: "The team can lead and implement sustainability projects across the company.",
    category: "Team Authority"
  },

  // Nature & Community Impact (5 questions)
  {
    id: 33,
    section: QUIZ_SECTIONS[6],
    statement: "We assess how our operations impact land use and ecosystems.",
    explanation: "Studying how business activities affect soil, water, forests, and wildlife.",
    category: "Impact Assessment"
  },
  {
    id: 34,
    section: QUIZ_SECTIONS[6],
    statement: "We have policies against deforestation or biodiversity loss.",
    explanation: "Ensuring sourcing or projects do not harm forests, habitats, or species.",
    category: "Biodiversity Protection"
  },
  {
    id: 35,
    section: QUIZ_SECTIONS[6],
    statement: "We actively support local communities through CSR initiatives.",
    explanation: "CSR = Corporate Social Responsibility; community projects like education, health, or clean-up drives.",
    category: "Community Support"
  },
  {
    id: 36,
    section: QUIZ_SECTIONS[6],
    statement: "We partner with NGOs or community groups on environmental projects.",
    explanation: "NGO = Non-Governmental Organization; partnerships help with conservation and awareness.",
    category: "NGO Partnerships"
  },
  {
    id: 37,
    section: QUIZ_SECTIONS[6],
    statement: "Our business supports restoration, rewilding, or conservation.",
    explanation: "Funding or joining projects that restore degraded land and protect nature.",
    category: "Conservation Support"
  },

  // Digital & Operational Efficiency (4 questions)
  {
    id: 38,
    section: QUIZ_SECTIONS[7],
    statement: "We use digital systems instead of paper/manual records.",
    explanation: "Online databases and e-documents for record keeping",
    category: "Digital Systems"
  },
  {
    id: 39,
    section: QUIZ_SECTIONS[7],
    statement: "Our company supports remote work to reduce commuting emissions.",
    explanation: "Allowing hybrid or work-from-home options to cut travel-related carbon impact.",
    category: "Remote Work"
  },
  {
    id: 40,
    section: QUIZ_SECTIONS[7],
    statement: "We've adopted green IT or low-carbon cloud solutions.",
    explanation: "Using energy-efficient servers and data centers.",
    category: "Green IT"
  },
  {
    id: 41,
    section: QUIZ_SECTIONS[7],
    statement: "We've evaluated the carbon footprint of our digital operations.",
    explanation: "Measuring emissions from computers, data storage, and online systems.",
    category: "Digital Footprint"
  },

  // Audit Readiness & Transparency (5 questions)
  {
    id: 42,
    section: QUIZ_SECTIONS[8],
    statement: "We store audit data digitally with minimal paper usage.",
    explanation: "Keeping sustainability and compliance data online for easy tracking and verification.",
    category: "Digital Storage"
  },
  {
    id: 43,
    section: QUIZ_SECTIONS[8],
    statement: "Our environmental reports are clear and actionable.",
    explanation: "Reports show progress with data, insights, and steps for improvement.",
    category: "Clear Reporting"
  },
  {
    id: 44,
    section: QUIZ_SECTIONS[8],
    statement: "Our team is audit-ready — we can quickly share evidence of practices.",
    explanation: "Documents and proof of sustainability actions are organized for quick review.",
    category: "Audit Readiness"
  },
  {
    id: 45,
    section: QUIZ_SECTIONS[8],
    statement: "We estimate the potential cost and carbon savings of green measures.",
    explanation: "Calculating financial benefits and emission reductions from eco-friendly actions.",
    category: "Savings Estimation"
  }
];
