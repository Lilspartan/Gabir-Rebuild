---
title: 'The Gabir Motors API Wrapper'
subtitle: 'Documentation for the Gabir Motors API Wrapper'
edited: "4/27/23"
date: "4/27/23"
authorID: 557730
headerImg: '/api-wrapper.png'
tags: []
hidden: true
---

[NPM Page](https://www.npmjs.com/package/gabir-motors)

## Installation

***

```bash
npm i gabir-motors
```

## Usage

***

### Initialization

```js
const { Client } = require("gabir-motors");
const client = new Client();
```

### Calendar

```js
// Get the current season's calendar 
let calendar = await client.getCalendar();
```

#### Calendar Types

| Parameter | Type    | Description                       |
|-----------|---------|-----------------------------------|
| season    | string  | The current season of the series  |
| name      | string  | The name of the series            |
| events    | [Event](#event-types)[] | An array of the races that season |

#### Available Methods:
- .getNext() > Returns upcoming [Event](#event-types)

<br>  
<br>  

#### Event Types

| Parameter | Type      | Description                                      |
|-----------|-----------|--------------------------------------------------|
| track     | [Content](#content-types)   | The track the race takes place on                |
| cars      | [Content](#content-types)[] | An array of the cars used in the race            |
| notes     | string    | Any notes the organizers have left for that race |
| date      | string    | A written date (EX: Apr 27, 2023)                |
| timestamp | number    | A timestamp of the exact start time of the race  |
| tags      | string[]  | Any tags associated with the race                |
| hasPassed | boolean   | Whether or not race start has already passed     |

<br>  
<br>  

#### Content Types
| Parameter | Type    | Description                       |
|-----------|---------|-----------------------------------|
| name      | string  | The name of the car/track         |
| paide     | boolean | If the content is paid or not     |