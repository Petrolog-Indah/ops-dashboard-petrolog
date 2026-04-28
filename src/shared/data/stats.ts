import type { JettyMonthData } from '../../entities/model/types';

export const getStatsMapping = (
    cctvStats: any,
    jettyStats: any,
    validLicenseStats: any,
    fitRateStats: any,
    geofenceStats: any,
    availabilityStats: any,
    selectedMonth: string,
    fuelEfficiencyStats: any,
    sopComplianceStats: any,
) => [
        {
            condition: cctvStats,
            label: 'CCTV Online',
            value: cctvStats ? Math.round(cctvStats.percentage) : 0,
            subLabel: cctvStats ? `${cctvStats.online} / ${cctvStats.total} Online` : '',
        },
        {
            condition: jettyStats && jettyStats.data,
            label: 'Billed Jetty MTD',
            value: () => {
                if (jettyStats && jettyStats.data) {
                    const monthData = jettyStats.data.find(
                        (d: JettyMonthData) => d.bulan === selectedMonth
                    );
                    return monthData ? monthData.billing_percentage : 0;
                }
                return 0;
            },
            subLabel: () => {
                if (jettyStats && jettyStats.data) {
                    const monthData = jettyStats.data.find(
                        (d: JettyMonthData) => d.bulan === selectedMonth
                    );
                    return monthData ? `${monthData.tertagih} / ${monthData.bl} Billed` : '';
                }
                return '';
            },
        },
        {
            condition: validLicenseStats,
            label: 'Unit Valid License',
            value: validLicenseStats ? Math.round(validLicenseStats.percentage_valid) : 0,
            subLabel: validLicenseStats ? `${validLicenseStats.valid_armada} / ${validLicenseStats.total_armada} Valid Lincense` : '',
        },
        {
            condition: fitRateStats,
            label: 'Fit Rate',
            value: fitRateStats ? Math.round(fitRateStats.fit_rate_percentage) : 0,
            subLabel: fitRateStats ? `${fitRateStats.fit_unit} / ${fitRateStats.total_unit} Fit` : '',
        },
        {
            condition: geofenceStats,
            label: 'Within Geofence',
            value: geofenceStats ? Math.round(geofenceStats.percentage) : 0,
            subLabel: geofenceStats ? `${geofenceStats.units_in_zone} / ${geofenceStats.total_units} Units In Zone` : '',
        },
        {
            condition: availabilityStats,
            label: 'Commercial Rate',
            value: availabilityStats ? Math.round(availabilityStats.commercial_rate) : 0,
            subLabel: availabilityStats ? `${availabilityStats.on_job + availabilityStats.standby} / ${availabilityStats.total} Unit Report` : '',
        },
        {
            condition: availabilityStats,
            label: 'Utilisation Rate',
            value: availabilityStats ? Math.round(availabilityStats.utilisation_rate) : 0,
            subLabel: availabilityStats ? `${availabilityStats.on_job} / ${availabilityStats.total} Unit Report` : '',
        },
        {
            condition: fuelEfficiencyStats,
            label: 'Fuel Efficiency',
            value: fuelEfficiencyStats ? Math.round(fuelEfficiencyStats.fuel_efficiency) : 0,
            subLabel: fuelEfficiencyStats ? `From ${fuelEfficiencyStats.total_active_vehicles} unit active` : '',
        },
        {
            condition: sopComplianceStats,
            label: 'SOP Compliance',
            value: sopComplianceStats ? Math.round(sopComplianceStats.percentage) : 0,
            subLabel: sopComplianceStats ? `${sopComplianceStats.total_sop_terlaksana} / ${sopComplianceStats.total_bekerja} SOP Terlaksana` : '',
        },
    ];