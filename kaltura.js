var kConfig = null;
var kClient = null;
var kSession = null;

/**
 *
 */
function kaltura_api_init() {
  try {
    if (!kConfig) {
      kConfig = new KalturaConfiguration(kaltura_partnerId_get());
      kConfig.serviceUrl = kaltura_serviceUrl_get();
      dpm('created a new kaltura config...');
    }
    else {
      dpm('using an existing kaltura config...');
    }
    if (!kClient) {
      kClient = new KalturaClient(kConfig);
      kClient.ks = kSession;
      dpm('created a new kaltura client...');
    }
    else {
      dpm('using an existing kaltura client...');
    }
  }
  catch (error) { console.log('kaltura_api_init - ' + error); }
}

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
 * Implements hook_form_alter().
 */
function kaltura_form_alter(form, form_state, form_id) {
  try {

    //drupalgap_alert(form_id); // Use to see the form id.
    //dpm(form);                // Use to inspect the form.

    // Try adding enctype to node edit form for uploading an image, not sure if
    // this is needed yet...
    if (form_id == 'node_edit') {
      form.options.attributes['enctype'] = 'multipart/form-data';
    }

  }
  catch (error) { console.log('my_module_form_alter - ' + error); }
}

/**
 * Implements hook_field_formatter_view().
 */
function field_kaltura_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    
    dpm('field_kaltura_field_formatter_view');
    
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
    var input_attrs = {
      type: 'file',
      id: 'field_kaltura_field_widget_file_input'
    };
    var html = '<input ' + drupalgap_attributes(input_attrs) + '>' +
      bl('Upload media', null, {
          attributes: {
            onclick: "kaltura_field_widget_click()"
          }
      });
    items[delta].markup = html;
  }
  catch (error) { console.log('field_kaltura_field_widget_form() - ' + error); }
}

/**
 *
 */
