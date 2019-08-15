import {Event} from "../models/event";
import familyEvents from "../../out.json";
import collegeEvents from "../../out_colleges.json";
import * as fs from "fs";

export function noComma(str: string): string {
    return str.replace(/[,]/g, ";");
}

function csvInfoOfEvent(event: Event): string {
    const categories = event.categories.map(pk => familyEvents.categories
        .find(c => c.pk === pk) || {category: ""})
        .map(c => noComma(c.category));
    return [event.name, categories, event.location, event.longitude, event.latitude]
        .map(val => noComma(String(val))).join(",") + "\n";
}

let output: string = "";
for (const event of familyEvents.events)
    output += csvInfoOfEvent(event);
for (const event of collegeEvents)
    output += csvInfoOfEvent(event);
fs.writeFileSync("out.csv", output);

console.log(familyEvents.categories.map(c => c.category).join(", "));