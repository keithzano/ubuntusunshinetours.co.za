<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{ $booking->invoice_number }}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #00AEF1;
            padding-bottom: 20px;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .logo-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #00AEF1 0%, #0086B3 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-shadow: 0 2px 8px rgba(0, 174, 241, 0.3);
        }
        
        .logo-icon::before {
            content: "☀";
            color: white;
            font-size: 24px;
            font-weight: bold;
        }
        
        .logo-text {
            font-size: 24px;
            font-weight: bold;
            color: #00AEF1;
            line-height: 1;
        }
        
        .logo-text span {
            color: #333;
            font-weight: normal;
        }
        
        .invoice-details {
            text-align: right;
        }
        
        .invoice-number {
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }
        
        .invoice-date {
            color: #666;
            font-size: 14px;
        }
        
        .billing-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        
        .billing-info, .tour-info {
            width: 48%;
        }
        
        .section-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
            font-size: 16px;
        }
        
        .info-item {
            margin-bottom: 5px;
            color: #555;
            font-size: 14px;
        }
        
        .booking-details {
            margin-bottom: 30px;
        }
        
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        .details-table th {
            background-color: #f8f9fa;
            padding: 12px;
            text-align: left;
            border-bottom: 2px solid #dee2e6;
            font-weight: bold;
            color: #333;
        }
        
        .details-table td {
            padding: 12px;
            border-bottom: 1px solid #dee2e6;
        }
        
        .details-table .text-right {
            text-align: right;
        }
        
        .summary-section {
            margin-top: 20px;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .summary-row.total {
            font-weight: bold;
            font-size: 16px;
            border-top: 2px solid #dee2e6;
            padding-top: 10px;
            margin-top: 10px;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-paid {
            background-color: #d4edda;
            color: #155724;
        }
        
        .status-confirmed {
            background-color: #d1ecf1;
            color: #0c5460;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        
        .contact-info {
            margin-bottom: 20px;
        }
        
        .contact-item {
            margin-bottom: 5px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">
                <div class="logo-icon"></div>
                <div class="logo-text">
                    Ubuntu <span>Sunshine Tours</span>
                </div>
            </div>
            <div class="invoice-details">
                <div class="invoice-number">Invoice #{{ $booking->invoice_number }}</div>
                <div class="invoice-date">Date: {{ $booking->invoice_generated_at->format('d M Y') }}</div>
            </div>
        </div>

        <!-- Billing Information -->
        <div class="billing-section">
            <div class="billing-info">
                <div class="section-title">Bill To:</div>
                <div class="info-item">{{ $booking->customer_name }}</div>
                <div class="info-item">{{ $booking->customer_email }}</div>
                @if($booking->customer_phone)
                    <div class="info-item">{{ $booking->customer_phone }}</div>
                @endif
                @if($booking->customer_country)
                    <div class="info-item">{{ $booking->customer_country }}</div>
                @endif
            </div>
            
            <div class="tour-info">
                <div class="section-title">Tour Details:</div>
                <div class="info-item">{{ $booking->tour->title }}</div>
                <div class="info-item">Date: {{ \Carbon\Carbon::parse($booking->tour_date)->format('d M Y') }}</div>
                @if($booking->tour_time)
                    <div class="info-item">Time: {{ $booking->tour_time }}</div>
                @endif
                <div class="info-item">Location: {{ $booking->tour->location->name }}</div>
            </div>
        </div>

        <!-- Booking Details -->
        <div class="booking-details">
            <div class="section-title">Booking Details</div>
            <table class="details-table">
                <thead>
                    <tr>
                        <th>Reference</th>
                        <th>Participants</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($booking->participants as $participant)
                        <tr>
                            <td>{{ $booking->booking_reference }}</td>
                            <td>{{ $participant['quantity'] }} x {{ $participant['name'] }}</td>
                            <td>R {{ number_format($participant['price'], 2) }}</td>
                            <td>{{ $participant['quantity'] }}</td>
                            <td class="text-right">R {{ number_format($participant['price'] * $participant['quantity'], 2) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <!-- Special Requirements -->
            @if($booking->special_requirements)
                <div style="margin-bottom: 20px;">
                    <div class="section-title">Special Requirements:</div>
                    <div class="info-item">{{ $booking->special_requirements }}</div>
                </div>
            @endif
        </div>

        <!-- Summary -->
        <div class="summary-section">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>R {{ number_format($booking->subtotal, 2) }}</span>
            </div>
            
            @if($booking->discount > 0)
                <div class="summary-row" style="color: #28a745;">
                    <span>Discount:</span>
                    <span>-R {{ number_format($booking->discount, 2) }}</span>
                </div>
            @endif
            
            <div class="summary-row">
                <span>Tax:</span>
                <span>R {{ number_format($booking->tax, 2) }}</span>
            </div>
            
            <div class="summary-row total">
                <span>Total Amount:</span>
                <span>R {{ number_format($booking->total, 2) }}</span>
            </div>
        </div>

        <!-- Status Information -->
        <div style="margin-top: 30px; display: flex; gap: 10px;">
            <span class="status-badge status-confirmed">{{ $booking->status }}</span>
            <span class="status-badge status-paid">{{ $booking->payment_status }}</span>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="contact-info">
                <div class="contact-item"><strong>Ubuntu Sunshine Tours</strong></div>
                <div class="contact-item">Email: info@ubuntusunshinetours.co.za</div>
                <div class="contact-item">Phone: +27 21 123 4567</div>
                <div class="contact-item">Website: www.ubuntusunshinetours.co.za</div>
            </div>
            <div>
                <p>Thank you for choosing Ubuntu Sunshine Tours!</p>
                <p>This is a tax invoice for your booking.</p>
            </div>
        </div>
    </div>
</body>
</html>