function kaltura_field_widget_click() {
  try {
    
    // Grab the file input from the DOM.
    var input = document.getElementById('field_kaltura_field_widget_file_input');
    console.log(input.files);
    
    // If we have a file...
    if (input.files && input.files[0]) {
      
      // Init the api.
      kaltura_api_init();
      
      // Let's first generate an upload token.
      var uploadToken = new KalturaUploadToken();
      uploadToken.fileName = input.value.split(/(\\|\/)/g).pop();
      
      // Build its success callback.
      var uploadTokenCallback = function(token_success, token_results) {
          
          console.log('back from server...');
          console.log(token_results);
          
          if (token_results.id) {
            
            // We've got the token...
            
            // Set up the upload success callback.
            var uploadCallback = function(upload_success, upload_results) {
              console.log('back from server...');
              console.log(upload_success);
              console.log(upload_results);
            }
            
            // Build the file reader to base 64 encode the image file data.
            /*var FR= new FileReader();
            FR.onload = function(e) {

              // Upload the file to the server.
              console.log('uploading file to server...');
              var resume = null;
              var finalChunk = null;
              var resumeAt = null;
              // @TODO - is the problem because this call is using a GET method?
              kClient.uploadToken.upload(uploadCallback, token_results.id, e.target.result, resume, finalChunk, resumeAt);

            };
            console.log('encoding image...');
            FR.readAsDataURL(input.files[0]);*/
            
            var reader = new FileReader(); 
            reader.onload = function(evt) {
              console.log('converting to binary...');
              var chars  = new Uint8Array(evt.target.result);
              var CHUNK_SIZE = 0x8000;
              var index = 0;
              var length = chars.length;
              var binary_result = '';
              var slice;
              while (index < length) {
                slice = chars.subarray(index, Math.min(index + CHUNK_SIZE, length)); 
                binary_result += String.fromCharCode.apply(null, slice);
                index += CHUNK_SIZE;
              }
              // Here you have file content as Binary String in binary_result var
              console.log('built binary, I think...');
              console.log(binary_result);
              console.log('uploading file to server...');
              var resume = null;
              var finalChunk = null;
              var resumeAt = null;
              // @TODO - is the problem because this call is using a GET method?
              kClient.uploadToken.upload(uploadCallback, token_results.id, evt.target.result, resume, finalChunk, resumeAt);
            };
            console.log('reading file as array buffer');
            reader.readAsArrayBuffer(input.files[0]);
            
            
            // 1_4362e915439642ad4394d02c619f4fe1
          }
          else {
            console.log('kaltura_field_widget_click - failed to get token from kaltura server!');
          }
          
      };
      
      // Send the token to the kaltura server.
      console.log('Created token, adding to server...');
      console.log(uploadToken);
      var result = kClient.uploadToken.add(uploadTokenCallback, uploadToken);
      
      
      
      
      
      
      
      
      
      
      
      
      
      return;
      
      
      
      
      
      
      
      //var uploadTokenId = ; // This is the file name.
      /*var resume = null;
      var finalChunk = null;
      var resumeAt = null;
      dpm('Uploading...');// (' + /uploadTokenId + ')');
      kClient.uploadToken.upload(function(success_upload, result_upload) {
          
          dpm('done.');
          console.log(result_upload);
          
          // Attach the Media Entry to the File:
          
          
      }, 'my super token', input.files[0].webkitRelativePath, resume, finalChunk, resumeAt);
      
      return;*/
      
      
      
      
      
      
      
      
      
      // Build a file reader.
      dpm('Building file reader...');
      var FR = new FileReader();
      
      // Prepare the onload function.
      FR.onload = function(e) {
        
        dpm('Done reading file...');
        console.log(e.target.result);
        
        
        var resume = null;
        var finalChunk = null;
        var resumeAt = null;
        dpm('Uploading...');// (' + /uploadTokenId + ')');
        kClient.uploadToken.upload(function(success_upload, result_upload) {
            
            dpm('done.');
            console.log(result_upload);
            
            // Attach the Media Entry to the File:
            
            
        }, 'my super token', e.target.result, resume, finalChunk, resumeAt);
        
        
        
        return;
        
        
        
        
        
        
        
        //$('#img').attr( "src", e.target.result );
        //$('#base').text( e.target.result );
       
        // Now that we've got the base 64 encoded version of the file...
       
        // Create a new Media Entry to which we'll attach the uploaded file:
        var entry = new KalturaMediaEntry();
        entry.name = "Media Entry Using JS";
        entry.mediaType = 2; // @see https://www.kaltura.com/api_v3/testmeDoc/index.php?object=KalturaMediaType
        console.log(entry);
        kClient.media.add(function(success_media, result_media) {
            if (success_media) {
              
              dpm('Added media...');
              console.log(result_media);
              
              //var fileStream = new FileStream("DemoVideo.flv", FileMode.Open, FileAccess.Read);
              
              // Get an upload token.
              
              var uploadToken = new KalturaUploadToken();
              kClient.uploadToken.add(function(success_token, result_token) {
                  
                  dpm('Got the token...');
                  console.log(result_token);
                  
                  //var fileData = e.target.result;
                  var fileData = input.value.split(/(\\|\/)/g).pop();
                  console.log(fileData);
                  var resume = null;
                  var finalChunk = null;
                  var resumeAt = null;
                  kClient.uploadToken.upload(function(success_upload, result_upload) {
                      
                      dpm('Done uploading...');
                      console.log(result_upload);
                      
                      // Attach the Media Entry to the File:
                      
                      
                  }, result_token, fileData, resume, finalChunk, resumeAt);
                  
                  
              }, uploadToken);
              
            }
            else {
              dpm('kaltura media add failed');
              dpm(result_media);
            }
        }, entry);

      };
      
      // Read the file data.
      dpm('Reading file data...');
      //FR.readAsDataURL(input.files[0]);
      FR.readAsArrayBuffer(input.files[0]);

    }
    else {
      drupalgap_alert('Choose a file to upload first!');
    }
    return;
    
    
    // @see http://knowledge.kaltura.com/faq/create-new-kaltura-entry-and-upload-video-file-using-kaltura-api
    
    
  }
  catch (error) { console.log('kaltura_field_widget_click - ' + error); }
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
    kaltura_api_init();
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

