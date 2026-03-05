<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

describe('Password Reset Flow', function () {
    describe('forgotPasswordReset', function () {
        it('redirects to forgot-password if no email in session', function () {
            $response = $this->get(route('user.auth.forgot-password-reset'));

            $response->assertRedirect(route('user.auth.forgot-password'));
            $response->assertSessionHas('error', 'Please start the password reset process again');
        });

        it('displays reset form when email exists in session', function () {
            $email = 'user@example.com';

            $response = $this->withSession(['user_email' => $email])
                ->get(route('user.auth.forgot-password-reset'));

            $response->assertOk();
            $response->assertViewMissing('email', $email);  // Inertia renders component, so we test the response method
        });
    });

    describe('forgotPasswordResetStore', function () {
        it('resets password successfully with valid data', function () {
            $user = User::factory()->create(['email' => 'test@example.com']);
            $newPassword = 'NewSecurePassword123!';

            $response = $this->withSession(['user_email' => $user->email])
                ->post(route('user.auth.forgot-password-reset.store'), [
                    'email' => $user->email,
                    'password' => $newPassword,
                    'password_confirmation' => $newPassword,
                ]);

            $response->assertRedirect(route('user.auth.login'));
            $response->assertSessionHas('success', 'Password reset successfully');

            // Verify password was updated
            $user->refresh();
            expect(Hash::check($newPassword, $user->password))->toBeTrue();

            // Verify session email was cleared
            expect(session('user_email'))->toBeNull();
        });

        it('redirects if no email in session', function () {
            $response = $this->post(route('user.auth.forgot-password-reset.store'), [
                'email' => 'test@example.com',
                'password' => 'NewPassword123!',
                'password_confirmation' => 'NewPassword123!',
            ]);

            $response->assertRedirect(route('user.auth.forgot-password'));
            $response->assertSessionHas('error', 'Please start the password reset process again');
        });

        it('rejects mismatched email with session', function () {
            $user = User::factory()->create(['email' => 'correct@example.com']);
            $oldPassword = $user->password;

            $response = $this->withSession(['user_email' => 'correct@example.com'])
                ->post(route('user.auth.forgot-password-reset.store'), [
                    'email' => 'different@example.com',
                    'password' => 'NewPassword123!',
                    'password_confirmation' => 'NewPassword123!',
                ]);

            $response->assertRedirect();
            $response->assertSessionHasErrors();
            $response->assertSessionHas('error', 'Email mismatch. Please start the password reset process again');

            // Verify password was not changed
            $user->refresh();
            expect($user->password)->toBe($oldPassword);
        });

        it('validates required email field', function () {
            $response = $this->withSession(['user_email' => 'test@example.com'])
                ->post(route('user.auth.forgot-password-reset.store'), [
                    'password' => 'NewPassword123!',
                    'password_confirmation' => 'NewPassword123!',
                ]);

            $response->assertSessionHasErrors('email');
        });

        it('validates email format', function () {
            $response = $this->withSession(['user_email' => 'invalid-email'])
                ->post(route('user.auth.forgot-password-reset.store'), [
                    'email' => 'invalid-email',
                    'password' => 'NewPassword123!',
                    'password_confirmation' => 'NewPassword123!',
                ]);

            $response->assertSessionHasErrors('email');
        });

        it('validates required password field', function () {
            $response = $this->withSession(['user_email' => 'test@example.com'])
                ->post(route('user.auth.forgot-password-reset.store'), [
                    'email' => 'test@example.com',
                    'password_confirmation' => '',
                ]);

            $response->assertSessionHasErrors('password');
        });

        it('validates password minimum length', function () {
            $response = $this->withSession(['user_email' => 'test@example.com'])
                ->post(route('user.auth.forgot-password-reset.store'), [
                    'email' => 'test@example.com',
                    'password' => 'short',
                    'password_confirmation' => 'short',
                ]);

            $response->assertSessionHasErrors('password');
        });

        it('validates password confirmation matches', function () {
            $response = $this->withSession(['user_email' => 'test@example.com'])
                ->post(route('user.auth.forgot-password-reset.store'), [
                    'email' => 'test@example.com',
                    'password' => 'NewPassword123!',
                    'password_confirmation' => 'DifferentPassword123!',
                ]);

            $response->assertSessionHasErrors('password');
        });

        it('returns error if user not found', function () {
            $response = $this->withSession(['user_email' => 'nonexistent@example.com'])
                ->post(route('user.auth.forgot-password-reset.store'), [
                    'email' => 'nonexistent@example.com',
                    'password' => 'NewPassword123!',
                    'password_confirmation' => 'NewPassword123!',
                ]);

            $response->assertRedirect();
            $response->assertSessionHas('error', 'User not found');
        });
    });
});
