kaltura
=======

The Kaltura module for DrupalGap.


Installation
============

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
  secret: '', /* set to your "User Secret" key */
  partnerId: 1234567890 /* set to your Kaltura Partner ID */
};
```

Then set the secret and partnerId values above with the values obtained here:

https://kmc.kaltura.com/index.php/kmc/kmc#account|integration

