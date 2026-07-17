<?php

namespace App\Http\Controllers;

use App\Models\SidebarOrder;
use Illuminate\Http\Request;

class SidebarOrderController extends Controller
{
    public function show()
    {
        $order = SidebarOrder::where('user_id', auth()->id())->first();

        return response()->json([
            'order' => $order?->order ?? [],
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'order' => 'required|array',
            'order.*' => 'string',
        ]);

        SidebarOrder::updateOrCreate(
            ['user_id' => auth()->id()],
            ['order' => $data['order']],
        );

        return response()->json(['message' => 'Order saved']);
    }
}
