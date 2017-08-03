# Emotion tracker

Web-based wrapper for the [Azure Emotion API](https://azure.microsoft.com/en-gb/services/cognitive-services/emotion/)

## Screenshot

![](https://i.imgur.com/J2xIMe9.png)

_As modelled by [George Bryant](https://github.com/Flujible)_

## Installation

- Clone this repository
- `npm install`
- `npm start`

## Limitations

As `getUserMedia` is disabled on insecure origins as of [Chrome 47](https://developers.google.com/web/updates/2015/10/chrome-47-webrtc#public_service_announcements), this will only work on localhost.
