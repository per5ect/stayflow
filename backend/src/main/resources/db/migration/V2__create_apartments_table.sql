CREATE TYPE apartment_type AS ENUM (
    'ROOM',
    'APARTMENT',
    'STUDIO',
    'HOUSE',
    'VILLA'
);

CREATE TABLE apartments (
                            id BIGSERIAL PRIMARY KEY,
                            landlord_id BIGINT NOT NULL REFERENCES users(id),
                            title VARCHAR(100) NOT NULL,
                            description TEXT,
                            price_per_night DECIMAL(10,2) NOT NULL,
                            street VARCHAR(255) NOT NULL,
                            city VARCHAR(100) NOT NULL,
                            country VARCHAR(100) NOT NULL,
                            rooms_count INTEGER NOT NULL,
                            apartment_type apartment_type NOT NULL,
                            status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                            photo_urls TEXT[],
                            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE apartment_available_dates (
                                           id BIGSERIAL PRIMARY KEY,
                                           apartment_id BIGINT NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
                                           available_from DATE NOT NULL,
                                           available_to DATE NOT NULL
);