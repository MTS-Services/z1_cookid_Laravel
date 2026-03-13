<?php

namespace App\Enums;

enum OtpPurpose: string
{
    case LOGIN = 'login';
    case REGISTER = 'register';
    case PASSWORD_RESET = 'password_reset';
    case PAYOUT_ACCOUNT = 'payout_account';
}
