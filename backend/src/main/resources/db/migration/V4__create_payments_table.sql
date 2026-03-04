CREATE TYPE payment_status AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
);

CREATE TABLE payments (
                          id BIGSERIAL PRIMARY KEY,
                          reservation_id BIGINT NOT NULL REFERENCES reservations(id),
                          renter_id BIGINT NOT NULL REFERENCES users(id),
                          landlord_id BIGINT NOT NULL REFERENCES users(id),
                          amount DECIMAL(10,2) NOT NULL,
                          commission DECIMAL(10,2) NOT NULL,
                          landlord_payout DECIMAL(10,2) NOT NULL,
                          status payment_status NOT NULL DEFAULT 'PENDING',
                          card_last_four VARCHAR(4) NOT NULL,
                          card_brand VARCHAR(20) NOT NULL,
                          transaction_id VARCHAR(100) NOT NULL UNIQUE,
                          receipt_number VARCHAR(100) NOT NULL UNIQUE,
                          failure_reason VARCHAR(255),
                          paid_at TIMESTAMP,
                          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);