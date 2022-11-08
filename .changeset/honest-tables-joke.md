---
'@websublime/ws-sublime': minor
'@websublime/ws-essential': patch
'@websublime/ws-globals': patch
---

Sublime global context

Instead of using window as reference for some shared features, was created a global close context under
the name Sublime. So any setting or instance can now be shared thru the Sublime global API.
