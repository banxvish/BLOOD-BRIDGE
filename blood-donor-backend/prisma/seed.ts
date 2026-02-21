import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const donors = [
    { name: "Aarav Sharma", bloodType: "O+", contact: "+91 98765 43210", city: "Mumbai", address: "Andheri West, Mumbai", latitude: 19.1364, longitude: 72.8296, age: 28, lastDonation: new Date("2025-11-15"), available: true },
    { name: "Priya Patel", bloodType: "A+", contact: "+91 87654 32109", city: "Mumbai", address: "Dadar, Mumbai", latitude: 19.0178, longitude: 72.8478, age: 32, lastDonation: new Date("2025-09-20"), available: true },
    { name: "Rohan Deshmukh", bloodType: "B+", contact: "+91 76543 21098", city: "Pune", address: "Koregaon Park, Pune", latitude: 18.5362, longitude: 73.8930, age: 25, lastDonation: new Date("2025-12-01"), available: true },
    { name: "Sneha Kulkarni", bloodType: "AB+", contact: "+91 65432 10987", city: "Pune", address: "Shivaji Nagar, Pune", latitude: 18.5308, longitude: 73.8475, age: 30, lastDonation: new Date("2025-10-10"), available: true },
    { name: "Vikram Singh", bloodType: "O-", contact: "+91 54321 09876", city: "Delhi", address: "Connaught Place, New Delhi", latitude: 28.6315, longitude: 77.2167, age: 35, lastDonation: new Date("2025-08-05"), available: true },
    { name: "Ananya Gupta", bloodType: "A-", contact: "+91 43210 98765", city: "Delhi", address: "Saket, New Delhi", latitude: 28.5244, longitude: 77.2066, age: 22, lastDonation: null, available: true },
    { name: "Karthik Iyer", bloodType: "B-", contact: "+91 32109 87654", city: "Chennai", address: "T. Nagar, Chennai", latitude: 13.0418, longitude: 80.2341, age: 29, lastDonation: new Date("2025-07-22"), available: true },
    { name: "Divya Nair", bloodType: "O+", contact: "+91 21098 76543", city: "Chennai", address: "Anna Nagar, Chennai", latitude: 13.0850, longitude: 80.2101, age: 27, lastDonation: new Date("2025-11-30"), available: true },
    { name: "Arjun Reddy", bloodType: "A+", contact: "+91 10987 65432", city: "Hyderabad", address: "Banjara Hills, Hyderabad", latitude: 17.4156, longitude: 78.4347, age: 31, lastDonation: new Date("2025-06-18"), available: true },
    { name: "Meera Krishna", bloodType: "B+", contact: "+91 99887 76655", city: "Hyderabad", address: "Jubilee Hills, Hyderabad", latitude: 17.4326, longitude: 78.4071, age: 26, lastDonation: new Date("2025-10-25"), available: true },
    { name: "Rajesh Kumar", bloodType: "AB-", contact: "+91 88776 65544", city: "Bangalore", address: "Koramangala, Bangalore", latitude: 12.9352, longitude: 77.6245, age: 40, lastDonation: new Date("2025-05-12"), available: true },
    { name: "Lakshmi Venkatesh", bloodType: "O+", contact: "+91 77665 54433", city: "Bangalore", address: "Indiranagar, Bangalore", latitude: 12.9719, longitude: 77.6412, age: 33, lastDonation: new Date("2025-09-08"), available: true },
    { name: "Sanjay Mehta", bloodType: "A+", contact: "+91 66554 43322", city: "Ahmedabad", address: "Navrangpura, Ahmedabad", latitude: 23.0369, longitude: 72.5594, age: 38, lastDonation: new Date("2025-04-20"), available: false },
    { name: "Nisha Joshi", bloodType: "B+", contact: "+91 55443 32211", city: "Ahmedabad", address: "Satellite, Ahmedabad", latitude: 23.0155, longitude: 72.5268, age: 24, lastDonation: null, available: true },
    { name: "Amit Tiwari", bloodType: "O-", contact: "+91 44332 21100", city: "Kolkata", address: "Salt Lake, Kolkata", latitude: 22.5804, longitude: 88.4131, age: 29, lastDonation: new Date("2025-08-30"), available: true },
    { name: "Pooja Banerjee", bloodType: "A-", contact: "+91 33221 10099", city: "Kolkata", address: "Park Street, Kolkata", latitude: 22.5509, longitude: 88.3526, age: 36, lastDonation: new Date("2025-07-14"), available: true },
    { name: "Suresh Rao", bloodType: "AB+", contact: "+91 22110 09988", city: "Jaipur", address: "C-Scheme, Jaipur", latitude: 26.9050, longitude: 75.7926, age: 42, lastDonation: new Date("2025-03-05"), available: true },
    { name: "Kavita Devi", bloodType: "B-", contact: "+91 11009 98877", city: "Jaipur", address: "Malviya Nagar, Jaipur", latitude: 26.8579, longitude: 75.8103, age: 28, lastDonation: new Date("2025-12-10"), available: true },
    { name: "Manish Pandey", bloodType: "O+", contact: "+91 99001 12233", city: "Lucknow", address: "Gomti Nagar, Lucknow", latitude: 26.8567, longitude: 80.9831, age: 34, lastDonation: new Date("2025-06-22"), available: true },
    { name: "Ritu Agarwal", bloodType: "A+", contact: "+91 88112 23344", city: "Lucknow", address: "Hazratganj, Lucknow", latitude: 26.8500, longitude: 80.9500, age: 23, lastDonation: null, available: true },
    { name: "Deepak Chauhan", bloodType: "O+", contact: "+91 77223 34455", city: "Chandigarh", address: "Sector 17, Chandigarh", latitude: 30.7413, longitude: 76.7678, age: 30, lastDonation: new Date("2025-11-01"), available: true },
    { name: "Swati Mishra", bloodType: "B+", contact: "+91 66334 45566", city: "Bhopal", address: "Arera Colony, Bhopal", latitude: 23.2200, longitude: 77.4300, age: 27, lastDonation: new Date("2025-10-15"), available: true },
    { name: "Harsh Vardhan", bloodType: "AB+", contact: "+91 55445 56677", city: "Indore", address: "Vijay Nagar, Indore", latitude: 22.7500, longitude: 75.8900, age: 31, lastDonation: new Date("2025-09-28"), available: false },
    { name: "Neha Saxena", bloodType: "O-", contact: "+91 44556 67788", city: "Nagpur", address: "Dharampeth, Nagpur", latitude: 21.1500, longitude: 79.0800, age: 26, lastDonation: new Date("2025-08-12"), available: true },
    { name: "Gaurav Thakur", bloodType: "A-", contact: "+91 33667 78899", city: "Patna", address: "Boring Road, Patna", latitude: 25.6100, longitude: 85.1300, age: 37, lastDonation: new Date("2025-05-30"), available: true },
    { name: "Pallavi Sinha", bloodType: "B-", contact: "+91 22778 89900", city: "Ranchi", address: "Main Road, Ranchi", latitude: 23.3441, longitude: 85.3096, age: 25, lastDonation: null, available: true },
    { name: "Vivek Choudhary", bloodType: "O+", contact: "+91 11889 90011", city: "Guwahati", address: "Paltan Bazaar, Guwahati", latitude: 26.1445, longitude: 91.7362, age: 33, lastDonation: new Date("2025-07-05"), available: true },
    { name: "Anjali Verma", bloodType: "A+", contact: "+91 99990 01122", city: "Varanasi", address: "Assi Ghat, Varanasi", latitude: 25.2850, longitude: 83.0100, age: 29, lastDonation: new Date("2025-10-20"), available: true },
    { name: "Mohit Rawat", bloodType: "AB-", contact: "+91 88001 12233", city: "Dehradun", address: "Rajpur Road, Dehradun", latitude: 30.3255, longitude: 78.0421, age: 35, lastDonation: new Date("2025-04-15"), available: true },
    { name: "Tanvi Shah", bloodType: "B+", contact: "+91 77112 23344", city: "Surat", address: "Adajan, Surat", latitude: 21.1869, longitude: 72.7971, age: 24, lastDonation: new Date("2025-12-05"), available: true },
];

async function main() {
    console.log('Seeding 30 donors...');
    for (const donor of donors) {
        await prisma.donor.create({ data: donor });
    }
    console.log('✅ Successfully seeded 30 donors!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
