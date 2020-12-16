<?php
   /*
   Plugin Name: Community Directory
   Plugin URI: http://www.priemuses.lt
   description: A plugin to connect communities.
   Version: 2020.11
   Author: Marius V. Miliunas
   Author URI: http://www.maruf-hops-maps.com
   Text Domain: community-directory
   License: GPL2
   */

   namespace Maruf89\CommunityDirectory;
   
   if ( ! defined( 'COMMUNITY_DIRECTORY_NAME' ) ) {
    define( 'COMMUNITY_DIRECTORY_NAME', 'community-directory' );
  }

  if ( ! defined( 'COMMUNITY_DIRECTORY_VERSION' ) ) {
    define( 'COMMUNITY_DIRECTORY_VERSION', '0.0.1' );
  }

  if ( ! defined( 'COMMUNITY_DIRECTORY_VERSION_SINGLE_NUM' ) ) {
    define( 'COMMUNITY_DIRECTORY_VERSION_SINGLE_NUM', '0' );
  }
  if ( ! defined( 'COMMUNITY_DIRECTORY_DB_VERSION' ) ) {
    define( 'COMMUNITY_DIRECTORY_DB_VERSION', '0.0.1' );
  }

  if ( ! defined( 'COMMUNITY_DIRECTORY_PATH' ) ) {
    define( 'COMMUNITY_DIRECTORY_PATH', plugin_dir_path( __FILE__ ) );
  }

  if ( ! defined( 'COMMUNITY_DIRECTORY_INCLUDES_PATH' ) ) {
    define( 'COMMUNITY_DIRECTORY_INCLUDES_PATH', plugin_dir_path( __FILE__ ) . 'src/Includes/' );
  }

  if ( ! defined( 'COMMUNITY_DIRECTORY_ADMIN_PATH' ) ) {
    define( 'COMMUNITY_DIRECTORY_ADMIN_PATH', plugin_dir_path( __FILE__ ) . 'src/Admin/' );
  }

  if ( ! defined( 'COMMUNITY_DIRECTORY_TEMPLATES_PATH' ) ) {
    define( 'COMMUNITY_DIRECTORY_TEMPLATES_PATH', plugin_dir_path( __FILE__ ) . 'src/views/' );
  }

  if ( ! defined( 'COMMUNITY_DIRECTORY_PLUGIN_URL' ) ) {
    define( 'COMMUNITY_DIRECTORY_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
  }

  if ( ! defined( 'COMMUNITY_DIRECTORY_PLUGIN_FILE' ) ) {
    define( 'COMMUNITY_DIRECTORY_PLUGIN_FILE', __FILE__ );
  }

  // include the Composer autoload file
  require 'vendor/autoload.php';
  use Maruf89\CommunityDirectory\Includes\ClassCommunityDirectory;

  // if ( ! class_exists( 'CommunityDirectory' ) ) {
  //   include_once dirname( __FILE__ ) . '/includes/class-community-directory.php';
  // }

  function run_community_directory() {
    global $communitydirectory;
    $communitydirectory = new ClassCommunityDirectory();
  }

  run_community_directory();

?>
