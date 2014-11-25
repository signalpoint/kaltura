/**
 * Implements hook_install().
 */
function kaltura_install() {
  try {
    drupalgap_add_js('app/libraries/kaltura/kaltura.min.js');
    kaltura_session_start();
  }
  catch (error) { console.log('kaltura_install - ' + error); }
}

/**
 * Implements hook_field_formatter_view().
 */
function field_kaltura_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    
    /*dpm(entity_type);
    dpm(entity);
    dpm(field);
    dpm(instance);
    dpm(langcode);
    dpm(items);
    dpm(display);*/
    
    // Iterate over each item, and place a widget onto the render array.
    var content = {};
    $.each(items, function(delta, item) {
        content[delta] = {
          markup: '<div id="' + item.entryid + '"></div>' +
            drupalgap_jqm_page_event_script_code({
              page_id: drupalgap_get_page_id(),
              jqm_page_event: 'pageshow',
              jqm_page_event_callback: 'field_kaltura_field_formatter_view_pageshow',
              jqm_page_event_args: JSON.stringify(item)
            }, item.entryid)
        };
    });
    return content;

  }
  catch (error) { console.log('field_kaltura_field_formatter_view - ' + error); }
}

/**
 *
 */
function field_kaltura_field_formatter_view_pageshow(item) {
  try {
    kaltura_media_get({
        item: item,
        cb: function (success, results) {
          if(!success) {
            drupalgap_alert(results);
            return;
          }
          if(results.code && results.message) {
            drupalgap_alert(results.message);
            return;
          }
          dpm('kaltura_media_get - results');
          console.log(results);
        }
    });
  }
  catch (error) { console.log('field_kaltura_field_formatter_view_pageshow - ' + error); }
}

/**
 * Implements hook_field_widget_form
 */
function field_kaltura_field_widget_form(form, form_state, field, instance, langcode, items, delta, element) {
  try {
    items[delta].children.push({
        type: 'button_link',
        text: 'Add media',
        path: null
    })
  }
  catch (error) { console.log('field_kaltura_field_widget_form() - ' + error); }
}

/**
 *
 */
function theme_field_kaltura_entryid(variables) {
  try {
    return 'theme_field_kaltura_entryid';
  }
  catch (error) { console.log('theme_field_kaltura_entryid - ' + error); }
}

/***********************|
 * Kaltura Services API |
 ***********************/
 
/**
 * Starts a Kaltura session, and saves the session id in the KS string.
 */
function kaltura_session_start() {
  try {
    var cb = function (success, results) {
      if (!success) {
        drupalgap_alert(results);
        return;
      }
      if(results.code && results.message) {
        drupalgap_alert(results.message);
        return;
      }
      drupalgap.settings.kaltura.KS = results;
      dpm('set the KS string');
    };
    var partnerId = drupalgap.settings.kaltura.partnerId;
    var config = new KalturaConfiguration(partnerId);
    config.serviceUrl = drupalgap.settings.kaltura.serviceUrl;
    var client = new KalturaClient(config);
    var secret = drupalgap.settings.kaltura.secret;
    var userId = "";
    var type = null;
    var expiry = null;
    var privileges = null;
    var result = client.session.start(cb, secret, userId, type, partnerId, expiry, privileges);
  }
  catch (error) { console.log('kaltura_session_start - ' + error); }
}

/**
 *
 */
function kaltura_media_get(options) {
  try {
    dpm(options);
    var config = new KalturaConfiguration(drupalgap.settings.kaltura.partnerId);
    config.serviceUrl = drupalgap.settings.kaltura.serviceUrl;
    var client = new KalturaClient(config);
    var entryId = options.item.entryid;
    var version = null;
    var result = client.media.get(options.cb, entryId, version);
  }
  catch (error) { console.log('kaltura_media_get - ' + error); }
}

