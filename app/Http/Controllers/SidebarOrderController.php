<?php

namespace App\Http\Controllers;

use App\Models\SidebarOrder;
use Illuminate\Http\Request;

class SidebarOrderController extends Controller
{
    /**
     * Return the single, app-wide sidebar order shared by all users.
     */
    public function show()
    {
        $order = SidebarOrder::latest('updated_at')->first();

        return response()->json([
            'order' => $order?->order ?? [],
        ]);
    }

    /**
     * Persist one global sidebar order for every user.
     */
    public function update(Request $request)
    {
        $data = $request->validate([
            'order' => 'required|array',
            'order.*' => 'string',
        ]);

        $global = SidebarOrder::latest('updated_at')->first();

        if ($global) {
            $global->update(['order' => $data['order']]);
            SidebarOrder::whereKeyNot($global->id)->delete();
        } else {
            SidebarOrder::create([
                'user_id' => auth()->id(),
                'order' => $data['order'],
            ]);
        }

        return response()->json(['message' => 'Order saved']);
    }
}