/**
 * API from https://apps.univcomm.cornell.edu/api/itin/familyorientation/events/
 * provides the following Family Orientation events.
 *
 * Note: Required events for colleges will have [Required] at the end of the title and
 * a Required tag. The event is required for all students of a school if a school is
 * also a tag, otherwise it's required for all students.
 *
 * Structure:
 * {
 *     "EVENTS": [
 *         {
 *             "EVENT_DESCRIPTION": "",
 *             "EVENT_TIMES": [
 *                 {
 *                     "TIME_START": "August, 23 2019 11:00:00",
 *                     "TIME_END": "August, 23 2019 11:00:00",
 *                     "TIME_LOCATION_OVERRIDE":"Rhodes-Rawlings Auditorium, KG70 Klarman Hall",
 *                     "TIME_LOCATION_OVERRIDE_LAT":42.449095598100001,
 *                     "TIME_LOCATION_OVERRIDE_LON":-76.483029127099996
 *                 }, ...
 *             ],
 *             "EVENT_TAGS": [
 *                 {
 *                     "TAG_LABEL":"",
 *                     "TAG_ID":"8D0F380C-047E-8FD3-CDA449EB7C41A466"
 *                 }, ...
 *             ],
 *             "EVENT_TITLE":"Africana Library Open House",
               "EVENT_LOCATION":"Africana Studies and Research Center, 310 Triphammer Road",
 *             "EVENT_LOCATION_LAT": 42.4574290881,
 *             "EVENT_LOCATION_LON": -76.482333060499997,
 *             "EVENT_EXTERNAL_URL":"https://africana.library.cornell.edu/",
 *             "EVENT_ID":"6515E88A-A28E-610A-8A6E4DD8461A5ABF"
 *         }, ...
 *     ]
 * }
 */

import familyOrientation from "../../family.json";
import {Event} from "../models/event";
import {Category, Colleges, StudentTypes} from "../models/category";
import * as util from "util";
import * as fs from "fs";

const TIMEZONE = " GMT-04:00"; //daylight savings time
const timestamp: number = Date.now();

const events: Event[] = [];
const categories: Map<String, Category> = new Map<String, Category>();

for (const jsonEvent of familyOrientation.EVENTS) {
    const title = jsonEvent.EVENT_TITLE.replace(" [Required]", "")
        .replace(/[‘’]/g,''); // remove smart quotes
    const description = jsonEvent.EVENT_DESCRIPTION;
    const location = jsonEvent.EVENT_LOCATION;
    const latitude: number = util.isNumber(jsonEvent.EVENT_LOCATION_LAT)
        ? jsonEvent.EVENT_LOCATION_LAT : 0;
    const longitude: number = util.isNumber(jsonEvent.EVENT_LOCATION_LON)
        ? jsonEvent.EVENT_LOCATION_LON : 0;
    const url = jsonEvent.EVENT_EXTERNAL_URL;
    const id = jsonEvent.EVENT_ID;

    // convert categories
    let transfer = false;
    let someoneRequires = false;
    const tags: string[] = [];
    const tagStrings: string[] = [];
    for (const tag of jsonEvent.EVENT_TAGS) {
        const category: Category = {
            pk: tag.TAG_ID,
            category: tag.TAG_LABEL,
            timestamp: timestamp
        };
        if (category.category === "Required")
            someoneRequires = true;
        else if (category.category === StudentTypes.Transfer)
            transfer = true;
        categories.set(tag.TAG_LABEL, category);
        tags.push(tag.TAG_ID);
        tagStrings.push(tag.TAG_LABEL);
    }

    let required = false;
    let categoryRequired = false;
    if (someoneRequires) {
        // categoryRequired if tags include a college or transfer students
        for (const tag of tagStrings) {
            if (Object.values(Colleges).includes(tag) || StudentTypes.Transfer === tag) {
                categoryRequired = true;
            }
        }
        // otherwise required for all
        if (!categoryRequired)
            required = true;
    }

    // convert events
    for (const [i, time] of jsonEvent.EVENT_TIMES.entries()) {
        const overriddenLocation: string = time.TIME_LOCATION_OVERRIDE === ""
            ? location : time.TIME_LOCATION_OVERRIDE;
        const overriddenLatitude: number = util.isNumber(time.TIME_LOCATION_OVERRIDE_LAT)
            ? time.TIME_LOCATION_OVERRIDE_LAT : latitude;
        const overriddenLongitude: number = util.isNumber(time.TIME_LOCATION_OVERRIDE_LON)
            ? time.TIME_LOCATION_OVERRIDE_LON : longitude;
        const start = new Date(time.TIME_START + TIMEZONE).getTime();
        const end = new Date(time.TIME_END + TIMEZONE).getTime();

        const event: Event = {
            pk: id + i,
            name: title,
            description: description,
            additional: "",
            url: url,
            location: overriddenLocation,
            latitude: overriddenLatitude,
            longitude: overriddenLongitude,
            start: start,
            end: end,
            transfer: transfer,
            categories: tags,
            required: required,
            categoryRequired: categoryRequired,
            timestamp: timestamp
        };
        events.push(event);

        console.log(`Created event: ${title}, start: ${start}`);
    }
}

fs.writeFileSync("out.json", JSON.stringify({
    events: events,
    categories: Array.from(categories.values())
}));

