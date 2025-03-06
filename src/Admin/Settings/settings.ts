let $:JQueryStatic;

export default function(_$:JQueryStatic) {
    $ = _$;

    if (!$('body.toplevel_page_community-directory').length) return;

    editLocationTable( $('.edit-locations-table') );
    if ( window.location.search.indexOf('tab=entity') > -1 ) entityListTable()
}

function entityListTable() {
    // Confirm user wants to delete an entity before doing so
    $('#the-list').on('click', '.row-actions .delete, .row-actions .delete_entire', event => {
        const title = $(event.currentTarget).closest('.title').children('a')[0].innerText;
        if (!window.confirm('Are you sure you want to delete entity ' + title + '?')) {
            event.preventDefault();
            return false;
        }
    });
}

function editLocationTable ($table:JQuery<HTMLElement>) {
    if (!$table.length) return;
    
    const $form:JQuery<HTMLElement> = $('#mainform');
    let newFieldId:number = 1;
    
    $('.table-add').on('click', function () {
        const cloneId:number = newFieldId++;
        const $clone = $table.find('tr.hide').clone(true).removeClass('hide table-line');
        $clone.find('.edit-field').each(function (index:number, el:HTMLInputElement) {
            el.name = el.name.substr(0, el.name.length - 1) + cloneId + ']';

            // Must add changed to new status field so it gets submitted
            if ($(el).hasClass('edit-status')) $(el).addClass('changed');
        });
        $table.append($clone);
        $clone.find('.edit-name').trigger('focus');
    });

    // Deletes locations via ajax
    $('.table-remove').on('click', function () {

    if (!confirm(cdData.translations.deleteLocation)) return;

    var locId = $(this).closest('tr')[0].dataset.locationId;

    var data = {
        location_id: locId,
        action: 'location_delete',
    };

    var $this = this;

    $.post(cdData.ajaxUrl, data,
        function(response, result) {
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
        $table.find('.edit-field:not(.changed)').detach();

        $form.off('submit', submit).trigger('submit');
    }
    
    $form.on('submit', submit);
};