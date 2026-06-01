<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ward;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $wards = Ward::latest()->paginate(10);

        return Inertia::render('Admin/Wards/Index', [
            'wards' => $wards,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Wards/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'number' => 'required|integer|unique:wards,number',
            'name' => 'nullable|string',
            'boundary' => 'nullable|json',
        ]);

        Ward::create($validated);

        return redirect()->back()->with('success', 'Ward created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $ward = Ward::findOrFail($id);
        return Inertia::render('Admin/Wards/Show', ['ward' => $ward]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $ward = Ward::findOrFail($id);
        return Inertia::render('Admin/Wards/Edit', ['ward' => $ward]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $ward = Ward::findOrFail($id);

        $validated = $request->validate([
            'number' => 'required|integer|unique:wards,number,' . $ward->id,
            'name' => 'nullable|string',
            'boundary' => 'nullable|json',
        ]);

        $ward->update($validated);

        return redirect()->back()->with('success', 'Ward updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $ward = Ward::findOrFail($id);
        $ward->delete();

        return redirect()->back()->with('success', 'Ward deleted.');
    }
}
