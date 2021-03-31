[![Coverage Status](https://coveralls.io/repos/github/Etnolit/tid/badge.svg?branch=main)](https://coveralls.io/github/Etnolit/tid?branch=main)
![GitHub](https://img.shields.io/github/license/Etnolit/tid)
![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/Etnolit/tid)
![Mozilla Add-on](https://img.shields.io/amo/v/tid)
![Chrome Web Store](https://img.shields.io/chrome-web-store/v/cfeipfaincfjokilbdofgccimigbincm)
[![](https://img.shields.io/badge/dynamic/json?label=edge%20add-on&prefix=v&query=%24.version&color=orange&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fjpfbhfnnmijjgamgpallbancgeodfcgj)](https://microsoftedge.microsoft.com/addons/detail/arxivutils/jpfbhfnnmijjgamgpallbancgeodfcgj)

tid
===

A simple extension for creating timers in browser tabs.

Usage
-----
Use of the extension is primarily through the use of the omnibox.
To create a timer page enter `tid` followed by a duration or specific time. 
For instance `tid 10m`.

Time     | Example
-------- | -------
relative | `30s`, `20m`, `1h`
absolute | `12:30`

Advanced usage
--------------
The extensions parser understands a couple of operators.

Operator | Example
-------- | -------
`+` (addition) | `20m + 10s`, `12:30 + 1h`
`-` (subtraction) | `20m - 40s`, `12:30 - 5m`
`%` (modulus) | `%20m`, next even 20 minutes

Installation
------------
The extension is available for FireFox at https://addons.mozilla.org.

Build
-----
To build the extension use `yarn install && yarn build`.

Icon
----
Icon based on Material Design https://github.com/Templarian/MaterialDesign
