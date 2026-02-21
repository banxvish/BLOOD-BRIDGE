// src/controllers/donorController.ts
import { Request, Response } from 'express';
import { donorSchema } from '../schemas/donorSchema';
import prisma from '../prisma/client';

export const registerDonor = async (req: Request, res: Response): Promise<void> => {
    const result = donorSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({ errors: result.error.format() });
        return;
    }

    try {
        const donor = await prisma.donor.create({
            data: {
                ...result.data,
                lastDonation: result.data.lastDonation ? new Date(result.data.lastDonation) : null,
            },
        });
        res.status(201).json(donor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error registering donor' });
    }
};

// Helper function to calculate distance in km using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

export const getDonors = async (req: Request, res: Response): Promise<void> => {
    const { bloodType, city, available, lat, lng } = req.query;

    try {
        let donors = await prisma.donor.findMany({
            where: {
                ...(bloodType ? { bloodType: String(bloodType) } : {}),
                ...(city ? { city: { contains: String(city), mode: 'insensitive' } } : {}),
                ...(available !== undefined ? { available: available === 'true' } : {}),
            },
        });

        // Compute distance and sort if lat & lng are provided
        if (lat && lng) {
            const userLat = parseFloat(String(lat));
            const userLng = parseFloat(String(lng));

            const donorsWithDistance = donors.map(donor => {
                if (donor.latitude && donor.longitude) {
                    const distKm = calculateDistance(userLat, userLng, donor.latitude, donor.longitude);
                    return { ...donor, distanceKm: distKm, distance: `${distKm.toFixed(1)} km` };
                }
                return { ...donor, distanceKm: Infinity, distance: null };
            });

            donorsWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);

            res.json(donorsWithDistance);
        } else {
            res.json(donors);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching donors' });
    }
};

export const updateDonor = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { available, contact, lastDonation } = req.body;

    try {
        const donor = await prisma.donor.update({
            where: { id: String(id) },
            data: {
                ...(available !== undefined ? { available } : {}),
                ...(contact !== undefined ? { contact } : {}),
                ...(lastDonation !== undefined ? { lastDonation: new Date(lastDonation) } : {}),
            },
        });
        res.json(donor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating donor' });
    }
};

export const deleteDonor = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        await prisma.donor.delete({
            where: { id: String(id) },
        });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting donor' });
    }
};
