import * as fs from "fs";
import familyEvents from "../../out.json";
import collegeEvents from "../../out_colleges.json";
import {noComma} from "./events_to_csv";

const data: string = fs.readFileSync("out_images.csv", "utf8");
const lines: string[] = data.split("\r\n");

for (const line of lines) {
    const parts: string[] = line.split(",");
    const name = parts[0];
    const location = parts[2];
    const img = parts[6];
    console.log(`Event ${name} at location ${location} has image ${img}`);

    for (const event of familyEvents.events)
        if (noComma(event.location) === location)
            event.img = img;
    for (const event of collegeEvents)
        if (noComma(event.location) === location)
            event.img = img;
}

fs.writeFileSync("out.json", JSON.stringify({
    events: familyEvents.events,
    categories: familyEvents.categories
}));
fs.writeFileSync("out_colleges.json", JSON.stringify(collegeEvents));
fs.copyFileSync("out.json", "lib/out.json");
fs.copyFileSync("out_colleges.json", "lib/out_colleges.json");
