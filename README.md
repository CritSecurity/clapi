![Logo](/assets/icons/icon-192.png)  
# CLAPI
Information Disclosure Scanner for Wordpress REST API

## Background
By default, Wordpress installations run several REST endpoints, which could disclose information otherwise unknown to attackers or harder to obtain.
This utility aims to help administrators check, whether their site is affected by this weakpoint.

## Deployment
Hosted on Github Pages: https://critsecurity.github.io/clapi/  
Installable as progressive web application (PWA) on iOS, Android and Chromium-likes

## Modules

### Usernames
Enumerate account names on the target domain. Export as CSV or raw API response (json).

### Media Uploads
Enumerate uploaded files in WP's media folder. Export as CSV or raw API response (json).

### REST Endpoints
Enumerate open REST endpoints which can help discover and identify installed plugins. Export as CSV or raw API response (json).
