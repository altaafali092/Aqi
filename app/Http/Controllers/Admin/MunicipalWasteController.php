<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MunicipalWaste\StoreWasteRequest;
use App\Http\Requests\MunicipalWaste\UpdateWasteRequest;
use App\Models\MunicipalWaste;
use App\Models\Ward;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MunicipalWasteController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = MunicipalWaste::with('ward')->latest();

        // Scope the records if the user belongs to a specific ward
        if ($user && isset($user->ward_id)) {
            $query->where('ward_id', $user->ward_id);
        }

        $municipalWastes = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/MunicipalWastes/Index', [
            'municipalWastes' => $municipalWastes,
        ]);
    }

    public function create()
    {
        $wards = Ward::latest()->get();

        return Inertia::render('Admin/MunicipalWastes/Create', [
            'wards' => $wards,
        ]);
    }

    public function store(StoreWasteRequest $request)
    {
        MunicipalWaste::create($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Municipal waste record created successfully.']);

        return to_route('admin.municipal-wastes.index');
    }

    public function show(MunicipalWaste $municipalWaste)
    {
        return Inertia::render('Admin/MunicipalWastes/Show',
            [
                'municipalWaste' => $municipalWaste,
            ]);
    }

    public function edit(MunicipalWaste $municipalWaste)
    {
        $wards = Ward::all();

        return Inertia::render('Admin/MunicipalWastes/Edit', [
            'municipalWaste' => $municipalWaste,
            'wards' => $wards,
        ]);
    }

    public function update(UpdateWasteRequest $request, MunicipalWaste $municipalWaste)
    {
        $municipalWaste->update($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Municipal waste record updated successfully.']);

        return to_route('admin.municipal-wastes.index');
    }

    public function destroy(MunicipalWaste $municipalWaste)
    {
        $municipalWaste->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Municipal waste record deleted successfully.']);

        return back();
    }
}
