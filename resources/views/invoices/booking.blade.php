<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{ $booking->invoice_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: #333;
            background: #fff;
        }
        .invoice {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            border-bottom: 2px solid #e5e5e5;
            padding-bottom: 20px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #16a34a;
        }
        .invoice-info {
            text-align: right;
        }
        .invoice-info h1 {
            font-size: 28px;
            color: #333;
            margin-bottom: 5px;
        }
        .invoice-info p {
            color: #666;
        }
        .details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
        }
        .details-section h3 {
            font-size: 12px;
            text-transform: uppercase;
            color: #999;
            margin-bottom: 8px;
        }
        .details-section p {
            margin-bottom: 4px;
        }
        .tour-details {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .tour-details h2 {
            font-size: 18px;
            margin-bottom: 15px;
        }
        .tour-meta {
            display: flex;
            gap: 30px;
            color: #666;
            font-size: 13px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th {
            background: #f3f4f6;
            text-align: left;
            padding: 12px;
            font-size: 12px;
            text-transform: uppercase;
            color: #666;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #e5e5e5;
        }
        .text-right {
            text-align: right;
        }
        .totals {
            margin-left: auto;
            width: 300px;
        }
        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e5e5;
        }
        .totals-row.total {
            border-bottom: none;
            font-size: 18px;
            font-weight: bold;
            color: #16a34a;
            padding-top: 15px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
            text-align: center;
            color: #999;
            font-size: 12px;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge-success {
            background: #dcfce7;
            color: #16a34a;
        }
        .badge-pending {
            background: #fef3c7;
            color: #d97706;
        }
    </style>
</head>
<body>
    <div class="invoice">
        <div class="header">
            <div class="logo">Ubuntu Sunshine Tours</div>
            <div class="invoice-info">
                <h1>INVOICE</h1>
                <p><strong>{{ $booking->invoice_number }}</strong></p>
                <p>Date: {{ $booking->invoice_generated_at ? \Carbon\Carbon::parse($booking->invoice_generated_at)->format('F j, Y') : now()->format('F j, Y') }}</p>
            </div>
        </div>

        <div class="details">
            <div class="details-section">
                <h3>Billed To</h3>
                <p><strong>{{ $booking->customer_name }}</strong></p>
                <p>{{ $booking->customer_email }}</p>
                @if($booking->customer_phone)
                <p>{{ $booking->customer_phone }}</p>
                @endif
                @if($booking->customer_country)
                <p>{{ $booking->customer_country }}</p>
                @endif
            </div>
            <div class="details-section">
                <h3>Booking Reference</h3>
                <p><strong>{{ $booking->booking_reference }}</strong></p>
                <p>Status: 
                    <span class="badge {{ $booking->payment_status === 'paid' ? 'badge-success' : 'badge-pending' }}">
                        {{ ucfirst($booking->payment_status) }}
                    </span>
                </p>
            </div>
        </div>

        <div class="tour-details">
            <h2>{{ $booking->tour->title }}</h2>
            <div class="tour-meta">
                <span>📍 {{ $booking->tour->location?->name }}</span>
                <span>📅 {{ \Carbon\Carbon::parse($booking->tour_date)->format('l, F j, Y') }}</span>
                <span>⏱️ {{ $booking->tour->duration }}</span>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th class="text-right">Qty</th>
                    <th class="text-right">Price</th>
                    <th class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach($booking->participants as $participant)
                <tr>
                    <td>{{ $participant['tier'] ?? 'Participant' }}</td>
                    <td class="text-right">{{ $participant['quantity'] }}</td>
                    <td class="text-right">R {{ number_format($participant['price'], 2) }}</td>
                    <td class="text-right">R {{ number_format($participant['quantity'] * $participant['price'], 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals">
            <div class="totals-row">
                <span>Subtotal</span>
                <span>R {{ number_format($booking->subtotal, 2) }}</span>
            </div>
            @if($booking->discount > 0)
            <div class="totals-row">
                <span>Discount @if($booking->discount_code)({{ $booking->discount_code }})@endif</span>
                <span>-R {{ number_format($booking->discount, 2) }}</span>
            </div>
            @endif
            @if($booking->tax > 0)
            <div class="totals-row">
                <span>VAT (15%)</span>
                <span>R {{ number_format($booking->tax, 2) }}</span>
            </div>
            @endif
            <div class="totals-row total">
                <span>Total</span>
                <span>R {{ number_format($booking->total, 2) }}</span>
            </div>
        </div>

        <div class="footer">
            <p>Ubuntu Sunshine Tours</p>
            <p>info@ubuntusunshinetours.co.za | +27 12 345 6789</p>
            <p>Thank you for booking with us!</p>
        </div>
    </div>
</body>
</html>
