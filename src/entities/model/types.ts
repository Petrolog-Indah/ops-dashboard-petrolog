export interface CCTVStats {
  total: number;
  online: number;
  offline: number;
  percentage: number;
}

export interface validLicense {
  total_armada: number;
  valid_armada: number;
  invalid_armada: number;
  percentage_valid: number;
}

export interface fuelEfficiency {
  total_active_vehicles: number;
  details: {
    vehicles_moving: number;
    vehicles_idling: number;
    overspeed_alerts_today: number;
  };
  fuel_efficiency: number;
}

export interface speedCompliance {
  total_active_units: number;
  total_overspeed_alerts: number;
  average_alerts_per_unit: number;
  compliance_percentage: number;
}

export interface JettyMonthData {
  bulan: string;
  berthing: number;
  lifting: number;
  bl: number;
  tertagih: number;
  belum: number;
  billing_percentage: number;
}

export interface JettyStats {
  year: string;
  data: JettyMonthData[];
  ytd: {
    berthing: number;
    lifting: number;
    bl: number;
    tertagih: number;
    belum: number;
    billing_percentage: number;
  };
  lastUpdate: string;
}

export interface Availability {
  on_job: number;
  standby: number;
  breakdown: number;
  commercial_rate: number;
  utilisation_rate: number;
  total: number;
}

export interface Geofence {
  total_units: number;
  units_in_zone: number;
  percentage: number;
}

export interface FitRate {
  total_unit: number;
  fit_unit: number;
  fit_rate_percentage: number;
  summary: {
    kesehatan_unit: number;
    overdue_total: number;
    near_service: number;
    unit_breakdown: number;
    unit_standby: number;
  }
}

export interface SopCompliance {
  total_bekerja: number;
  total_absensi: number;
  total_toolbox_meeting: number;
  total_sop_terlaksana: number;
  percentage: number;
  area_breakdown:{
    area: string;
    count: number;
  }
}

export interface Dashcam {
  unit_terpasang: number;
  unit_online: number;
  status: string;
  unsafe_behaviour_alert: number;
  metrics: {
    online_percentage: number;
    install_percentage: number;
    safety_percentage: number;
  }
}