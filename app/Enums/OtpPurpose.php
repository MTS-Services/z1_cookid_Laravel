<?php

namespace App\Enums;

enum OtpPurpose: string
{
    case LOGIN = 'login';
    case REGISTER = 'register';
    case RESET_PASSWORD = 'reset_password';
}