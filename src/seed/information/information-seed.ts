import * as bcrypt from 'bcrypt';

interface SeedUser {
    username: string;
    password: string;
    email: string;
}

interface SeedClient {
    name: string;
    phone: string;
    email: string;
}

interface SeedSupplier {
    phone: string;
    email: string; 
    address: string;
    city: string;
    country: string;
    postalCode: string;
}

interface SeedPharmaceuticalProduct {
    name: string;
    description: string;
    stocks: number;
    price: number;
}


interface SeedData {
    users: SeedUser[];
    products: SeedPharmaceuticalProduct[];
    suppliers: SeedSupplier[];
    clients: SeedClient[];
}


const salt = bcrypt.genSaltSync( 10 );

export const initialInformation: SeedData = {
    users: [
        {
            username: 'dav1dlynn',
            password: bcrypt.hashSync( '123456', salt ),
            email: 'dav1dlynn@gmail.com',
        },
        {
            username: 'mar1agarc1a',
            password: bcrypt.hashSync( '123456', salt ),
            email: 'mar1agarc1a@gmail.com',
        }
    ],
    products: [
        {
            name: 'Paracetamol',
            description: 'Analgesic and antipyretic medication',
            stocks: 100,
            price: 5000,
        },
        {
            name: 'Ibuprofen',
            description: 'Nonsteroidal anti-inflammatory drug (NSAID)',
            stocks: 80,
            price: 7000,
        },
        {
            name: 'Omeprazole',
            description: 'Proton-pump inhibitor medication',
            stocks: 60,
            price: 10000,
        },
        {
            name: 'Loratadine',
            description: 'Antihistamine medication',
            stocks: 50,
            price: 6000,
        },
        {
            name: 'Amoxicillin',
            description: 'Antibiotic medication',
            stocks: 70,
            price: 12000,
        },
        {
            name: 'Aspirin',
            description: 'Analgesic and anti-inflammatory medication',
            stocks: 90,
            price: 4000,
        },
        {
            name: 'Simvastatin',
            description: 'Statins medication for lowering cholesterol',
            stocks: 40,
            price: 15000,
        },
        {
            name: 'Cetirizine',
            description: 'Antihistamine medication',
            stocks: 55,
            price: 8000,
        },
        {
            name: 'Metformin',
            description: 'Medication for type 2 diabetes',
            stocks: 65,
            price: 11000,
        },
        {
            name: 'Warfarin',
            description: 'Anticoagulant medication',
            stocks: 30,
            price: 13000,
        }
    ],
    suppliers: [
        {
            phone: '1234567890',
            email: 'proveedor1@gmail.com',
            address: 'Calle 10 #20-30',
            city: 'Bogotá',
            country: 'Colombia',
            postalCode: '110111',
        },
        {
            phone: '0987654321',
            email: 'proveedor2@gmail.com',
            address: 'Carrera 20 #30-40',
            city: 'Medellín',
            country: 'Colombia',
            postalCode: '050101',
        },
        {
            phone: '1357924680',
            email: 'proveedor3@gmail.com',
            address: 'Avenida 30 #40-50',
            city: 'Cali',
            country: 'Colombia',
            postalCode: '760202',
        },
        {
            phone: '2468013579',
            email: 'proveedor4@gmail.com',
            address: 'Diagonal 40 #50-60',
            city: 'Barranquilla',
            country: 'Colombia',
            postalCode: '080303',
        },
        {
            phone: '9876543210',
            email: 'proveedor5@gmail.com',
            address: 'Calle 50 #60-70',
            city: 'Cartagena',
            country: 'Colombia',
            postalCode: '130404',
        }
    ],
    clients: [
        {
            name: 'Farmacia Los Andes',
            phone: '3216549870',
            email: 'farmacialosandes@gmail.com',
        },
        {
            name: 'Droguería San Rafael',
            phone: '7894561230',
            email: 'drogueriasanrafael@gmail.com',
        },
        {
            name: 'Farmaplus',
            phone: '6547891230',
            email: 'farmaplus@gmail.com',
        },
        {
            name: 'Droguería La Esperanza',
            phone: '9876543210',
            email: 'droguerialaesperanza@gmail.com',
        },
        {
            name: 'Farmacia La Estrella',
            phone: '4567891230',
            email: 'farmacialaestrella@gmail.com',
        }
    ]
}