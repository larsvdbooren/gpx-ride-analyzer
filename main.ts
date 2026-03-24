import { parseGPX } from "@we-gold/gpxjs";

fetch("example-gpx/Afternoon_Ride.gpx")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch the file");
    }
    return response.text();
  })
  .then((data) => {
    const [parsedFile, error] = parseGPX(data);

    // Or use a try catch to verify
    if (error) throw error;

    const totalDistance: number = parseFloat(
      (parsedFile.tracks[0].distance.total / 1000).toFixed(2),
    );

    const totalTimeInNumber: number =
      parsedFile.tracks[0].duration.movingDuration; // 7599
    const totalTimeInDecimal: number = totalTimeInNumber / 3600; // 2,1108333333
    const totalMinutesLeft: number = totalTimeInDecimal % 1; // 0.110833333
    const totalHours: number = totalTimeInDecimal - totalMinutesLeft; // 2
    const totalMinutesInDecimal: number = totalMinutesLeft * 60; // 6,6
    const totalSecondsLeft: number = totalMinutesInDecimal % 1; // 0,6
    const totalMinutes: number = totalMinutesInDecimal - totalSecondsLeft; // 6
    const totalSeconds: number = parseFloat((totalSecondsLeft * 60).toFixed(0)); // 36
    const totalTime: string = `${String(totalHours).padStart(2, "0")}:${String(totalMinutes).padStart(2, "0")}:${String(totalSeconds).padStart(2, "0")}`;

    const averageSpeed: number = parseFloat(
      (totalDistance / totalTimeInDecimal).toFixed(2),
    );

    const elevationGain: number | string = parseFloat(
      (parsedFile.tracks[0].elevation.positive ?? 0).toFixed(0),
    );

    const rideType: string = parsedFile.tracks[0].type ?? "Not submitted";

    console.log(
      `You finished your ${rideType} activity with a total ride time of: ${totalTime}\nYou covered a total distance of: ${totalDistance}\nWith an average speed of: ${averageSpeed} km/h\nand ${elevationGain} meters of elevation gain.`,
    );

    document.getElementById("distance").textContent = `${totalDistance}`;
    document.getElementById("time").textContent = `${totalTime}`;
    document.getElementById("avgSpeed").textContent = `${averageSpeed}`;
    document.getElementById("elevation").textContent = `${elevationGain}`;
  });
