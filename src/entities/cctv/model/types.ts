export interface CCTVStats {
  total: number;
  online: number;
  offline: number;
  percentage: number;
}

export interface JettyMonthData {
  bulan: string;
  berthing: number;
  lifting: number;
  bl: number;
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
