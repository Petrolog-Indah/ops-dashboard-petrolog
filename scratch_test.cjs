async function run() {
  try {
    const res = await fetch("https://dash.petrolog.my.id/api/cctv/jetty");
    const json = await res.json();
    console.log("Jetty Stats API Response:", JSON.stringify(json).substring(0, 500));
  } catch(e) {
    console.error(e);
  }
}
run();
