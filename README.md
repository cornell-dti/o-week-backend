O-Week Backend
======
#### Contents
  - [About](#about)
  - [Getting Started](#getting-started)
  - [Documentation](#documentation)
  - [Contributors](#contributors)
  
## About
The backend for the O-week app, to help incoming freshmen during their first week as a Cornell student. Access the [firebase console](https://console.firebase.google.com/u/0/project/oweek-1496849141291/overview) to change settings.
- [Android](https://github.com/cornell-dti/o-week-android)
- [iOS](https://github.com/cornell-dti/events-manager-ios)


## Getting Started
You will need [Node.js 10](https://nodejs.org/en/) to run the latest version of this app, which uses Typescript. 

You might want IntelliJ IDEA as your source code editor.

#### Install requirements
```bash
npm install -g firebase-tools
```

#### Login
```bash
firebase login
```

You must have access to the firebase project. Ask a developer lead or your TPM for access.

If you want to develop the scripts (not cloud functions), then you must obtain the private key [here](https://console.firebase.google.com/u/0/project/oweek-1496849141291/settings/serviceaccounts/adminsdk). The private key, once downloaded, **must be renamed to `pk.json` and place under `functions/src`.** 

Never commit this file to GitHub (the `.gitignore` should already enforce that), but if you do, immediately contact the developer leads. Leaking this key could allow an attacker arbitrary access to our database.

#### Function deployment
```bash
cd functions
npm run deploy
```
Any changes made to code is now in production.

#### Running scripts
Inside functions:
```bash
npm run build
node lib/src/scripts/<your script file>.js
```

## Documentation
The most important app APIs are:

### Version
[https://us-east1-oweek-1496849141291.cloudfunctions.net/version?timestamp=<last_timestamp>](https://us-east1-oweek-1496849141291.cloudfunctions.net/version?timestamp=0)

Provides the updated/deleted events and categories.

##### Parameters
Replace <last_timestamp> with the timestamp last obtained from this call. If this is the first time the app has called this URL, use 0 as the timestamp.

##### Format
The response has 3 main keys: **timestamp**, **events**, **categories**. 

**timestamp** is the current time. Store on the device after processing. 

**events** is further divided into two key-value pairs: **changed** and **deleted**.

**changed** is a list of the events that have been added or modified. This is not a 
list of pks but instead a list of event objects in jSON form.

**deleted** is a list of pks of the event deleted between last_timestamp and the newest version. Note: an event object in this list many not be stored on the app.

**categories** is similar to events but for category objects.


### Event
Event object returned by the [Version API](#version).

##### Format
```json
{  
    "pk":"6515E88A-A28E-610A-8A6E4DD8461A5ABF0",
    "name":"Africana Library Open House",
    "description":"The John Henrik Clarke Africana Library provides a special collection focusing on the history and culture of people of African ancestry. The library supports the curriculum of Cornell University’s Africana Studies and Research Center and the Cornell community at large. The library was named in honor of Dr. John Henrik Clarke during the summer of 1985. As a distinguished historian, Dr. Clarke taught courses in Black history at Cornell and was instrumental in establishing the Africana Center’s curriculum in the 1970s. The fall of 2019 marks the 50th anniversary of the founding of Africana. Come and take a tour of the library and the center, and see salient works from our collection.",
    "additional":"",
    "url":"https://africana.library.cornell.edu/",
    "location":"Africana Studies and Research Center, 310 Triphammer Road",
    "latitude":42.4574290881,
    "longitude":-76.4823330605,
    "start":1566572400000,
    "end":1566583200000,
    "categories":[  
        "3D56A772-CEE7-2FAC-D320EC9F9BDA6E77",
        "3D5A35CF-9CF4-6F1D-20B4C097C26FFEFF",
        "3D5B7DBF-0E01-B030-7415609B58D7A9BD",
        "3D6F166E-9214-DA5D-A34F1B2210D0E798",
        "3D71C261-05B8-12D9-978ED31A5A5510B7",
        "BAEFD405-B017-6569-6F8E61533D4F3831"
    ],
    "firstYearRequired": false,
    "transferRequired": false,
    "timestamp":1565469385536
}
```

**pk**: The private key, a unique identifier of the event.

**categories**: The pk of the categories this event belongs to.

**start/end**: The epoch time when this event begins/ends. In EST daylight saving time.

**firstYearRequired**: True if the event is required for first year students of colleges in categories.

**transferRequired**: True if the event is required for transfer students of colleges in categories.

**additional** (Deprecated): Additional information to display in a special format. Formatted like so: `## HEADER ## ____BULLET # INFO ____BULLET # INFO`. The chunks are `## HEADER ##`, `____BULLET`, and `# INFO`.


#### Category
Category object returned by the [Version API](#version).

##### Format
```json
{  
    "pk":"3D5B7DBF-0E01-B030-7415609B58D7A9BD",
    "category":"Transfer Students",
    "timestamp": 1565229389461
}
```
**pk**: The private key, a unique identifier of the category.

### Resources
[https://us-east1-oweek-1496849141291.cloudfunctions.net/getResources]()

The resources to display in the Settings page.

##### Format
```json
[
    {  
        "link":"https://cornelldti.org",
        "name":"Cornell Design & Tech Initiative"
    }
]
```

### Images (DEPRECATED)
[https://oweekapp.herokuapp.com/flow/event/<event_pk>/image](https://oweekapp.herokuapp.com/flow/event/117/image)

The image of an event.

#### Parameters
Replace <event_pk> with the **pk** of the event. The above link may be broken if the event no longer exists or the image has been deleted.


## Contributors
##### 2019
**David Chu** - Developer Lead
##### 2018
**Arnav Ghosh** - Back-End Developer
##### 2017
**Arnav Ghosh** - Back-End Developer
##### 2016
**Arnav Ghosh** - Back-End Developer

We are a part of the O-Week/Events team within **Cornell Design & Tech Initiative**. For more information, see our website [here](https://cornelldti.org/).
<img src="https://raw.githubusercontent.com/cornell-dti/design/master/Branding/Wordmark/Dark%20Text/Transparent/Wordmark-Dark%20Text-Transparent%403x.png">

_Last updated **6/9/2019**_.