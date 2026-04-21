async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/snapshots/trigger');
    const text = await res.text();
    console.log("Trigger response:", text);

    const metricsRes = await fetch('http://localhost:3000/api/metrics/CCTV%20Online');
    const metricText = await metricsRes.text();
    console.log("CCTV metric:", metricText);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
