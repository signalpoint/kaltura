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

