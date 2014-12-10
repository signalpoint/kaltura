var kConfig = null;
var kClient = null;
var kSession = null;

/**
 * Implements hook_install().
 */
function kaltura_install() {
  try {
    drupalgap_add_js('app/libraries/kaltura/kaltura.min.js');
    kaltura_session_start({
        success: function(result) {
          if (result && result[0]) { kSession = result[0]; }
          else { console.log('kaltura_install - failed to start session!'); }
        }
    });
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
        success: function(success, data) {
          if (success) {
            $('#' + data.id).html(theme('image', { path: data.dataUrl })).trigger('create');
          }
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
 * Each request needs a new KalturaClient generated (I think).
 */
 
/**
 * Starts a Kaltura session, and saves the session id in the KS string.
 */
function kaltura_session_start(options) {
  try {
    options.method = 'POST';
    options.path = 'kaltura/session_start.json';
    options.service = 'kaltura';
    options.resource = 'session_start';
    Drupal.services.call(options);
  }
  catch (error) { console.log('kaltura_session_start - ' + error); }
}

/**
 *
 */
function kaltura_media_get(options) {
  try {
    kConfig = new KalturaConfiguration(kaltura_partnerId_get());
    kConfig.serviceUrl = kaltura_serviceUrl_get();
    kClient = new KalturaClient(kConfig);
    kClient.ks = kSession;
    kClient.media.get(options.success, options.item.entryid);
  }
  catch (error) { console.log('kaltura_media_get - ' + error); }
}

/**********|
 * HELPERS |
 **********/

/**
 *
 */
function kaltura_partnerId_get() {
  try {
    return drupalgap.settings.kaltura.partnerId;
  }
  catch (error) { console.log('kaltura_partnerId_get - ' + error); }
}

/**
 *
 */
function kaltura_serviceUrl_get() {
  try {
    return drupalgap.settings.kaltura.serviceUrl;
  }
  catch (error) { console.log('kaltura_serviceUrl_get - ' + error); }
}

