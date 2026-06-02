<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ward\StoreWardRequest;
use App\Http\Requests\Ward\UpdateWardRequest;
use App\Models\Ward;
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
    public function store(StoreWardRequest $request)
    {
        Ward::create($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Ward created successfully.']);

        return to_route('admin.wards.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Ward $ward)
    {
        return Inertia::render('Admin/Wards/Show', ['ward' => $ward]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ward $ward)
    {
        return Inertia::render('Admin/Wards/Edit', ['ward' => $ward]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWardRequest $request, Ward $ward)
    {

        $ward->update($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Ward updated successfully.']);

        return to_route('admin.wards.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ward $ward)
    {

        $ward->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Ward deleted successfully.']);
        return back();  
    }
}
