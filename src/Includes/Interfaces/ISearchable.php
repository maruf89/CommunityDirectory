<?php

namespace Maruf89\CommunityDirectory\Includes\Interfaces;

interface ISearchable {
    public function get_search_fields( string $type, array $taxonomy = null ):array;

    public function render_search_results( array $items, string $search ):string;
}