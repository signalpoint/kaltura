/**
 * Implements hook_install().
 */
function kaltura_install() {
  try {
    drupalgap_add_js('app/libraries/kaltura/kaltura.min.js');
  }
  catch (error) { console.log('kaltura_install - ' + error); }
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
