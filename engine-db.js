// Diesel Dude Engine / Equipment Database
// Covers heavy equipment, fleet trucks, and diesel-powered machines

const DIESEL_DB = {
  // ===== CUMMINS =====
  'ISX': { make: 'Cummins', model: 'ISX', displacement: '15L', power: '400-600hp', torque: '1450-2050lb-ft', type: 'inline-6', application: 'Class 8 trucks, Peterbilt, Kenworth, Freightliner', commonFaults: ['EGR valve', 'DPF regen', 'injector cups', 'VGT turbo', 'CM2250 ECM'] },
  'ISB': { make: 'Cummins', model: 'ISB 6.7', displacement: '6.7L', power: '240-385hp', torque: '420-850lb-ft', type: 'inline-6', application: 'Ram 2500/3500, medium duty, school buses', commonFaults: ['DEF system', 'DPF', 'EGR cooler', 'fuel filter', 'VP44 pump'] },
  'ISC': { make: 'Cummins', model: 'ISC 8.3', displacement: '8.3L', power: '260-330hp', type: 'inline-6', application: 'Medium duty trucks, RV, coach', commonFaults: ['injector o-rings', 'EGR', 'DPF', 'fuel system'] },
  'ISM': { make: 'Cummins', model: 'ISM', displacement: '11L', power: '280-425hp', type: 'inline-6', application: 'Class 7-8 trucks, coaches', commonFaults: ['rocker arms', 'EGR', 'injector cups', 'DPF'] },
  'QSK': { make: 'Cummins', model: 'QSK Series', power: '600-4000hp', type: 'V12/V16', application: 'Mining equipment, large generators, marine', commonFaults: ['injector calibration', 'turbo', 'cooling system', 'ECM'] },
  'X15': { make: 'Cummins', model: 'X15', displacement: '15L', power: '400-605hp', type: 'inline-6', application: 'Class 8 trucks', commonFaults: ['DEF quality', 'EGR', 'DPF', 'common rail injectors'] },

  // ===== CATERPILLAR =====
  'C7': { make: 'Caterpillar', model: 'C7', displacement: '7.2L', power: '170-330hp', type: 'inline-6', application: 'Medium duty trucks, yellow iron, marine', commonFaults: ['HEUI injectors', 'oil pressure', 'turbo', 'injector cups'] },
  'C9': { make: 'Caterpillar', model: 'C9', displacement: '9L', power: '275-350hp', type: 'inline-6', application: 'CAT 336/345 excavators, medium equipment', commonFaults: ['HEUI pump', 'injectors', 'DEF', 'head gasket'] },
  'C13': { make: 'Caterpillar', model: 'C13', displacement: '12.5L', power: '380-520hp', type: 'inline-6', application: 'Class 8 trucks, large equipment', commonFaults: ['EGR', 'DPF', 'turbo', 'common rail'] },
  'C15': { make: 'Caterpillar', model: 'C15', displacement: '15.2L', power: '435-625hp', type: 'inline-6', application: 'Class 8, large equipment, generators', commonFaults: ['twin turbo', 'EGR', 'injectors', 'oil consumption'] },
  'C18': { make: 'Caterpillar', model: 'C18', displacement: '18.1L', power: '575-800hp', type: 'inline-6', application: 'Mining, large equipment, marine', commonFaults: ['fuel system', 'turbo', 'cooling'] },
  '3406E': { make: 'Caterpillar', model: '3406E', displacement: '14.6L', power: '310-550hp', type: 'inline-6', application: 'Class 8 trucks, stationary', commonFaults: ['injector cups', 'unit injectors', 'turbo', 'oil leaks'] },

  // ===== DETROIT DIESEL =====
  'DD13': { make: 'Detroit Diesel', model: 'DD13', displacement: '12.8L', power: '350-525hp', type: 'inline-6', application: 'Freightliner Cascadia, Western Star', commonFaults: ['EGR cooler', 'DPF', 'DEF quality', 'turbo actuator'] },
  'DD15': { make: 'Detroit Diesel', model: 'DD15', displacement: '14.8L', power: '455-560hp', type: 'inline-6', application: 'Freightliner, Western Star Class 8', commonFaults: ['EGR', 'DPF regen', 'turbocharger', 'fuel injectors'] },
  'DD16': { make: 'Detroit Diesel', model: 'DD16', displacement: '15.6L', power: '475-600hp', type: 'inline-6', application: 'Heavy haul, max payload Class 8', commonFaults: ['EGR', 'DPF', 'turbo', 'fuel system'] },
  'Series60': { make: 'Detroit Diesel', model: 'Series 60', displacement: '12.7/14L', power: '350-515hp', type: 'inline-6', application: 'Class 8 trucks (pre-emissions)', commonFaults: ['EGR valve', 'DDEC ECM', 'injectors', 'turbo', 'coolant leaks'] },

  // ===== JOHN DEERE POWERTECH =====
  'PowerTech4045': { make: 'John Deere', model: 'PowerTech 4045', displacement: '4.5L', power: '75-175hp', type: 'inline-4', application: 'JD tractors, compact equipment, utility vehicles', commonFaults: ['injection pump', 'fuel filter', 'glow plugs', 'turbo'] },
  'PowerTech6068': { make: 'John Deere', model: 'PowerTech 6068', displacement: '6.8L', power: '130-275hp', type: 'inline-6', application: 'JD large tractors, combines, equipment', commonFaults: ['DPF', 'SCR', 'DEF', 'EGR cooler', 'fuel contamination'] },
  'PowerTech6090': { make: 'John Deere', model: 'PowerTech 6090', displacement: '9L', power: '250-503hp', type: 'inline-6', application: 'Large JD equipment, combines, sprayers', commonFaults: ['DPF', 'DEF dosing', 'fuel system', 'turbo'] },

  // ===== INTERNATIONAL / NAVISTAR =====
  'MaxxForce13': { make: 'International', model: 'MaxxForce 13', displacement: '12.4L', power: '385-475hp', type: 'inline-6', application: 'International ProStar, Lonestar', commonFaults: ['EGR', 'DPF', 'turbo', 'injectors', 'known ECM issues'] },
  'N13': { make: 'International', model: 'A26/N13', displacement: '12.4L', power: '350-525hp', type: 'inline-6', application: 'International LT, RH, HX', commonFaults: ['EGR', 'DPF', 'turbo actuator', 'DEF'] },
  'DT466': { make: 'International', model: 'DT466', displacement: '7.6L', power: '175-300hp', type: 'inline-6', application: 'Medium duty trucks, school buses', commonFaults: ['HEUI injectors', 'injection control pressure', 'EGR', 'oil cooler'] },

  // ===== VOLVO =====
  'D13': { make: 'Volvo', model: 'D13', displacement: '12.8L', power: '375-500hp', type: 'inline-6', application: 'Volvo VNL, VNX Class 8', commonFaults: ['EGR cooler', 'DPF', 'VGT turbo', 'DEF', 'injectors'] },
  'D16': { make: 'Volvo', model: 'D16', displacement: '16.1L', power: '540-600hp', type: 'inline-6', application: 'Volvo heavy haul', commonFaults: ['EGR', 'turbo', 'fuel system', 'cooling'] },

  // ===== MACK =====
  'MP8': { make: 'Mack', model: 'MP8', displacement: '12.8L', power: '380-505hp', type: 'inline-6', application: 'Mack Anthem, Pinnacle', commonFaults: ['EGR', 'DPF', 'turbo', 'injectors', 'DEF'] },
  'MP7': { make: 'Mack', model: 'MP7', displacement: '11L', power: '325-425hp', type: 'inline-6', application: 'Mack medium/heavy duty', commonFaults: ['EGR', 'DPF', 'DEF', 'fuel system'] },

  // ===== PACCAR =====
  'MX13': { make: 'PACCAR', model: 'MX-13', displacement: '12.9L', power: '405-510hp', type: 'inline-6', application: 'Kenworth T680, Peterbilt 579', commonFaults: ['EGR', 'DPF', 'DEF', 'unit injectors'] },
  'MX11': { make: 'PACCAR', model: 'MX-11', displacement: '10.8L', power: '325-430hp', type: 'inline-6', application: 'Kenworth, Peterbilt regional haul', commonFaults: ['EGR', 'DPF', 'DEF', 'turbo'] },

  // ===== POWER STROKE =====
  '6.7PowerStroke': { make: 'Ford', model: '6.7L Power Stroke', displacement: '6.7L', power: '250-500hp', torque: '440-1200lb-ft', type: 'V8', application: 'Ford F-250/350/450/550', commonFaults: ['EGR cooler', 'DPF', 'SCR/DEF', 'oil cooler', 'EGR valve', 'turbo'] },
  '6.0PowerStroke': { make: 'Ford', model: '6.0L Power Stroke', displacement: '6L', power: '325hp', type: 'V8', application: 'Ford F-250/350 2003-2007', commonFaults: ['EGR cooler', 'oil cooler', 'head bolts', 'FICM', 'turbo VGT'] },
  '7.3PowerStroke': { make: 'Ford', model: '7.3L Power Stroke', displacement: '7.3L', power: '210-275hp', type: 'V8', application: 'Ford F-250/350 1994-2003', commonFaults: ['IPR valve', 'HPOP', 'injectors', 'cam position sensor', 'UVCH'] },

  // ===== DURAMAX =====
  'LML': { make: 'GM', model: 'LML Duramax 6.6L', displacement: '6.6L', power: '397hp', type: 'V8', application: 'Chevy/GMC 2500/3500 2011-2016', commonFaults: ['DEF system', 'DPF', 'EGR', 'CP4 injection pump', 'water pump'] },
  'L5P': { make: 'GM', model: 'L5P Duramax 6.6L', displacement: '6.6L', power: '445hp', type: 'V8', application: 'Chevy/GMC 2500/3500 2017+', commonFaults: ['DEF', 'DPF', 'EGR', 'turbo actuator'] },

  // ===== CUMMINS RAM =====
  '6.7Cummins': { make: 'Cummins', model: '6.7L for Ram', displacement: '6.7L', power: '370-420hp', torque: '850-1000lb-ft', type: 'inline-6', application: 'Ram 2500/3500 pickup trucks', commonFaults: ['DEF system', 'DPF', 'EGR cooler', 'lift pump', 'CP3 pump'] },
};

function findEngine(query) {
  if (!query) return null;
  const q = query.toLowerCase();
  for (const [key, engine] of Object.entries(DIESEL_DB)) {
    if (key.toLowerCase().includes(q) ||
        engine.model.toLowerCase().includes(q) ||
        engine.make.toLowerCase().includes(q) ||
        (engine.application || '').toLowerCase().includes(q)) {
      return engine;
    }
  }
  return null;
}

module.exports = { DIESEL_DB, findEngine };
