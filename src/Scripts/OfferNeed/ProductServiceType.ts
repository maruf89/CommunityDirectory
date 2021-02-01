import debounce from 'Scripts/Helper/debounce';

export function requireProductService() {
    const $post = jQuery('#post');
    const $taxonomyContainer = jQuery(`#${cdData.taxonomyType.productService}div`).addClass('focusable')
    // The serialized form's key field
    const productServiceKey = `tax_input[${cdData.taxonomyType.productService}][]`;
    const validateHasTaxonomy = event => {
        event.preventDefault();
        var productServiceFields = jQuery('#post')
            .serializeArray()
            .filter(({name}) => name === productServiceKey)
            .filter(({value}) => value != '0');

        // Everything is valid
        if (productServiceFields.length) return $post.trigger('submit');

        console.log('missing tax');
        // Otherwise…

        jQuery([document.documentElement, document.body]).animate({
            scrollTop: $taxonomyContainer.offset().top + -100
        }, 250);

        setTimeout(() => $taxonomyContainer.addClass('focus'), 250);
        setTimeout(() => $taxonomyContainer.removeClass('focus'), 1250);

        $post.one('submit', validateHasTaxonomy);
    };

    $post.one('submit', validateHasTaxonomy);
}

export const classNames = {
    listParent: 'ps-parent',
    opened: 'opened',
};

export function breadcrumbProductServices() {
    const $container = jQuery(`#${cdData.taxonomyType.productService}checklist`);
    if (!$container.length) return;

    $container.children('li').each(applyChildBreadcrumb);

    $container.on('click', `.${classNames.listParent}`, debounce(event => {
        event.stopPropagation();
        if (jQuery(event.target).parent().hasClass(classNames.listParent)) {
            const ct = jQuery(event.currentTarget);
            ct.toggleClass(classNames.opened, !ct.hasClass(classNames.opened));
        }
    }, 250, true));
    
}

function applyChildBreadcrumb(index, possibleParent) {
    const $parent = jQuery(possibleParent);
    const $children = $parent.children('.children').children('li');
    if (!$children.length) return;

    $parent.addClass(classNames.listParent);

    $children.each(applyChildBreadcrumb);
}
