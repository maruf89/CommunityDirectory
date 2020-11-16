<?php
   /*
   Plugin Name: Community Directory
   Plugin URI: http://www.priemuses.lt
   description: A plugin to connect communities.
   Version: 0.1
   Author: Marius V. Miliunas
   Author URI: http://www.maruf-hops-maps.com
   License: GPL2
   */
   
   if ( ! defined( 'COMMUNITY_DIRECTORY_NAME' ) ) {
    define( 'COMMUNITY_DIRECTORY_NAME', 'community-directory' );
  }

  if ( ! defined( 'COMMUNITY_DIRECTORY_VERSION' ) ) {
    define( 'COMMUNITY_DIRECTORY_VERSION', '0.0.1' );
  }
  if ( ! defined( 'COMMUNITY_DIRECTORY_DB_VERSION' ) ) {
    define( 'COMMUNITY_DIRECTORY_DB_VERSION', '0.0.1' );
  }

  if ( ! defined( 'COMMUNITY_DIRECTORY_PATH' ) ) {
    define( 'COMMUNITY_DIRECTORY_PATH', plugin_dir_path( __FILE__ ) );
  }

  if ( ! defined( 'COMMUNITY_DIRECTORY_PLUGIN_URL' ) ) {
    define( 'COMMUNITY_DIRECTORY_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
  }

  if ( ! defined( 'COMMUNITY_DIRECTORY_PLUGIN_FILE' ) ) {
    define( 'COMMUNITY_DIRECTORY_PLUGIN_FILE', __FILE__ );
  }

  if ( ! class_exists( 'CommunityDirectory' ) ) {
    include_once dirname( __FILE__ ) . '/includes/class-community-directory.php';
  }

  function run_community_directory() {
    global $communitydirectory;
    $communitydirectory = new Community_Directory_Plugin();
  }

  run_community_directory();

?>
