<?php

namespace Maruf89\CommunityDirectory\Email\Interfaces;

interface IMailer {
    public function send_mail( $to, $subject, $message, $headers = '', $attachments = array() ):bool;
}