kaltura
=======

The Kaltura module for DrupalGap.


Installation
============

Download and enable the Services Kaltura module on your Drupal site, then follow
the module's README:

https://www.drupal.org/sandbox/signalpoint/2390237

Download the Kaltura JavaScript library:

http://www.kaltura.com/api_v3/testme/client-libs.php

Extract its contents so they live here in the app:

```
app/libraries/kaltura
```

To verify the files are in the correct location, this file (and many others)
will exist here:

```
app/libraries/kaltura/KalturaClient.js
```

Use a terminal window to go into the kaltura directory, and then run this php
command, for example:

```
cd app/libraries/kaltura
php kaltura.min.js.php > kaltura.min.js
```

Enable the module as usual in your settings.js file:

```
Drupal.modules.contrib['kaltura'] = {};
```

Add the module's settings to your settings.js file:

```
/*******************|
 * Kaltura Settings |
 *******************/
drupalgap.settings.kaltura = {
  KS: '', /* do not change */
  serviceUrl: 'http://www.kaltura.com/', /* do not change */
  partnerId: 123456789, /* set to your Kaltura Partner ID */
  playerId: 987654321 /* a player id available in the KMC Studio */
};
```

Then set the partnerId value above with the value obtained here:

https://kmc.kaltura.com/index.php/kmc/kmc#account|integration

And set the playerID value above with a value obtained here:

http://kmc.kaltura.com/index.php/kmc/kmc4#studio|universal_studio

