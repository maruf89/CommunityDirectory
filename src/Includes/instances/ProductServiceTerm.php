<?php
/**
 *
 * ProductServiceTerm instance
 *
 * @author     Marius Miliunas
 */

namespace Maruf89\CommunityDirectory\Includes\instances;

use Maruf89\CommunityDirectory\Includes\ClassOffersNeeds;
use Maruf89\CommunityDirectory\Includes\Abstracts\Term;

class ProductServiceTerm extends Term {

    public static string $slug;

    /**
     * To be called upon taxonomy registration long before any instance is required
     */
    public static function define_taxonomy_term( string $slug ) {
        static::$slug = $slug;
    }

}