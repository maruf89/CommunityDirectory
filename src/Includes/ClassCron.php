<?php

namespace Maruf89\CommunityDirectory\Includes;

class ClassCron {
    public static string $cron_twice_daily = 'cd_cron_hook';
    
    private static ClassCron $instance;

    public static function get_instance() {
        if ( !isset( self::$instance ) )
            self::$instance = new ClassCron();
 
        return self::$instance;
    }

    public static function deactivate() {
        $timestamp = wp_next_scheduled( static::$cron_twice_daily );
        wp_unschedule_event( $timestamp, static::$cron_twice_daily );
    }


}