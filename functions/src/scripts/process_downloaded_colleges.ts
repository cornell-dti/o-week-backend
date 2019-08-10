/**
 * API from URLs that look like: https://us.involvio.com/v20/schedules/5d309f6adf679d2e0e7346c8/events?start_date=2019-08-22&end_date=2019-09-04&per_page=500&involv_token=%242a%2410%24%2F6ToTlyVM%2FshFUgKAXt4OeMjBuofeq9zllPyDNn3fUIv6wcZLJXE6
 * provides the following Family Orientation events.
 *
 * Note: Required events for colleges will have [Required] at the end of the title and
 * a Required tag. The event is required for all students if all school JSONs have it as
 * required; otherwise it's only required for that school.
 *
 * Structure:
 * {
 *     "events": [
 *         {
 *             "_id": "5d3c2f0a5ab6a9187af93a49",
 *             "name":"The Cornell Store Back-to-School Events",
 *             "start_time":"2019-08-23T12:00:00Z",
 *             "end_time":"2019-08-23T23:00:00+00:00",
 *             "place": {
 *                 "name":"The Cornell Store",
 *                 "room_name":"The Cornell Store",
 *                 "address":"135 Ho Plz, Ithaca, NY 14850",
 *                 "loc": [
 *                     "42.446744",
 *                     "-76.484202"
 *                 ]
 *             },
 *             "description": ""
 *         }
 *     ]
 * }
 */

import aapEvents from "../../data/aap.json";
import calsEvents from "../../data/als.json";
import asEvents from "../../data/as.json";
import dysonEvents from "../../data/dyson.json";
import engineeringEvents from "../../data/engineering.json";
import hotelEvents from "../../data/hotel.json";
import humanEcologyEvents from "../../data/human ecology.json";
import transferAapEvents from "../../data/transfer aap.json";
import transferCalsEvents from "../../data/transfer als.json";
import transferAsEvents from "../../data/transfer as.json";
import transferDysonEvents from "../../data/transfer dyson.json";
import transferEngineeringEvents from "../../data/transfer engineering.json";
import transferHumanEcologyEvents from "../../data/transfer human ecology.json";
import transferIlrEvents from "../../data/transfer ilr.json";
import familyOrientation from "../../out.json";

import {CategoryToPk, Colleges} from "../models/category";
import {Event} from "../models/event";
import * as fs from "fs";

interface JsonEvent {
    _id: string,
    name: string,
    start_time: string,
    end_time: string,
    place: {
        name: string,
        room_name: string,
        address: string,
        loc: number[]
    },
    description: string
}
interface JsonEvents {
    events: JsonEvent[]
}

const collegeToJson: Record<string, JsonEvents> = {
    AAP: aapEvents,
    AS: asEvents,
    CALS: calsEvents,
    Engineering: engineeringEvents,
    HumanEcology: humanEcologyEvents,
    // missing ILR
    Dyson: dysonEvents,
    Hotel: hotelEvents
};
const transferCollegesToJson: Record<string, JsonEvents> = {
    AAP: transferAapEvents,
    AS: transferAsEvents,
    CALS: transferCalsEvents,
    Engineering: transferEngineeringEvents,
    HumanEcology: transferHumanEcologyEvents,
    ILR: transferIlrEvents,
    Dyson: transferDysonEvents
    // missing transfer hotel
};

// names
const familyEvents: Set<string> = new Set(familyOrientation.events.map(event => event.name));

const timestamp: number = Date.now();

// key = pk
const events: Map<string, Event> = new Map<string, Event>();

function processEvents(category: string, transfer: boolean, jsonEvents: JsonEvents): void {
    for (const jsonEvent of jsonEvents.events) {
        const name = jsonEvent.name.replace(" [Required]", "");
        // Don't process what was in family orientation events
        if (familyEvents.has(name) || familyEvents.has(name.replace("'", "")))
            continue;

        // Store all required event pks
        let firstYearRequired = false;
        let transferRequired = false;
        if (name !== jsonEvent.name) {
            if (!transfer)
                firstYearRequired = true;
            else
                transferRequired = true;
        }

        // add to categories if event already recorded
        const id = jsonEvent._id;
        const existingEvent = events.get(id);
        if (existingEvent !== undefined) {
            if (!existingEvent.categories.includes(category))
                existingEvent.categories.push(category);
            existingEvent.firstYearRequired = existingEvent.firstYearRequired ||
                firstYearRequired;
            existingEvent.transferRequired = existingEvent.transferRequired ||
                transferRequired;
            continue;
        }

        const description = jsonEvent.description;
        const start = Date.parse(jsonEvent.start_time);
        const end = Date.parse(jsonEvent.end_time);

        let location = "";
        if (jsonEvent.place.name !== null) {
            if (jsonEvent.place.room_name !== null &&
                jsonEvent.place.room_name !== jsonEvent.place.name)
                location = `${jsonEvent.place.name}, ${jsonEvent.place.room_name}`;
            else
                location = jsonEvent.place.name;
        } else {
            location = jsonEvent.place.room_name;
        }
        let latitude: number = 0;
        let longitude: number = 0;
        if (jsonEvent.place.loc !== null) {
            latitude = jsonEvent.place.loc[0];
            longitude = jsonEvent.place.loc[1];
        }

        const event: Event = {
            pk: id,
            name: name,
            description: description,
            additional: "",
            url: "",
            location: location,
            latitude: latitude,
            longitude: longitude,
            start: start,
            end: end,
            categories: [category],
            firstYearRequired: firstYearRequired,
            transferRequired: transferRequired,
            timestamp: timestamp
        };

        events.set(id, event);
        console.log(`Event: ${name}`);
    }
}

// process events
for (const [college, jsonEvents] of Object.entries(collegeToJson)) {
    const collegePk: string = CategoryToPk[college];
    console.log(`College: ${college}`);
    processEvents(collegePk, false, jsonEvents);
}
for (const [college, jsonEvents] of Object.entries(transferCollegesToJson)) {
    const collegePk: string = CategoryToPk[college];
    console.log(`Transfer college: ${college}`);
    processEvents(collegePk, true, jsonEvents);
}

//save to file
fs.writeFileSync("out_colleges.json", JSON.stringify(Array.from(events.values())));
// paste the output into lib so it can be used for batch_upload
fs.copyFileSync("out_colleges.json", "lib/out_colleges.json");
