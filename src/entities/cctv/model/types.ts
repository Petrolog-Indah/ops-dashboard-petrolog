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
