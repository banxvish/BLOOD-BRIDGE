import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const today = new Date();

const donors = [
    // --- 1. MUMBAI (5) ---
    { name: "Aarav Sharma", bloodType: "O+", contact: "+91 98765 43210", city: "Mumbai", address: "Andheri West", latitude: 19.1364, longitude: 72.8296, age: 28, lastDonation: new Date(new Date().setDate(today.getDate() - 150)), available: true },
    { name: "Priya Patel", bloodType: "A+", contact: "+91 87654 32109", city: "Mumbai", address: "Dadar", latitude: 19.0178, longitude: 72.8478, age: 32, lastDonation: new Date(new Date().setDate(today.getDate() - 10)), available: true },
    { name: "Rohan Deshmukh", bloodType: "B+", contact: "+91 76543 21098", city: "Mumbai", address: "Bandra", latitude: 19.0596, longitude: 72.8295, age: 25, lastDonation: new Date(new Date().setDate(today.getDate() - 200)), available: false },
    { name: "Kareena Kapoor", bloodType: "AB-", contact: "+91 65432 10987", city: "Mumbai", address: "Juhu", latitude: 19.1048, longitude: 72.8265, age: 29, lastDonation: new Date(new Date().setDate(today.getDate() - 300)), available: true },
    { name: "Vijay Singh", bloodType: "O-", contact: "+91 54321 09876", city: "Mumbai", address: "Colaba", latitude: 18.9067, longitude: 72.8147, age: 34, lastDonation: null, available: true },

    // --- 2. PUNE (5) ---
    { name: "Sneha Kulkarni", bloodType: "AB+", contact: "+91 12345 67890", city: "Pune", address: "Shivaji Nagar", latitude: 18.5308, longitude: 73.8475, age: 30, lastDonation: new Date(new Date().setDate(today.getDate() - 180)), available: true },
    { name: "Amit Joshi", bloodType: "O+", contact: "+91 23456 78901", city: "Pune", address: "Koregaon Park", latitude: 18.5362, longitude: 73.8930, age: 27, lastDonation: new Date(new Date().setDate(today.getDate() - 45)), available: true },
    { name: "Neha Deshpande", bloodType: "A-", contact: "+91 34567 89012", city: "Pune", address: "Kothrud", latitude: 18.5074, longitude: 73.8197, age: 33, lastDonation: new Date(new Date().setDate(today.getDate() - 210)), available: false },
    { name: "Siddharth Patil", bloodType: "B+", contact: "+91 45678 90123", city: "Pune", address: "Viman Nagar", latitude: 18.5679, longitude: 73.9143, age: 26, lastDonation: new Date(new Date().setDate(today.getDate() - 110)), available: true },
    { name: "Pooja Pawar", bloodType: "O-", contact: "+91 56789 01234", city: "Pune", address: "Baner", latitude: 18.5590, longitude: 73.7868, age: 31, lastDonation: new Date(new Date().setDate(today.getDate() - 365)), available: true },

    // --- 3. DELHI (5) ---
    { name: "Vikram Singh", bloodType: "O-", contact: "+91 67890 12345", city: "Delhi", address: "Connaught Place", latitude: 28.6315, longitude: 77.2167, age: 35, lastDonation: null, available: true },
    { name: "Ananya Gupta", bloodType: "A-", contact: "+91 78901 23456", city: "Delhi", address: "Saket", latitude: 28.5244, longitude: 77.2066, age: 22, lastDonation: new Date(new Date().setDate(today.getDate() - 120)), available: true },
    { name: "Rahul Verma", bloodType: "B+", contact: "+91 89012 34567", city: "Delhi", address: "Vasant Kunj", latitude: 28.5298, longitude: 77.1610, age: 29, lastDonation: new Date(new Date().setDate(today.getDate() - 40)), available: true },
    { name: "Pooja Sharma", bloodType: "O+", contact: "+91 90123 45678", city: "Delhi", address: "Dwarka", latitude: 28.5823, longitude: 77.0500, age: 27, lastDonation: new Date(new Date().setDate(today.getDate() - 300)), available: true },
    { name: "Rishabh Kapoor", bloodType: "AB+", contact: "+91 01234 56789", city: "Delhi", address: "Lajpat Nagar", latitude: 28.5677, longitude: 77.2433, age: 34, lastDonation: new Date(new Date().setDate(today.getDate() - 100)), available: false },

    // --- 4. BANGALORE (5) ---
    { name: "Karthik Iyer", bloodType: "B-", contact: "+91 11223 34455", city: "Bangalore", address: "Koramangala", latitude: 12.9352, longitude: 77.6245, age: 29, lastDonation: new Date(new Date().setDate(today.getDate() - 85)), available: true },
    { name: "Lakshmi Venkatesh", bloodType: "O+", contact: "+91 22334 45566", city: "Bangalore", address: "Indiranagar", latitude: 12.9719, longitude: 77.6412, age: 33, lastDonation: new Date(new Date().setDate(today.getDate() - 400)), available: true },
    { name: "Rajesh Kumar", bloodType: "AB-", contact: "+91 33445 56677", city: "Bangalore", address: "Whitefield", latitude: 12.9698, longitude: 77.7499, age: 40, lastDonation: new Date(new Date().setDate(today.getDate() - 15)), available: false },
    { name: "Nandini Gowda", bloodType: "A+", contact: "+91 44556 67788", city: "Bangalore", address: "Jayanagar", latitude: 12.9250, longitude: 77.5938, age: 26, lastDonation: new Date(new Date().setDate(today.getDate() - 180)), available: true },
    { name: "Surya Prakash", bloodType: "O-", contact: "+91 55667 78899", city: "Bangalore", address: "Malleswaram", latitude: 13.0031, longitude: 77.5643, age: 32, lastDonation: null, available: true },

    // --- 5. CHENNAI (5) ---
    { name: "Divya Nair", bloodType: "O+", contact: "+91 66778 89900", city: "Chennai", address: "Anna Nagar", latitude: 13.0850, longitude: 80.2101, age: 27, lastDonation: new Date(new Date().setDate(today.getDate() - 250)), available: true },
    { name: "Vikram Sarabhai", bloodType: "A+", contact: "+91 77889 90011", city: "Chennai", address: "T. Nagar", latitude: 13.0418, longitude: 80.2341, age: 31, lastDonation: null, available: true },
    { name: "Meena Kumari", bloodType: "B+", contact: "+91 88990 01122", city: "Chennai", address: "Adyar", latitude: 13.0033, longitude: 80.2555, age: 24, lastDonation: new Date(new Date().setDate(today.getDate() - 95)), available: true },
    { name: "Suresh Babu", bloodType: "A-", contact: "+91 99001 12233", city: "Chennai", address: "Velachery", latitude: 12.9759, longitude: 80.2210, age: 29, lastDonation: new Date(new Date().setDate(today.getDate() - 25)), available: true },
    { name: "Arathi Krishnan", bloodType: "AB+", contact: "+91 00112 23344", city: "Chennai", address: "Mylapore", latitude: 13.0368, longitude: 80.2676, age: 35, lastDonation: new Date(new Date().setDate(today.getDate() - 150)), available: false },

    // --- 6. HYDERABAD (5) ---
    { name: "Arjun Reddy", bloodType: "A+", contact: "+91 11221 12211", city: "Hyderabad", address: "Banjara Hills", latitude: 17.4156, longitude: 78.4347, age: 31, lastDonation: new Date(new Date().setDate(today.getDate() - 50)), available: true },
    { name: "Meera Krishna", bloodType: "B+", contact: "+91 22332 23322", city: "Hyderabad", address: "Jubilee Hills", latitude: 17.4326, longitude: 78.4071, age: 26, lastDonation: new Date(new Date().setDate(today.getDate() - 110)), available: true },
    { name: "Sai Teja", bloodType: "O-", contact: "+91 33443 34433", city: "Hyderabad", address: "Kukatpally", latitude: 17.4849, longitude: 78.3888, age: 28, lastDonation: new Date(new Date().setDate(today.getDate() - 200)), available: false },
    { name: "Priya Anand", bloodType: "O+", contact: "+91 44554 45544", city: "Hyderabad", address: "HITEC City", latitude: 17.4435, longitude: 78.3772, age: 25, lastDonation: null, available: true },
    { name: "Vijay Devarakonda", bloodType: "AB-", contact: "+91 55665 56655", city: "Hyderabad", address: "Madhapur", latitude: 17.4483, longitude: 78.3915, age: 32, lastDonation: new Date(new Date().setDate(today.getDate() - 320)), available: true },

    // --- 7. KOLKATA (5) ---
    { name: "Subhas Bose", bloodType: "O+", contact: "+91 66776 66776", city: "Kolkata", address: "Salt Lake", latitude: 22.5804, longitude: 88.4131, age: 32, lastDonation: new Date(new Date().setDate(today.getDate() - 190)), available: true },
    { name: "Pooja Banerjee", bloodType: "A-", contact: "+91 77887 77887", city: "Kolkata", address: "Park Street", latitude: 22.5509, longitude: 88.3526, age: 28, lastDonation: new Date(new Date().setDate(today.getDate() - 35)), available: true }, // Ineligible
    { name: "Amit Tiwari", bloodType: "B+", contact: "+91 88998 88998", city: "Kolkata", address: "Howrah", latitude: 22.5958, longitude: 88.3236, age: 40, lastDonation: new Date(new Date().setDate(today.getDate() - 130)), available: false }, // Unavailable
    { name: "Anushka Das", bloodType: "AB+", contact: "+91 99009 99009", city: "Kolkata", address: "Alipore", latitude: 22.5325, longitude: 88.3308, age: 26, lastDonation: null, available: true },
    { name: "Rahul Chatterjee", bloodType: "O-", contact: "+91 00110 00110", city: "Kolkata", address: "New Town", latitude: 22.5835, longitude: 88.4616, age: 35, lastDonation: new Date(new Date().setDate(today.getDate() - 220)), available: true },

    // --- 8. AHMEDABAD (5) ---
    { name: "Sanjay Mehta", bloodType: "A+", contact: "+91 11221 22332", city: "Ahmedabad", address: "Navrangpura", latitude: 23.0369, longitude: 72.5594, age: 38, lastDonation: new Date(new Date().setDate(today.getDate() - 170)), available: true },
    { name: "Nisha Joshi", bloodType: "B+", contact: "+91 22332 33443", city: "Ahmedabad", address: "Satellite", latitude: 23.0155, longitude: 72.5268, age: 24, lastDonation: null, available: true },
    { name: "Hardik Patel", bloodType: "O+", contact: "+91 33443 44554", city: "Ahmedabad", address: "Bopal", latitude: 23.0333, longitude: 72.4630, age: 31, lastDonation: new Date(new Date().setDate(today.getDate() - 12)), available: true }, // Ineligible
    { name: "Bhavna Desai", bloodType: "A-", contact: "+91 44554 55665", city: "Ahmedabad", address: "Vastrapur", latitude: 23.0360, longitude: 72.5286, age: 29, lastDonation: new Date(new Date().setDate(today.getDate() - 250)), available: false }, // Unavailable
    { name: "Ramesh Shah", bloodType: "AB-", contact: "+91 55665 66776", city: "Ahmedabad", address: "Prahlad Nagar", latitude: 23.0084, longitude: 72.5020, age: 45, lastDonation: new Date(new Date().setDate(today.getDate() - 110)), available: true },

    // --- 9. JAIPUR (5) ---
    { name: "Suresh Rao", bloodType: "AB+", contact: "+91 66776 77887", city: "Jaipur", address: "C-Scheme", latitude: 26.9050, longitude: 75.7926, age: 42, lastDonation: new Date(new Date().setDate(today.getDate() - 250)), available: true },
    { name: "Kavita Devi", bloodType: "B-", contact: "+91 77887 88998", city: "Jaipur", address: "Malviya Nagar", latitude: 26.8579, longitude: 75.8103, age: 28, lastDonation: new Date(new Date().setDate(today.getDate() - 5)), available: true }, // Highly Ineligible
    { name: "Rohan Rajput", bloodType: "O+", contact: "+91 88998 99009", city: "Jaipur", address: "Vaishali Nagar", latitude: 26.9126, longitude: 75.7380, age: 34, lastDonation: null, available: false }, // Unavailable
    { name: "Meenakshi Singh", bloodType: "A+", contact: "+91 99009 00110", city: "Jaipur", address: "Mansarovar", latitude: 26.8569, longitude: 75.7601, age: 26, lastDonation: new Date(new Date().setDate(today.getDate() - 140)), available: true },
    { name: "Lokesh Sharma", bloodType: "O-", contact: "+91 00110 11221", city: "Jaipur", address: "Raja Park", latitude: 26.8969, longitude: 75.8277, age: 39, lastDonation: new Date(new Date().setDate(today.getDate() - 300)), available: true },

    // --- 10. LUCKNOW (5) ---
    { name: "Manish Pandey", bloodType: "O+", contact: "+91 11223 99887", city: "Lucknow", address: "Gomti Nagar", latitude: 26.8567, longitude: 80.9831, age: 34, lastDonation: new Date(new Date().setDate(today.getDate() - 160)), available: true },
    { name: "Ritu Agarwal", bloodType: "A+", contact: "+91 22334 88776", city: "Lucknow", address: "Hazratganj", latitude: 26.8500, longitude: 80.9500, age: 23, lastDonation: null, available: true },
    { name: "Amitabh Singh", bloodType: "B+", contact: "+91 33445 77665", city: "Lucknow", address: "Aliganj", latitude: 26.8906, longitude: 80.9424, age: 41, lastDonation: new Date(new Date().setDate(today.getDate() - 40)), available: true }, // Ineligible
    { name: "Shalini Verma", bloodType: "AB+", contact: "+91 44556 66554", city: "Lucknow", address: "Indira Nagar", latitude: 26.8778, longitude: 80.9845, age: 29, lastDonation: new Date(new Date().setDate(today.getDate() - 210)), available: false }, // Unavailable
    { name: "Ravi Kishore", bloodType: "O-", contact: "+91 55667 55443", city: "Lucknow", address: "Aashiana", latitude: 26.7909, longitude: 80.8931, age: 36, lastDonation: new Date(new Date().setDate(today.getDate() - 365)), available: true }
];

async function main() {
    console.log('Clearing old donor data...');
    await prisma.donor.deleteMany({});

    console.log(`Seeding exact 50 donors (5 per 10 cities) for AI analysis...`);
    for (const donor of donors) {
        await prisma.donor.create({ data: donor });
    }
    console.log('✅ Successfully seeded exact 50 AI test donors!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
