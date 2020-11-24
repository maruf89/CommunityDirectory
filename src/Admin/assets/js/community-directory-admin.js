(function ($) {

  function editLocationTable($table) {
    $form = $('#mainform');
    newFieldId = 1;
    
    $('.table-add').click(function () {
      var cloneId = newFieldId++;
      var $clone = $table.find('tr.hide').clone(true).removeClass('hide table-line');
      $clone.find('.edit-field').each(function (index, el) {
        el.name = el.name.substr(0, el.name.length - 1) + cloneId + ']';

        // Must add changed to new status field so it gets submitted
        if ($(el).hasClass('edit-status')) $(el).addClass('changed');
      });
      $table.append($clone);
      $clone.find('.edit-name').focus();
    });
  
    // Deletes locations via ajax
    $('.table-remove').click(function () {

      if (!confirm(ajaxObject.translations.deleteLocation)) {
        return;
      }

      var locId = $(this).closest('tr')[0].dataset.locationId;

      var data = {
        location_id: locId,
        action: 'location_delete',
      };

      var $this = this;

      $.post(ajaxurl, data, function(response, result) {
        if (result == 'success') {
          $($this).closest('tr').detach();
          alert(response);
        }
      });
      
    });


    $table.on('change', '.edit-name', {}, function (e) {
      // Add changed class if new text doesn't match original value
      var hasChanged = e.target.dataset.originalValue != e.target.value;
      $(this).toggleClass('changed', hasChanged);
    });

    $table.on('change', '.edit-status', function (e) {
      var hasChanged = e.target.dataset.originalValue != e.target.value;
      $(this).toggleClass('changed', hasChanged);
    });

    function submit (e) {
      e.originalEvent.preventDefault();

      // Detach all unchanged fields
      $table.find('.edit-field:not(.changed)').detach()

      $form.off('submit', submit).trigger('submit');
    }
    
    $form.on('submit', submit);
  }

  var $table = $('.edit-locations-table');
  if ($table.length) editLocationTable($table);
  

})(jQuery);
