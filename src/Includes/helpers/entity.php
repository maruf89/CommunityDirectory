<?php

use Maruf89\CommunityDirectory\Includes\instances\Entity;

function cd_is_entity_user():bool {
    return !!Entity::get_active_entity();
}