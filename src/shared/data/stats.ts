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
    speedComplianceStats: any,
    dashcamStats: any,
    p2hTbmCompliance: any,
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
        {
            condition: speedComplianceStats,
            label: 'Speed-Limit Compliance',
            value: speedComplianceStats ? Math.round(speedComplianceStats.compliance_percentage) : 0,
            subLabel: speedComplianceStats ? `${speedComplianceStats.total_overspeed_alerts} Overspeed Alert` : '',
        },
        {
            condition: dashcamStats,
            label: 'Dashcam Installed',
            value: dashcamStats ? Math.round(dashcamStats.metrics.install_percentage) : 0,
            subLabel: dashcamStats ? `${dashcamStats.unit_terpasang} Dashcam` : '',
        },
        {
            condition: dashcamStats,
            label: 'Dashcam Online',
            value: dashcamStats ? Math.round(dashcamStats.metrics.online_percentage) : 0,
            subLabel: dashcamStats ? `${dashcamStats.unit_online} / ${dashcamStats.unit_terpasang} Online` : '',
        },
        {
            condition: dashcamStats,
            label: 'Unsafe Behavior Dashcam',
            value: dashcamStats ? Math.round(dashcamStats.metrics.safety_percentage) : 0,
            subLabel: dashcamStats ? `${dashcamStats.unsafe_behaviour_alert} Alert Today` : '',
        },
        {
            condition: p2hTbmCompliance,
            label: 'P2H Compliance',
            value: p2hTbmCompliance ? p2hTbmCompliance.p2h_percentage : 0,
            subLabel: p2hTbmCompliance
                ? `${p2hTbmCompliance.p2h_checked} / ${p2hTbmCompliance.count} Checked`
                : '',
        },
        {
            condition: p2hTbmCompliance,
            label: 'TBM Compliance',
            value: p2hTbmCompliance ? p2hTbmCompliance.tbm_percentage : 0,
            subLabel: p2hTbmCompliance
                ? `${p2hTbmCompliance.tbm_checked} / ${p2hTbmCompliance.count} Checked`
                : '',
        },

    ];