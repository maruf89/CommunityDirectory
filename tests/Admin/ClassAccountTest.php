<?php

namespace Maruf89\CommunityDirectory\Tests\Admin;

require __DIR__ . '/../../vendor/autoload.php';


use Maruf89\CommunityDirectory\Admin\ClassAccount;
use Maruf89\CommunityDirectory\Admin\Settings\ClassUWPFormBuilder;
use Maruf89\CommunityDirectory\Includes\instances\Entity;
use PHPUnit\Framework\TestCase;

class ClassAccountTest extends TestCase {

    public function testValidateUserRegistrationBefore() {
        $classAccount = new ClassAccount();

        // Mock data for testing
        $errors = new \WP_Error();
        $data = array(
            ClassUWPFormBuilder::$community_directory_location_name => 'Test Location',
            // Add other required data for the test
        );
        $validationType = 'register';

        // Call the method to test
        $result = $classAccount->validate_user_registration_before($errors, $data, $validationType);

        // Assertions
        // Perform assertions based on the expected behavior of your method
        $this->assertInstanceOf(\WP_Error::class, $result);
    }

    public function testSaveDataToUserMeta() {
        $classAccount = new ClassAccount();

        // Mock data for testing
        $data = array(
            ClassUWPFormBuilder::$community_directory_location_name => 'Test Location',
            // Add other required data for the test
        );
        $validationType = 'register';
        $userId = 123; // Replace with an actual user ID

        // Call the method to test
        $result = $classAccount->save_data_to_user_meta($data, $validationType, $userId);

        // Assertions
        // Perform assertions based on the expected behavior of your method
        $this->assertIsArray($result);
    }

    public function testCheckFirstLogin() {
        // Mock WP_User
        $userId = 123; // Replace with an actual user ID
        $wpUser = $this->createMock(\WP_User::class);
        $wpUser->expects($this->any())
               ->method('ID')
               ->willReturn($userId);

        // Mock Entity
        $entity = $this->createMock(Entity::class);
        $entity->expects($this->any())
               ->method('get_instance')
               ->willReturn($entity);

        // Mock update_user_meta and apply_filters
        $wpdb = $this->getMockBuilder('wpdb')
                     ->setMethods(['update', 'get_results'])
                     ->getMock();

        $wpdb->expects($this->any())
             ->method('update')
             ->willReturn(true);

        $wpdb->expects($this->any())
             ->method('get_results')
             ->willReturn(['redirect_link']); // Replace with an actual value

        global $wpdb;
        $GLOBALS['wpdb'] = $wpdb;

        // Mock wp_redirect and do_action
        $classAccount = $this->getMockBuilder(ClassAccount::class)
                            ->setMethods(['wp_redirect', 'do_action'])
                            ->getMock();

        $classAccount->expects($this->once())
                     ->method('wp_redirect')
                     ->with('redirect_link');

        $classAccount->expects($this->exactly(2))
                     ->method('do_action');

        // Call the method to test
        $classAccount->check_first_login('test_user', $wpUser);

        // Assertions
        // Perform assertions based on the expected behavior of your method
        // (e.g., check that wp_redirect and do_action were called as expected)
    }

}
