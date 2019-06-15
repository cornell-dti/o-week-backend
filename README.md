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
You will need **Node.js 8** to run the latest version of this app, which uses Typescript. 

You might want IntelliJ IDEA as your source code editor.

#### Install requirements
`npm install -g firebase-tools`

#### Login
`firebase login`

You must have access to the firebase project. Ask a developer lead or your TPM for access.

#### Function deployment
```bash
cd functions
npm run deploy
```
Any changes made to code is now in production.

## Documentation (DEPRECATED)
The most important app APIs are:

### Version
[https://oweekapp.herokuapp.com/flow/version/<local_version>](https://oweekapp.herokuapp.com/flow/version/0)

Provides the updated/deleted events and categories.

##### Parameters
Replace <local_version> with the version number last seen. If this is the first time the app has called this URL, use 0 as the version number.

##### Format
The response has 3 main keys: **version**, **events**, **categories**. 

**version** is the database's version. Store on the device after this version has been processed. 

**events** is further divided into two key-value pairs: **changed** and **deleted**.

**changed** is a list of the events that have been added or modified. This is not a 
list of pks but instead a list of event objects in jSON form.

**deleted** is a list of pks of the event deleted between local_version and the newest version. Note: an event object in this list many not be stored on the app.

**categories** is similar to events but for category objects.


#### Event
Event object returned by the [Version API](#version).

##### Format
`{"pk": 117, "name": "Transfer and Exchange Students Orientation Leader Meeting #1", "description": "Welcome transfer students! Welcome exchange students!", "additional": "## Meet your OL at one of the following locations ## ____ Architecture, Art, and Planning # Lobby, Goldwin Smith Hall ____ Arts and Sciences # 165 McGraw Hall", "location": "Locations In Additional Information", "place_ID": "ChIJndqRYRqC0IkR9J8bgk3mDvU", "category": 14, "start_date": "2018-08-17", "end_date": "2018-08-17", "start_time": "20:00:00", "end_time": "21:30:00", "required": false, "category_required": true}`

**pk**: The private key, a unique identifier of the event.
**category**: The pk of the category this event belongs to.
**date**: The date in which this event BEGINS. If this event crosses over midnight, the date is that of the 1st day.
**categoryRequired**: True if this event is required by its category. For example, the event above is not required for all, but for transfer students, and the event is in the transfer students category.
**additional**: Additional information to display in a special format. Formatted like so: `## HEADER ## ____BULLET # INFO ____BULLET # INFO`. The chunks are `## HEADER ##`, `____BULLET`, and `# INFO`.


#### Category
Category object returned by the [Version API](#version).

##### Format
`{"pk": 1, "category": "The Greeks", "description": "Test"}`
**pk**: The private key, a unique identifier of the category.


### Images
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