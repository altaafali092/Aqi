<?php

namespace App\Http\Controllers\Citizen;

use App\Http\Controllers\Controller;
use App\Http\Requests\Citizen\CitizenRequest;
use App\Http\Requests\Citizen\LoginRequest;
use App\Models\Citizen;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController extends Controller
{
    //
    public function citizenRegisterPage()
    {
        return Inertia::render('auth/citizenRegister');
    }
    public function citizenRegisterStore(CitizenRequest $request)
    {

        $citizen = Citizen::create($request->validated());
        Auth::guard('citizen')->login($citizen);
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Citizen registered successfully.']);

        return to_route('home');
    }
    public function    citizenLoginPage()
    {
        return Inertia::render('auth/citizenLogin');
    }

    public function citizenLogin(LoginRequest $request)
    {
        if (Auth::guard('citizen')->attempt($request->only(
            'email',
            'password',
            'ward_no'
        ))) {
            $request->session()->regenerate();
            Inertia::flash('toast', ['type' => 'success', 'message' => 'Login Successfull.']);

            return to_route('home');
        }
        Inertia::flash('toast', ['type' => 'error', 'message' => 'Login Failed']);
        return back();
    }

    public function citizenLogout(Request $request)
    {
        Auth::guard('citizen')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Logout Successful.']);

        return to_route('home');
    }
}
