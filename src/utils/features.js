const features = [
  { name: 'GPS', description: 'Satellite navigation system' },
  { name: 'CHILD_SEAT', description: 'Child safety seat' },
  { name: 'BLUETOOTH', description: 'Bluetooth audio connectivity' },
  { name: 'CRUISE_CONTROL', description: 'Adaptive cruise control' },
  { name: 'HEATED_SEATS', description: 'Front and/or rear seat heating' },
  { name: 'SUNROOF', description: 'Glass sunroof/moonroof' },
  { name: 'PARKING_SENSORS', description: 'Front and rear parking sensors' },
  { name: 'REAR_CAMERA', description: 'Backup rear-view camera' },
  { name: 'ALL_WHEEL_DRIVE', description: 'AWD drivetrain' },
  { name: 'AUTOMATIC_TRANSMISSION', description: 'Automatic gearbox' },
  { name: 'APPLE_CARPLAY', description: 'Apple CarPlay integration' },
  { name: 'ANDROID_AUTO', description: 'Android Auto integration' },
  { name: 'USB_PORTS', description: 'Multiple USB charging/data ports' },
  { name: 'WIFI_HOTSPOT', description: 'Built-in Wi-Fi hotspot' },
  { name: 'VOICE_CONTROL', description: 'Voice-activated commands' },
  { name: 'KEYLESS_ENTRY', description: 'Keyless (proximity) entry' },
  { name: 'REMOTE_START', description: 'Remote engine start' },
  { name: 'POWER_LIFTGATE', description: 'Hands-free power liftgate' },
  { name: 'ROOF_RACK', description: 'Exterior roof rack or rails' },
  { name: 'TOWING_PACKAGE', description: 'Tow hitch and wiring' },
  { name: 'LANE_KEEP_ASSIST', description: 'Lane-keeping assistance' },
  { name: 'BLIND_SPOT_MONITORING', description: 'Blind-spot detection system' },
  { name: 'ADAPTIVE_HEADLIGHTS', description: 'Headlights that adjust to driving conditions' },
  { name: 'RAIN_SENSING_WIPERS', description: 'Automatic windshield wipers' },
  { name: 'FOG_LIGHTS', description: 'Front/rear fog lamps' },
  { name: 'TRAFFIC_SIGN_RECOGNITION', description: 'Detects and alerts speed/stop signs' },
  { name: 'EMERGENCY_CALL', description: 'Built-in eCall / SOS button' },
  { name: 'LEATHER_SEATS', description: 'Leather upholstery' },
  { name: 'THIRD_ROW_SEATING', description: 'Third-row passenger seats' },
  { name: 'ELECTRIC_CHARGING_PORT', description: 'EV charging port (for electric/hybrid cars)' },
  // Gearbox features without descriptions
  { name: 'AUTOMATIC', description: '' },
  { name: 'SEMI_AUTOMATIC', description: '' },
  { name: 'MANUAL', description: '' },
  // Fuel types without descriptions
  { name: 'PETROL', description: '' },
  { name: 'DIESEL', description: '' },
  { name: 'ELECTRIC', description: '' },
  { name: 'HYBRID', description: '' },
  { name: 'GAS', description: '' }
];

export const featureCategories = [
  {
    name: "Comfort & Technology",
    features: features.filter(f => [
      'GPS', 'BLUETOOTH', 'CRUISE_CONTROL', 'HEATED_SEATS', 'SUNROOF',
      'PARKING_SENSORS', 'REAR_CAMERA', 'AUTOMATIC_TRANSMISSION',
      'APPLE_CARPLAY', 'ANDROID_AUTO', 'USB_PORTS', 'WIFI_HOTSPOT',
      'VOICE_CONTROL', 'KEYLESS_ENTRY', 'REMOTE_START'
    ].includes(f.name))
  },
  {
    name: "Safety & Driving",
    features: features.filter(f => [
      'CHILD_SEAT', 'ALL_WHEEL_DRIVE', 'LANE_KEEP_ASSIST',
      'BLIND_SPOT_MONITORING', 'ADAPTIVE_HEADLIGHTS', 'RAIN_SENSING_WIPERS',
      'FOG_LIGHTS', 'TRAFFIC_SIGN_RECOGNITION', 'EMERGENCY_CALL'
    ].includes(f.name))
  },
  {
    name: "Utility & Space",
    features: features.filter(f => [
      'POWER_LIFTGATE', 'ROOF_RACK', 'TOWING_PACKAGE', 'LEATHER_SEATS',
      'THIRD_ROW_SEATING', 'ELECTRIC_CHARGING_PORT'
    ].includes(f.name))
  },
  {
    name: "Technical Specs",
    features: features.filter(f => [
      'AUTOMATIC', 'SEMI_AUTOMATIC', 'MANUAL', 'PETROL', 'DIESEL',
      'ELECTRIC', 'HYBRID', 'GAS'
    ].includes(f.name))
  }
];