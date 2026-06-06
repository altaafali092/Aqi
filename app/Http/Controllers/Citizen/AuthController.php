<?php

namespace App\Http\Controllers\Citizen;

use App\Http\Controllers\Controller;
use App\Http\Requests\Citizen\CitizenRequest;
use App\Http\Requests\Citizen\LoginRequest;
use App\Models\User;
use App\Models\Ward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function citizenRegisterPage()
    {
        return Inertia::render('auth/citizenRegister', [
            'wards' => Ward::all(),
        ]);
    }

    public function citizenRegisterStore(CitizenRequest $request)
    {
        $data = $request->validated();

        $citizen = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'ward_id' => $data['ward_id'],
            'phone' => $data['phone'],
            'password' => Hash::make($data['password']),
            'role' => 'citizen',
            'status' => 'active',
        ]);

        Auth::guard('citizen')->login($citizen);

        session()->flash('toast', [
            'type' => 'success',
            'message' => 'Registered Successfully.',
        ]);

        return to_route('admin.dashboard');
    }

    public function citizenLoginPage()
    {
        return Inertia::render('auth/citizenLogin');
    }

    public function citizenLogin(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::guard('citizen')->attempt($credentials)) {
            $request->session()->regenerate();

            session()->flash('toast', [
                'type' => 'success',
                'message' => 'Login Successful.',
            ]);

            return to_route('admin.dashboard');
        }

        session()->flash('toast', [
            'type' => 'error',
            'message' => 'Login Failed',
        ]);

        return back();
    }

    public function citizenLogout(Request $request)
    {
        Auth::guard('citizen')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        session()->flash('toast', [
            'type' => 'success',
            'message' => 'Logout Successful.',
        ]);

        return to_route('home');
    }
}
