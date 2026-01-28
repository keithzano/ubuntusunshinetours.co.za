<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    public function index(): Response
    {
        $locations = Location::withCount('tours')->get();

        return Inertia::render('admin/locations/index', [
            'locations' => $locations,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/locations/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:255',
            'country' => 'required|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'image' => 'nullable|image|max:2048|mimes:jpeg,png,jpg,gif',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        
        // Handle boolean checkboxes - convert "on" to boolean after validation
        $validated['is_active'] = $request->boolean('is_active');
        $validated['is_featured'] = $request->boolean('is_featured');

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('locations', 'public');
        }

        Location::create($validated);

        return redirect()->route('admin.locations.index')->with('success', 'Location created');
    }

    public function edit(Location $location): Response
    {
        return Inertia::render('admin/locations/edit', [
            'location' => $location,
        ]);
    }

    public function update(Request $request, Location $location)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:255',
            'country' => 'required|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'image' => 'nullable|image|max:2048|mimes:jpeg,png,jpg,gif',
        ]);

        if ($validated['name'] !== $location->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        
        // Handle boolean checkboxes - convert "on" to boolean after validation
        $validated['is_active'] = $request->boolean('is_active');
        $validated['is_featured'] = $request->boolean('is_featured');

        if ($request->hasFile('image')) {
            if ($location->image) {
                Storage::disk('public')->delete($location->image);
            }
            $validated['image'] = $request->file('image')->store('locations', 'public');
        }

        $location->update($validated);

        return redirect()->route('admin.locations.index')->with('success', 'Location updated');
    }

    public function destroy(Location $location)
    {
        if ($location->tours()->count() > 0) {
            return back()->with('error', 'Cannot delete location with tours');
        }

        if ($location->image) {
            Storage::disk('public')->delete($location->image);
        }

        $location->delete();

        return back()->with('success', 'Location deleted');
    }
}
