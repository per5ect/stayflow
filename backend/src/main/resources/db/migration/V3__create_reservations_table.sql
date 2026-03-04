CREATE TABLE reservations (
                              id BIGSERIAL PRIMARY KEY,
                              renter_id BIGINT NOT NULL REFERENCES users(id),
                              apartment_id BIGINT NOT NULL REFERENCES apartments(id),
                              check_in DATE NOT NULL,
                              check_out DATE NOT NULL,
                              total_price DECIMAL(10,2) NOT NULL,
                              status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                              landlord_message VARCHAR(500),
                              created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                              updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);