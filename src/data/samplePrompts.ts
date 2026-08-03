export interface SampleProductInput {
  title: string;
  category: string;
  rawText: string;
  description: string;
}

export const SAMPLE_PRODUCT_INPUTS: SampleProductInput[] = [
  {
    title: "1. Stainless Steel Ball Valve",
    category: "Ball Valve",
    description: "304 SS Flanged Ball Valve 2 inch Class 150 ANSI B16.34",
    rawText: `ITEM #BV-304-2IN
304 SS FLANGED BALL VALVE 2" CLASS 150. FULL PORT DESIGN WITH BLOWOUT PROOF STEM.
SPEC COMPLIANCE: ANSI B16.34 STANDARDS. 150 PSI SERVICE RATING AT 400 DEGREES F.`
  },
  {
    title: "2. Carbon Steel Gate Valve",
    category: "Gate Valve",
    description: "Heavy duty rising stem gate valve 4 in WCB Carbon Steel Class 300 API 600",
    rawText: `VALVE CAT: GV-WCB-4-300
HEAVY DUTY RISING STEM GATE VALVE 4 INCH WCB CARBON STEEL BODY
CLASS 300 FLANGED ENDS RF. API 600 CERTIFIED FIRE SAFE.
PACKING: GRAPHITE FLEXIBLE. SEAT: STELLITE HARD FACED.`
  },
  {
    title: "3. PVC Butterfly Valve",
    category: "Butterfly Valve",
    description: "PVC Lug Style Butterfly Valve 3 inch Class 150 API 609",
    rawText: `PVC LUG STYLE BUTTERFLY VALVE 3 INCH
MATERIAL: PVC BODY & DISC WITH EPDM SEALS. RATING: 150 PSI WATER AT 73 DEGREES F.
COMPLIANCE: API 609 AND ASTM D1784. LEVER OPERATED FOR CORROSIVE CHEMICAL SERVICE.`
  },
  {
    title: "4. ANSI Flange Specification",
    category: "Flange",
    description: "ANSI B16.5 Weld Neck Flange 3 inch Carbon Steel A105 Class 150",
    rawText: `SPEC SHEET: FLG-WN-A105-3IN
ANSI B16.5 WELD NECK FLANGE 3-INCH CLASS 150 RAISED FACE.
MATERIAL: CARBON STEEL ASTM A105. BORE: SCHEDULE 40. RATING: ASME B16.5.`
  },
  {
    title: "5. Pneumatic Actuator",
    category: "Actuator",
    description: "Pneumatic Rotary Actuator Double Acting ISO 5211 80 PSI Air",
    rawText: `MODEL: ACT-PNEU-DA-100
PNEUMATIC ROTARY ACTUATOR DOUBLE ACTING 100 NM TORQUE.
MOUNTING: ISO 5211 F07/F10. OPERATING PRESSURE: 80 PSI AIR. BODY: ANODIZED ALUMINUM.`
  },
  {
    title: "Physical Anomaly Test Case - High Pressure PVC",
    category: "Knowledge Graph Anomaly Test",
    description: "Incompatible combination: PVC material with Class 1500 rating (Physical Anomaly)",
    rawText: `PVC SCH 80 SOLENOID BALL VALVE 1 INCH
CLASS 1500 HIGH PRESSURE RATING 3000 PSI HIGH TEMP PIPING
ISO 5211 MOUNTING PAD FOR ROTARY ACTUATION`
  },
  {
    title: "Invalid Input Test Case - General Off-Topic Text",
    category: "Validation Test",
    description: "Off-topic text triggering the No Recognizable Product Information validation card",
    rawText: `Hello team, what is the weather forecast today in Paris? Can you summarize our internal meeting notes?`
  }
];

export const SAMPLE_BATCH_CSV = `Product_Description,Source_Ref
"304 SS Ball Valve 2 inch Class 150 ANSI B16.34 full port",Catalog_Line_1
"Gate Valve 4 inch WCB Carbon Steel Class 300 API 600",Catalog_Line_2
"PVC Schedule 80 Double Union Ball Valve 1 in 150 PSI ASTM D1784",Catalog_Line_3
"Check Valve 1.5 in Bronze Threaded 200 PSI WOG MSS SP-80",Catalog_Line_4
"Y Strainer 2 inch 316 Stainless Steel 800 WOG threaded",Catalog_Line_5
"Flange Weld Neck 3 inch Carbon Steel A105 Class 150 ASME B16.5",Catalog_Line_6
"Globe Valve 1 inch Forged Steel A105 Socket Weld Class 800 API 602",Catalog_Line_7
"Centrifugal Pump 3x2-6 316 SS 175 PSI ANSI B73.1",Catalog_Line_8
"Rotary Pneumatic Actuator Double Acting ISO 5211 F07 80 PSI",Catalog_Line_9
"PVC Ball Valve 2 inch Class 1500 High Pressure 3000 PSI",Anomaly_Test_Row
"Stainless Steel Flanged Pipe Spool 4 in Sch 40 304L ASME B31.3",Catalog_Line_11
"Bronze Gate Valve 2 in Threaded 200 WOG MSS SP-80",Catalog_Line_12`;
