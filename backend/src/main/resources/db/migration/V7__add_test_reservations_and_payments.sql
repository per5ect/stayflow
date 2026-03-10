INSERT INTO reservations (renter_id, apartment_id, check_in, check_out, total_price, status, landlord_message, created_at, updated_at)
VALUES
    (2, 1,  '2026-08-01', '2026-08-05', 400.00,  'PENDING',   null,          NOW(), NOW()),
    (2, 2,  '2026-08-10', '2026-08-15', 425.00,  'APPROVED',  'Welcome!',    NOW(), NOW()),
    (2, 3,  '2026-08-20', '2026-08-25', 1750.00, 'DECLINED',  'Sorry, busy', NOW(), NOW()),
    (2, 4,  '2026-09-01', '2026-09-03', 60.00,   'CANCELLED', null,          NOW(), NOW()),
    (2, 5,  '2026-09-10', '2026-09-15', 1000.00, 'PAID',      'Welcome!',    NOW(), NOW()),
    (2, 6,  '2026-09-20', '2026-09-25', 600.00,  'APPROVED',  'Welcome!',    NOW(), NOW()),
    (2, 7,  '2026-10-01', '2026-10-03', 50.00,   'PENDING',   null,          NOW(), NOW()),
    (2, 8,  '2026-10-10', '2026-10-15', 2500.00, 'PAID',      'Enjoy!',      NOW(), NOW()),
    (2, 9,  '2026-10-20', '2026-10-25', 325.00,  'APPROVED',  'Welcome!',    NOW(), NOW()),
    (2, 10, '2026-11-01', '2026-11-05', 1120.00, 'CANCELLED', null,          NOW(), NOW()),
    (2, 11, '2026-11-10', '2026-11-15', 275.00,  'PENDING',   null,          NOW(), NOW()),
    (2, 12, '2026-11-20', '2026-11-25', 900.00,  'DECLINED',  'Not available', NOW(), NOW()),
    (2, 13, '2026-12-01', '2026-12-05', 360.00,  'PAID',      'Welcome!',    NOW(), NOW()),
    (2, 14, '2026-12-10', '2026-12-15', 2000.00, 'APPROVED',  'Enjoy!',      NOW(), NOW()),
    (2, 15, '2026-12-20', '2026-12-25', 350.00,  'PENDING',   null,          NOW(), NOW());

INSERT INTO payments (reservation_id, renter_id, landlord_id, amount, commission, landlord_payout, status, card_last_four, card_brand, transaction_id, receipt_number, paid_at, created_at)
VALUES
    (3, 2, 3, 1750.00, 175.00, 1575.00, 'COMPLETED', '4242', 'VISA',       'TXN-TEST-001', 'RCP-TEST-001', NOW(), NOW()),
    (6, 2, 3, 1000.00, 100.00, 900.00,  'COMPLETED', '1234', 'MASTERCARD', 'TXN-TEST-002', 'RCP-TEST-002', NOW(), NOW()),
    (10, 2, 3, 2500.00, 250.00, 2250.00, 'COMPLETED', '5678', 'VISA',      'TXN-TEST-003', 'RCP-TEST-003', NOW(), NOW()),
    (15, 2, 3, 360.00,  36.00,  324.00, 'COMPLETED', '9999', 'MASTERCARD', 'TXN-TEST-004', 'RCP-TEST-004', NOW(), NOW()),
    (17, 2, 3, 2000.00, 200.00, 1800.00, 'COMPLETED', '4242', 'VISA',      'TXN-TEST-005', 'RCP-TEST-005', NOW(), NOW());