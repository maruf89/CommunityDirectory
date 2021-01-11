<?php

namespace Maruf89\CommunityDirectory\Includes\Interfaces;

interface ISearchable {
    public function get_meta_search_fields():array;

    public function render_search_results( array $items, string $search ):string;
}