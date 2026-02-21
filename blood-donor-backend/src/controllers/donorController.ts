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

export const getDonors = async (req: Request, res: Response): Promise<void> => {
    const { bloodType, city, available } = req.query;

    try {
        const donors = await prisma.donor.findMany({
            where: {
                ...(bloodType ? { bloodType: String(bloodType) } : {}),
                ...(city ? { city: { contains: String(city), mode: 'insensitive' } } : {}),
                ...(available !== undefined ? { available: available === 'true' } : {}),
            },
        });
        res.json(donors);
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
